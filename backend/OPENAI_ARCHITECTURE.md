# ActionLens AI — OpenAI Integration & RAG Architecture

> **Location**: `backend/OPENAI_ARCHITECTURE.md`  
> **Status**: Technical Specification for AI Pipeline  
> **Target AI Stack**: OpenAI API (`gpt-4o`, `gpt-4o-mini`, `text-embedding-3-small`), FastAPI, LangChain  

---

## 1. AI Feature Matrix

| Feature | Model | Input | Output | Verification Method |
|---|---|---|---|---|
| **Recommendation Engine** | `gpt-4o-2024-08-06` | Region telemetry + User Role | Structured Action Plan JSON | Pydantic Schema Validation |
| **Community Photo Verification** | `gpt-4o-2024-08-06` (Vision) | Image URL + Report Text | Verification score & severity | Vision Flag Rules |
| **Assistant RAG Chat** | `gpt-4o` + SSE Stream | User Prompt + `pgvector` Context | Streaming text chunks + citations | Vector Similarity Threshold (> 0.75) |
| **Consequence Simulator** | `gpt-4o-mini` | Delay hours + Hazard Type | Scenario A vs Scenario B JSON | Pydantic `SimulationOutput` Schema |
| **Briefing Generator** | `gpt-4o` | Filter params + Active alerts | Executive Markdown Document | Structured Markdown Enforcer |

---

## 2. Consequence Simulator Schema

```python
from pydantic import BaseModel, Field
from typing import List

class ScenarioResult(BaseModel):
    label: str
    households_affected: int
    response_time: str
    resource_demand: str
    risk_level: str
    estimated_cost: str

class SimulationOutput(BaseModel):
    scenario_a: ScenarioResult
    scenario_b: ScenarioResult
    key_differences: List[str]
    recommendation: str
    confidence: float = Field(ge=0.0, le=1.0)
```

---

## 3. RAG Retrieval Engine (`pgvector`)

```sql
CREATE OR REPLACE FUNCTION match_documents (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id uuid,
  title text,
  description text,
  similarity float
)
LANGUAGE sql STABLE
AS $$
  SELECT
    resources.id,
    resources.title,
    resources.description,
    1 - (resources.embedding <=> query_embedding) AS similarity
  FROM resources
  WHERE 1 - (resources.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
$$;
```

---

## 4. Rate Limiting & Cost Optimization

1. **Structured Outputs**: Reduces output token count by eliminating conversational fluff.
2. **Result Caching**: Operational recommendations are cached in Postgres/Redis for 30 minutes per region/role pair.
3. **Fallback Strategy**: If OpenAI API returns an HTTP 429 or 5xx error, serve regional fallback action templates pre-computed from historical NDMA datasets.
