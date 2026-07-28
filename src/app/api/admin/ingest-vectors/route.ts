import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { prisma } from "@/lib/db";
import knowledgeBaseStatic from "@/data/hms-knowledge-base.json";
import { AntiHallucinationVectorStore } from "@/lib/ai/vector-store";

function semanticChunkText(text: string, maxChunkLength: number = 400): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const chunks: string[] = [];
  let currentChunk = "";

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > maxChunkLength && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      const words = currentChunk.split(" ");
      currentChunk = words.slice(Math.max(0, words.length - 15)).join(" ") + " " + sentence;
    } else {
      currentChunk += " " + sentence;
    }
  }

  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

export async function POST(req: NextRequest) {
  try {
    console.log("⚡ Starting Admin API Click-Based RAG Vector Sync & Embedding...");

    const apiKey = process.env.GEMINI_API_KEY || "";
    const ai = new GoogleGenAI({ apiKey });

    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const localVectorStore = new AntiHallucinationVectorStore();

    // 1. Fetch live Prisma database records
    const dbRooms = await prisma.room.findMany({
      include: { roomType: true },
    });

    const documentsToEmbed: Array<{
      id: string;
      category: "ROOM" | "FAQ" | "SPA" | "DINING" | "EVENT";
      title: string;
      content: string;
      metadata: any;
    }> = [];

    // Process & Chunk Rooms
    for (const room of dbRooms) {
      const rawContent = `[ENTITY: ROOM] [ROOM_TYPE: ${room.roomType.name}] [ROOM_NUMBER: #${room.roomNumber}] ${room.roomType.description} Base rate ₹${room.roomType.basePrice.toLocaleString()} per night. Max capacity ${room.roomType.capacity} guests. Amenities: ${Array.isArray(room.roomType.amenities) ? room.roomType.amenities.join(", ") : String(room.roomType.amenities)}. Status: ${room.status}.`;
      const chunks = semanticChunkText(rawContent);

      chunks.forEach((chunk, idx) => {
        documentsToEmbed.push({
          id: `room_${room.id}_chunk_${idx}`,
          category: "ROOM",
          title: `${room.roomType.name} (Suite #${room.roomNumber})`,
          content: chunk,
          metadata: {
            roomId: room.id,
            roomType: room.roomType.name,
            basePrice: room.roomType.basePrice,
            maxGuests: room.roomType.capacity,
            amenities: room.roomType.amenities,
            chunkIndex: idx,
          },
        });
      });
    }

    // Process & Chunk Static FAQs, Dining & Spa
    for (const doc of knowledgeBaseStatic.documents) {
      if (doc.category !== "ROOM") {
        const chunks = semanticChunkText(doc.content);
        chunks.forEach((chunk, idx) => {
          documentsToEmbed.push({
            id: `${doc.id}_chunk_${idx}`,
            category: doc.category as any,
            title: doc.title,
            content: chunk,
            metadata: {
              ...doc.metadata,
              chunkIndex: idx,
            },
          });
        });
      }
    }

    let supabaseUploadedCount = 0;

    // 2. Embed & Upsert each chunk into Vector Store & Supabase pgvector
    for (const doc of documentsToEmbed) {
      await localVectorStore.upsertDocument(
        doc.id,
        doc.category,
        doc.title,
        doc.content,
        doc.metadata
      );

      if (supabaseUrl && supabaseKey && apiKey) {
        try {
          const response = await ai.models.embedContent({
            model: "text-embedding-004",
            contents: `[CATEGORY: ${doc.category}] [TITLE: ${doc.title}] ${doc.content}`,
          });

          let embeddingVector: number[] = [];
          if (response && (response as any).embeddings && (response as any).embeddings.length > 0) {
            embeddingVector = (response as any).embeddings[0].values;
          }

          if (embeddingVector.length > 0) {
            await fetch(`${supabaseUrl}/rest/v1/hms_vector_documents`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                apikey: supabaseKey,
                Authorization: `Bearer ${supabaseKey}`,
                Prefer: "return=representation",
              },
              body: JSON.stringify({
                category: doc.category,
                title: doc.title,
                content: doc.content,
                metadata: doc.metadata,
                embedding: embeddingVector,
              }),
            });
            supabaseUploadedCount++;
          }
        } catch (err) {
          console.warn(`Supabase vector sync for ${doc.id}:`, err);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "RAG Vector DB successfully re-indexed and embedded!",
      totalChunksProcessed: documentsToEmbed.length,
      supabasePgvectorSynced: supabaseUploadedCount,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
