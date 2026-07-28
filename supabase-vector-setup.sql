-- ============================================================================
-- LUMINA GRAND HMS — SUPABASE PGVECTOR SETUP SCRIPT
-- Copy and paste this script into your Supabase SQL Editor (https://supabase.com/dashboard)
-- ============================================================================

-- 1. Enable pgvector Extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Create Vector Documents Table for 768-dimensional Google GenAI Embeddings
CREATE TABLE IF NOT EXISTS hms_vector_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB,
  embedding vector(768), -- 768-dimensional float vector
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS & Allow Public Read Policy
ALTER TABLE hms_vector_documents ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'hms_vector_documents' AND policyname = 'Allow public read access'
  ) THEN
    CREATE POLICY "Allow public read access" ON hms_vector_documents FOR SELECT USING (true);
    CREATE POLICY "Allow public insert access" ON hms_vector_documents FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- 3. Create IVFFlat Index for Ultra-Fast Sub-Millisecond Cosine Similarity Search
CREATE INDEX IF NOT EXISTS hms_vector_documents_embedding_idx
ON hms_vector_documents
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- 4. Create Native Cosine Similarity Search RPC Function (match_documents)
CREATE OR REPLACE FUNCTION match_documents (
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id UUID,
  category TEXT,
  title TEXT,
  content TEXT,
  metadata JSONB,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    hms_vector_documents.id,
    hms_vector_documents.category,
    hms_vector_documents.title,
    hms_vector_documents.content,
    hms_vector_documents.metadata,
    1 - (hms_vector_documents.embedding <=> query_embedding) AS similarity
  FROM hms_vector_documents
  WHERE 1 - (hms_vector_documents.embedding <=> query_embedding) > match_threshold
  ORDER BY hms_vector_documents.embedding <=> query_embedding ASC
  LIMIT match_count;
END;
$$;
