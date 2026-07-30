-- ==============================================================================
-- ActionLens Phase 5 Migration: Vector Search & RAG Support (pgvector)
-- ==============================================================================

-- 1. Enable Vector Extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Add Embedding Column to Emergency Resources
ALTER TABLE public.emergency_resources
ADD COLUMN IF NOT EXISTS embedding vector(1536);

-- 3. Create Cosine Similarity Vector Search RPC Function
CREATE OR REPLACE FUNCTION match_emergency_resources (
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.2,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id uuid,
  title text,
  category text,
  summary text,
  content text,
  region text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    er.id,
    er.title,
    er.category,
    er.summary,
    er.content,
    er.region,
    1 - (er.embedding <=> query_embedding) AS similarity
  FROM public.emergency_resources er
  WHERE er.embedding IS NOT NULL
    AND 1 - (er.embedding <=> query_embedding) > match_threshold
  ORDER BY er.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
