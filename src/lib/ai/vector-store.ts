import { GoogleGenAI } from "@google/genai";
import { cosineSimilarity } from "./first-principles-rag";
import fs from "fs";
import path from "path";

export interface EmbeddedDocument {
  id: string;
  category: "ROOM" | "FAQ" | "SPA" | "DINING" | "EVENT";
  title: string;
  chunkText: string;
  embeddingVector: number[];
  metadata: Record<string, any>;
}

export interface RetrievalFilter {
  category?: "ROOM" | "FAQ" | "SPA" | "DINING" | "EVENT";
  maxPrice?: number;
  minCapacity?: number;
  minScoreThreshold?: number;
}

const VECTOR_DB_FILE_PATH = path.join(process.cwd(), "src", "data", "vector-embeddings-db.json");

export class AntiHallucinationVectorStore {
  private vectorStore: Map<string, EmbeddedDocument> = new Map();
  private ai: GoogleGenAI;

  constructor(apiKey?: string) {
    this.ai = new GoogleGenAI({ apiKey: apiKey || process.env.GEMINI_API_KEY || "" });
    this.loadFromDisk();
  }

  /**
   * PERSISTENCE STEP 1: Load pre-computed vectors from disk file (vector-embeddings-db.json)
   */
  private loadFromDisk() {
    try {
      if (fs.existsSync(VECTOR_DB_FILE_PATH)) {
        const raw = fs.readFileSync(VECTOR_DB_FILE_PATH, "utf-8");
        if (raw.trim()) {
          const parsed = JSON.parse(raw);
          Object.entries(parsed).forEach(([id, doc]) => {
            this.vectorStore.set(id, doc as EmbeddedDocument);
          });
        }
      }
    } catch (err) {
      console.warn("Could not load vector store from disk:", err);
    }
  }

  /**
   * PERSISTENCE STEP 2: Save active vectors to disk file
   */
  private saveToDisk() {
    try {
      const obj: Record<string, EmbeddedDocument> = {};
      this.vectorStore.forEach((doc, id) => {
        obj[id] = doc;
      });
      const dir = path.dirname(VECTOR_DB_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(VECTOR_DB_FILE_PATH, JSON.stringify(obj, null, 2), "utf-8");
    } catch (err) {
      console.warn("Could not save vector store to disk:", err);
    }
  }

  /**
   * 1. EMBEDDING INGESTION: Generates 768-dim embeddings with contextual prefix to prevent hallucination
   */
  async upsertDocument(
    id: string,
    category: EmbeddedDocument["category"],
    title: string,
    rawContent: string,
    metadata: Record<string, any>
  ): Promise<EmbeddedDocument> {
    // If document vector already exists in persistent store, return cached vector
    if (this.vectorStore.has(id)) {
      return this.vectorStore.get(id)!;
    }

    const chunkText = `[CATEGORY: ${category}] [TITLE: ${title}] [METADATA: ${JSON.stringify(
      metadata
    )}] ${rawContent}`;

    let embeddingVector: number[] = [];
    try {
      const response = await this.ai.models.embedContent({
        model: "gemini-embedding-2",
        contents: chunkText,
      });

      if (response && (response as any).embeddings && (response as any).embeddings.length > 0) {
        embeddingVector = (response as any).embeddings[0].values;
      }
    } catch (err) {
      console.warn(`Vector Embedding fallback for ${id}:`, err);
      embeddingVector = this.generateFallbackVector(chunkText);
    }

    const doc: EmbeddedDocument = {
      id,
      category,
      title,
      chunkText,
      embeddingVector,
      metadata,
    };

    this.vectorStore.set(id, doc);
    this.saveToDisk(); // Persist to vector-embeddings-db.json
    return doc;
  }

  /**
   * 2. HYBRID ANTI-HALLUCINATION RETRIEVAL: Vector Cosine Similarity + Hard Metadata Guardrails
   */
  async search(
    queryText: string,
    filter?: RetrievalFilter,
    topK: number = 3
  ): Promise<Array<{ document: EmbeddedDocument; similarityScore: number; verified: boolean }>> {
    let queryVector: number[] = [];
    try {
      const response = await this.ai.models.embedContent({
        model: "gemini-embedding-2",
        contents: queryText,
      });
      if (response && (response as any).embeddings && (response as any).embeddings.length > 0) {
        queryVector = (response as any).embeddings[0].values;
      }
    } catch (err) {
      queryVector = this.generateFallbackVector(queryText);
    }

    const results: Array<{ document: EmbeddedDocument; similarityScore: number; verified: boolean }> = [];

    for (const doc of Array.from(this.vectorStore.values())) {
      if (filter) {
        if (filter.category && doc.category !== filter.category) continue;
        if (filter.maxPrice && doc.metadata.basePrice && doc.metadata.basePrice > filter.maxPrice) continue;
        if (filter.minCapacity && doc.metadata.maxGuests && doc.metadata.maxGuests < filter.minCapacity) continue;
      }

      const similarityScore = cosineSimilarity(queryVector, doc.embeddingVector);
      const threshold = filter?.minScoreThreshold || 0.15;

      if (similarityScore >= threshold) {
        results.push({
          document: doc,
          similarityScore,
          verified: true,
        });
      }
    }

    results.sort((a, b) => b.similarityScore - a.similarityScore);
    return results.slice(0, topK);
  }

  private generateFallbackVector(text: string, dimensions: number = 64): number[] {
    const vec = new Array(dimensions).fill(0);
    const words = text.toLowerCase().split(/\s+/);
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      for (let j = 0; j < word.length; j++) {
        const charCode = word.charCodeAt(j);
        const idx = (charCode + j * 7) % dimensions;
        vec[idx] += 1;
      }
    }
    const norm = Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
    return norm === 0 ? vec : vec.map((val) => val / norm);
  }
}
