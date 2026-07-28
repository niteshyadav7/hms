import { GoogleGenAI } from "@google/genai";
import { AntiHallucinationVectorStore, EmbeddedDocument } from "./vector-store";

export interface OptimizedQueryResult {
  query: string;
  intent: "ROOM_SEARCH" | "MY_BOOKINGS" | "ORDER_DINING" | "BOOK_SPA" | "USER_PROFILE" | "GENERAL_FAQ";
  extractedMetadata: {
    maxBudget?: number;
    guestCount?: number;
    category?: string;
  };
  retrievedContexts: Array<{
    title: string;
    content: string;
    similarityScore: number;
    verified: boolean;
  }>;
  augmentedPrompt: string;
  cached: boolean;
}

// In-Memory Semantic LRU Query Cache (Production Optimization)
const QUERY_CACHE = new Map<string, { result: OptimizedQueryResult; expiresAt: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 mins

export class ProductionOnlineQueryPipeline {
  private vectorStore: AntiHallucinationVectorStore;
  private ai: GoogleGenAI;

  constructor() {
    this.vectorStore = new AntiHallucinationVectorStore();
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
  }

  /**
   * ADVANCED OPTIMIZATION 1: Multi-Query Expansion & Synonym Enrichment
   */
  private generateQueryVariations(query: string): string[] {
    const lower = query.toLowerCase();
    const variations: string[] = [query];

    if (lower.includes("overwater") || lower.includes("suite") || lower.includes("room")) {
      variations.push(`${query} lagoon oceanfront bungalow`);
      variations.push(`${query} private pool sanctuary villa`);
    } else if (lower.includes("food") || lower.includes("eat") || lower.includes("dining")) {
      variations.push(`${query} gourmet room service michelin menu`);
    } else if (lower.includes("spa") || lower.includes("massage")) {
      variations.push(`${query} celestial lunar hydrotherapy wellness`);
    }

    return Array.from(new Set(variations));
  }

  /**
   * ADVANCED OPTIMIZATION 2: Reciprocal Rank Fusion (RRF) Reranking
   */
  private applyReciprocalRankFusion(
    searchResultSets: Array<Array<{ document: EmbeddedDocument; similarityScore: number; verified: boolean }>>
  ): Array<{ document: EmbeddedDocument; similarityScore: number; verified: boolean }> {
    const k = 60; // Standard RRF constant
    const rrfScores = new Map<string, { doc: EmbeddedDocument; rrfScore: number; originalScore: number; verified: boolean }>();

    searchResultSets.forEach((results) => {
      results.forEach((item, rank) => {
        const id = item.document.id;
        const current = rrfScores.get(id);
        const addedRrfScore = 1 / (k + (rank + 1));

        if (current) {
          current.rrfScore += addedRrfScore;
          current.originalScore = Math.max(current.originalScore, item.similarityScore);
        } else {
          rrfScores.set(id, {
            doc: item.document,
            rrfScore: addedRrfScore,
            originalScore: item.similarityScore,
            verified: item.verified,
          });
        }
      });
    });

    const merged = Array.from(rrfScores.values()).map((v) => ({
      document: v.doc,
      similarityScore: v.originalScore + v.rrfScore * 0.1,
      verified: v.verified,
    }));

    merged.sort((a, b) => b.similarityScore - a.similarityScore);
    return merged;
  }

  /**
   * ONLINE PHASE STEP 1: Query Pre-Processing & Entity Extraction
   */
  private preprocessQuery(userQuery: string) {
    const lower = userQuery.toLowerCase();

    let maxBudget: number | undefined;
    const budgetMatch = lower.match(/(?:under|below|less than|within|upto)\s*(?:₹|rs\.?|inr)?\s*(\d+[\d,]*)/i);
    if (budgetMatch) {
      maxBudget = parseInt(budgetMatch[1].replace(/,/g, ""), 10);
    }

    let guestCount: number | undefined;
    const guestMatch = lower.match(/(\d+)\s*(?:adults?|guests?|people|persons?)/i);
    if (guestMatch) {
      guestCount = parseInt(guestMatch[1], 10);
    }

    let intent: OptimizedQueryResult["intent"] = "GENERAL_FAQ";
    if (lower.includes("who am i") || lower.includes("profile") || lower.includes("loyalty")) {
      intent = "USER_PROFILE";
    } else if (lower.includes("my booking") || lower.includes("my stay") || lower.includes("reservation")) {
      intent = "MY_BOOKINGS";
    } else if (
      lower.includes("book") ||
      lower.includes("room") ||
      lower.includes("suite") ||
      lower.includes("villa") ||
      lower.includes("overwater") ||
      lower.includes("hotel") ||
      lower.includes("resort") ||
      lower.includes("cheap") ||
      lower.includes("lowest") ||
      lower.includes("affordable") ||
      lower.includes("budget") ||
      lower.includes("price") ||
      lower.includes("cost")
    ) {
      intent = "ROOM_SEARCH";
    } else if (lower.includes("food") || lower.includes("dining") || lower.includes("order") || lower.includes("eat") || lower.includes("menu")) {
      intent = "ORDER_DINING";
    } else if (lower.includes("spa") || lower.includes("massage") || lower.includes("wellness")) {
      intent = "BOOK_SPA";
    }

    return { maxBudget, guestCount, intent };
  }

  /**
   * ONLINE PHASE STEP 2: Execute Semantic Caching + Multi-Query RRF + Hybrid Guardrails
   */
  async processUserQuery(userQuery: string): Promise<OptimizedQueryResult> {
    const cacheKey = userQuery.toLowerCase().trim();
    const now = Date.now();

    // Check Semantic Query Cache (< 1ms Hit)
    if (QUERY_CACHE.has(cacheKey)) {
      const entry = QUERY_CACHE.get(cacheKey)!;
      if (entry.expiresAt > now) {
        return { ...entry.result, cached: true };
      }
      QUERY_CACHE.delete(cacheKey);
    }

    const { maxBudget, guestCount, intent } = this.preprocessQuery(userQuery);

    let categoryFilter: "ROOM" | "FAQ" | "SPA" | "DINING" | "EVENT" | undefined;
    if (intent === "ROOM_SEARCH") categoryFilter = "ROOM";
    else if (intent === "ORDER_DINING") categoryFilter = "DINING";
    else if (intent === "BOOK_SPA") categoryFilter = "SPA";

    // Multi-Query Search
    const queryVariations = this.generateQueryVariations(userQuery);
    const searchResultSets = await Promise.all(
      queryVariations.map((variant) =>
        this.vectorStore.search(
          variant,
          {
            category: categoryFilter,
            maxPrice: maxBudget,
            minCapacity: guestCount,
            minScoreThreshold: 0.15,
          },
          3
        )
      )
    );

    // Apply Reciprocal Rank Fusion (RRF)
    const fusedResults = this.applyReciprocalRankFusion(searchResultSets).slice(0, 3);

    const retrievedContexts = fusedResults.map((res) => ({
      title: res.document.title,
      content: res.document.chunkText,
      similarityScore: res.similarityScore,
      verified: res.verified,
    }));

    const contextText = retrievedContexts.length > 0
      ? retrievedContexts.map((c) => `[VERIFIED DB SOURCE: ${c.title}]\n${c.content}`).join("\n\n")
      : "No matching database record found.";

    const augmentedPrompt = `
System Instruction: You are Lumina AI Mode, an enterprise luxury resort AI assistant. Answer the user request strictly using the verified live database context below. Do NOT invent prices or room names.

USER QUERY: "${userQuery}"

VERIFIED LIVE DATABASE CONTEXT:
${contextText}
`;

    const result: OptimizedQueryResult = {
      query: userQuery,
      intent,
      extractedMetadata: {
        maxBudget,
        guestCount,
        category: categoryFilter,
      },
      retrievedContexts,
      augmentedPrompt,
      cached: false,
    };

    // Store in Semantic LRU Cache
    QUERY_CACHE.set(cacheKey, { result, expiresAt: now + CACHE_TTL_MS });

    return result;
  }
}
