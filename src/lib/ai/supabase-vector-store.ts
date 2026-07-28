import { GoogleGenAI } from "@google/genai";

export interface SupabaseVectorDocument {
  id?: string;
  category: string;
  title: string;
  content: string;
  metadata: Record<string, any>;
  embedding?: number[];
}

/**
 * Supabase pgvector Helper Class
 * Connects Google GenAI @google/genai embeddings with Supabase PostgreSQL pgvector
 */
export class SupabaseVectorStore {
  private ai: GoogleGenAI;
  private supabaseUrl: string;
  private supabaseKey: string;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
    this.supabaseUrl = process.env.SUPABASE_URL || "https://your-project.supabase.co";
    this.supabaseKey = process.env.SUPABASE_ANON_KEY || "";
  }

  /**
   * 1. Compute 768-dim Embedding using @google/genai text-embedding-004
   */
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await this.ai.models.embedContent({
        model: "gemini-embedding-2",
        contents: text,
      });

      if (response && (response as any).embeddings && (response as any).embeddings.length > 0) {
        return (response as any).embeddings[0].values;
      }
      return [];
    } catch (err) {
      console.warn("Embedding generation fallback:", err);
      return [];
    }
  }

  /**
   * 2. Insert Document & Vector Embedding into Supabase pgvector Table
   */
  async insertVectorDocument(doc: SupabaseVectorDocument) {
    const embedding = await this.generateEmbedding(`[CATEGORY: ${doc.category}] [TITLE: ${doc.title}] ${doc.content}`);

    const res = await fetch(`${this.supabaseUrl}/rest/v1/hms_vector_documents`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: this.supabaseKey,
        Authorization: `Bearer ${this.supabaseKey}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        category: doc.category,
        title: doc.title,
        content: doc.content,
        metadata: doc.metadata,
        embedding: embedding,
      }),
    });

    return res.json();
  }

  /**
   * 3. Perform Cosine Similarity Search using Supabase RPC Function (match_documents)
   */
  async searchCosineSimilarity(query: string, matchThreshold: number = 0.15, matchCount: number = 3) {
    const queryEmbedding = await this.generateEmbedding(query);

    const res = await fetch(`${this.supabaseUrl}/rest/v1/rpc/match_documents`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: this.supabaseKey,
        Authorization: `Bearer ${this.supabaseKey}`,
      },
      body: JSON.stringify({
        query_embedding: queryEmbedding,
        match_threshold: matchThreshold,
        match_count: matchCount,
      }),
    });

    return res.json();
  }
}
