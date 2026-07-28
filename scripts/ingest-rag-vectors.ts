import { GoogleGenAI } from "@google/genai";
import { prisma } from "../src/lib/db";
import knowledgeBaseStatic from "../src/data/hms-knowledge-base.json";

interface ChunkToEmbed {
  id: string;
  documentId: string;
  title: string;
  category: string;
  chunkText: string;
  content: string;
  metadata: any;
}

/**
 * Enterprise Production Vector Ingestion Script
 */
export async function runProductionVectorIngestion() {
  console.log("⚡ Starting Lumina Enterprise Vector Ingestion Pipeline...");

  const apiKey = process.env.GEMINI_API_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const ai = new GoogleGenAI({ apiKey: apiKey || "" });

  const documentsToEmbed: ChunkToEmbed[] = [];

  // 1. Ingest Knowledge Base Documents
  for (const doc of knowledgeBaseStatic.documents) {
    const headerPrefix = `[CATEGORY: ${doc.category}] [TITLE: ${doc.title}] `;
    const textToChunk = doc.content;

    // Chunking algorithm: 400 chars with 50 char overlap
    const chunkSize = 400;
    const overlap = 50;
    let start = 0;
    let chunkIdx = 0;

    while (start < textToChunk.length) {
      const end = Math.min(start + chunkSize, textToChunk.length);
      const snippet = textToChunk.substring(start, end);

      documentsToEmbed.push({
        id: `${doc.id}_chunk_${chunkIdx}`,
        documentId: doc.id,
        title: doc.title,
        category: doc.category,
        chunkText: headerPrefix + snippet,
        content: snippet,
        metadata: doc.metadata || {},
      });

      if (end >= textToChunk.length) break;
      start += chunkSize - overlap;
      chunkIdx++;
    }
  }

  // 2. Ingest Active Prisma DB Rooms & Suites
  try {
    const rooms = await prisma.room.findMany({ include: { roomType: true } });
    for (const room of rooms) {
      const headerPrefix = `[CATEGORY: ROOM] [TITLE: ${room.roomType.name}] `;
      const fullText = `Suite ${room.roomType.name} (Room #${room.roomNumber}) is available at ₹${room.roomType.basePrice.toLocaleString()} per night. Max capacity ${room.roomType.capacity} guests. Status: ${room.status}. Description: ${room.roomType.description || "Luxury suite"}.`;

      documentsToEmbed.push({
        id: `room_${room.id}_chunk_0`,
        documentId: room.id,
        title: room.roomType.name,
        category: "ROOM",
        chunkText: headerPrefix + fullText,
        content: fullText,
        metadata: {
          roomId: room.id,
          roomType: room.roomType.name,
          basePrice: room.roomType.basePrice,
          capacity: room.roomType.capacity,
          status: room.status,
          action: "BOOK_ROOM",
        },
      });
    }
  } catch (dbErr) {
    console.warn("⚠️ Database room fetch warning:", dbErr);
  }

  console.log(`✨ Generated ${documentsToEmbed.length} semantic chunks for vector embedding.`);

  // 3. Compute Google GenAI Embeddings & Insert into Supabase pgvector
  let successCount = 0;
  for (const doc of documentsToEmbed) {
    let embeddingVector: number[] = [];
    try {
      if (apiKey) {
        const response = await ai.models.embedContent({
          model: "embedding-001",
          contents: `[CATEGORY: ${doc.category}] [TITLE: ${doc.title}] ${doc.content}`,
        });
        if (response && (response as any).embeddings && (response as any).embeddings.length > 0) {
          embeddingVector = (response as any).embeddings[0].values;
        }
      }
    } catch (err) {
      // Fallback
    }

    // Insert into Supabase REST Endpoint if configured
    if (supabaseUrl && supabaseKey && embeddingVector.length > 0) {
      try {
        const res = await fetch(`${supabaseUrl}/rest/v1/hms_vectors`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            Prefer: "resolution=merge-duplicates",
          },
          body: JSON.stringify({
            id: doc.id,
            document_id: doc.documentId,
            title: doc.title,
            category: doc.category,
            chunk_text: doc.chunkText,
            content: doc.content,
            metadata: doc.metadata,
            embedding: embeddingVector,
          }),
        });

        if (res.ok) successCount++;
      } catch (subErr) {
        console.warn(`Supabase vector insert error for chunk ${doc.id}:`, subErr);
      }
    }
  }

  console.log(`🎉 Ingestion Complete! Successfully processed ${documentsToEmbed.length} vector chunks (${successCount} uploaded to Supabase pgvector).`);
  return { processed: documentsToEmbed.length, uploaded: successCount };
}

// Execute standalone when invoked via CLI
if (require.main === module) {
  runProductionVectorIngestion()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Fatal ingestion error:", err);
      process.exit(1);
    });
}
