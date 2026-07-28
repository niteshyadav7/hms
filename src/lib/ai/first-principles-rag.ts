import { GoogleGenAI } from "@google/genai";

// -------------------------------------------------------------
// 1. FIRST-PRINCIPLES MATH: Cosine Similarity Vector Calculation
// -------------------------------------------------------------
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length || vecA.length === 0) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  return denominator === 0 ? 0 : dotProduct / denominator;
}

// -------------------------------------------------------------
// 2. GEMINI EMBEDDING & RAG SERVICE
// -------------------------------------------------------------
export class FirstPrinciplesRAG {
  private ai: GoogleGenAI;

  constructor(apiKey?: string) {
    this.ai = new GoogleGenAI({ apiKey: apiKey || process.env.GEMINI_API_KEY || "" });
  }

  /**
   * Generates a 768-dimensional vector embedding for text using Google GenAI SDK
   */
  async getEmbedding(text: string): Promise<number[]> {
    try {
      const response = await this.ai.models.embedContent({
        model: "gemini-embedding-2",
        contents: text,
      });

      if (response && (response as any).embeddings && (response as any).embeddings.length > 0) {
        return (response as any).embeddings[0].values;
      }
      if (response && (response as any).embedding && (response as any).embedding.values) {
        return (response as any).embedding.values;
      }
      return [];
    } catch (err) {
      console.warn("Gemini embedContent fallback (using deterministic token vector):", err);
      // Fallback pseudo-embedding vector for offline / keyless testing
      return this.fallbackPseudoEmbedding(text);
    }
  }

  /**
   * First-Principles Vector Retrieval: Rank documents by Cosine Similarity
   */
  async searchTopK(
    query: string,
    documents: Array<{ id: string; title: string; content: string; metadata?: any }>,
    topK: number = 3
  ): Promise<Array<{ document: any; similarityScore: number }>> {
    const queryVector = await this.getEmbedding(query);

    const scoredDocs = await Promise.all(
      documents.map(async (doc) => {
        const docVector = await this.getEmbedding(doc.title + " " + doc.content);
        const similarityScore = cosineSimilarity(queryVector, docVector);
        return { document: doc, similarityScore };
      })
    );

    // Sort descending by similarity score
    scoredDocs.sort((a, b) => b.similarityScore - a.similarityScore);
    return scoredDocs.slice(0, topK);
  }

  /**
   * Deterministic fallback vector builder when GEMINI_API_KEY is not set
   */
  private fallbackPseudoEmbedding(text: string, dimensions: number = 64): number[] {
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
