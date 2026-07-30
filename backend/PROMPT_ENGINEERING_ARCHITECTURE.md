# ActionLens AI — Prompt Engineering Architecture & Strategy

> **Location**: `backend/PROMPT_ENGINEERING_ARCHITECTURE.md`  
> **Status**: Living Architectural Specification  

---

## 1. Prompt Engineering Philosophy

ActionLens AI treats prompts as **first-class engineering assets**. Prompts are not hardcoded ad-hoc strings in handlers; they are:

1. **Version-Controlled**: Tracked in `ai_prompts` database registry with version tags (`v1.0.0`, `v1.1.0`).
2. **Modular & Reusable**: Built using object-oriented Python classes (`RecommendationPrompt`, `BriefingPrompt`, `VisionPrompt`).
3. **Strictly Typed & Schema-Enforced**: Every generation relies on OpenAI Structured Outputs (`response_format={"type": "json_object"}`).
4. **Explainable & Auditable**: Prompt outputs include explicit reasoning chains and supporting telemetry evidence.
5. **Cost-Tracked**: Every OpenAI API invocation logs token counts (input/output) and estimated USD costs.

---

## 2. Platform AI Architecture

```
User Request (Next.js Frontend)
       │
       ▼
Next.js API Handler (Proxy & Validation)
       │
       ▼
FastAPI AI Service Layer (`fastapi/app/ai/service.py`)
 ├── PromptRegistry (`fastapi/app/ai/registry.py`) ◄── Database Table `ai_prompts`
 ├── ContextBuilder (`fastapi/app/ai/context.py`)  ◄── Hydro-Met & Telemetry Data
 ├── AIService Client (`fastapi/app/ai/client.py`)  ◄── AsyncOpenAI Singleton
 ├── OutputValidator (`fastapi/app/ai/validator.py`)◄── Pydantic Schema Validation
 └── CostTracker (`fastapi/app/ai/cost_tracker.py`)  ◄── Usage & USD Log (`ai_usage_logs`)
       │
       ▼
OpenAI Platform (GPT-4o / GPT-4.1 / text-embedding-3-small)
```

---

## 3. Model Assignment Matrix

| Feature | Primary Model | Fallback Model | Temp | Max Tokens | Output Format |
|---|---|---|---|---|---|
| **Personalized Recommendations** | `gpt-4o` | `gpt-4o-mini` | 0.20 | 1500 | JSON Schema |
| **Disaster Executive Briefings** | `gpt-4o` | `gpt-4o` | 0.30 | 2000 | Markdown |
| **Vision Verification** | `gpt-4o` (Vision) | `gpt-4o` | 0.10 | 1000 | JSON Schema |
| **Impact Consequence Simulator** | `gpt-4o` | `gpt-4o-mini` | 0.20 | 1000 | JSON Schema |
| **AI Assistant (RAG Stream)** | `gpt-4o` | `gpt-4o-mini` | 0.40 | 1500 | Server-Sent Events |
| **Explainability Auditor** | `gpt-4o` | `gpt-4o-mini` | 0.20 | 800 | JSON Schema |
| **Knowledge Base Embeddings** | `text-embedding-3-small` | `text-embedding-3-small` | N/A | 1536d | Float Vector |

---

## 4. Prompt Versioning & Database Sync

Prompts are loaded through a **two-tier resolution strategy**:

1. **Database Registry (`ai_prompts` table)**: Priority 1. Fetches active prompt by `name` and `version`.
2. **Local Python Template (`fastapi/app/prompts/`)**: Priority 2 fallback if database connection is unavailable.

### Rolling Back Prompts
If prompt `v1.2.0` introduces hallucination or unexpected performance degradation, flipping `active = false` on `v1.2.0` automatically routes requests back to `v1.1.0` instantaneously without requiring a backend redeployment.

---

## 5. Cost Tracking & Token Metrics

Token costs are calculated dynamically per completion:

* **GPT-4o Input**: $2.50 per 1M tokens
* **GPT-4o Output**: $10.00 per 1M tokens
* **text-embedding-3-small**: $0.02 per 1M tokens

Usage records are persisted to `ai_usage_logs`:
```sql
INSERT INTO public.ai_usage_logs 
(user_id, feature, prompt_name, prompt_version, model, prompt_tokens, completion_tokens, total_tokens, estimated_cost_usd, latency_ms)
VALUES (...);
```

---

## 6. Guardrails & Hallucination Prevention

1. **Structured Outputs**: Direct JSON schema matching enforces expected key/value types.
2. **Confidence Thresholding**: Recommendations scoring below `0.70` confidence are flagged for human supervisor review.
3. **Evidence Binding**: Prompts strictly prohibit generating claims without linking to a verified input evidence item (river gauge, rain density, satellite radar).
