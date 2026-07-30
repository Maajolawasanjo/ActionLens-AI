# ActionLens AI — Backend Changelog

> **Location**: `backend/CHANGELOG.md`  
> **Status**: Official Backend Revision History  

---

## [1.7.0-production-hardening] - 2026-07-26

### Added & Completed (Production Hardening & Operational Excellence)
- **Infrastructure Observability**: Created `ObservabilityService` ([`fastapi/app/utils/observability.py`](file:///home/exploitx/Documents/MA%27AJO/actionlens/fastapi/app/utils/observability.py)) and endpoint `GET /api/v1/system/metrics` tracking API, DB, and AI latencies, CPU %, Memory usage MB/%, active requests, and error rate %.
- **Distributed Cache Layer**: Upgraded `DistributedCacheService` ([`fastapi/app/ai/cache.py`](file:///home/exploitx/Documents/MA%27AJO/actionlens/fastapi/app/ai/cache.py)) with Redis cluster connection support and in-memory fallback.
- **Asynchronous Background Worker Queue**: Built `BackgroundWorkerQueue` ([`fastapi/app/utils/background_tasks.py`](file:///home/exploitx/Documents/MA%27AJO/actionlens/fastapi/app/utils/background_tasks.py)) offloading document ingestion, image processing, and evaluation logging from HTTP requests.
- **AI Safety Evaluation Suite**: Built safety test suite [`fastapi/tests/test_ai_safety.py`](file:///home/exploitx/Documents/MA%27AJO/actionlens/fastapi/tests/test_ai_safety.py) verifying prompt injection defense, jailbreaks, JSON recovery, hallucinations, citations, and human review flags.
- **End-to-End User Flow Suite**: Built workflow test suite [`fastapi/tests/test_e2e_user_flow.py`](file:///home/exploitx/Documents/MA%27AJO/actionlens/fastapi/tests/test_e2e_user_flow.py) verifying the complete user journey from health checks to streaming assistant.
- **50-User Load & Concurrency Tester**: Built [`fastapi/tests/load_test.py`](file:///home/exploitx/Documents/MA%27AJO/actionlens/fastapi/tests/load_test.py) verifying 100% request success rate, 50.6ms average latency, and 19.74 req/sec throughput.
- **Infrastructure as Code (IaC) & DevOps**: Created [`fastapi/Dockerfile`](file:///home/exploitx/Documents/MA%27AJO/actionlens/fastapi/Dockerfile), [`docker-compose.yml`](file:///home/exploitx/Documents/MA%27AJO/actionlens/docker-compose.yml), and GitHub Actions pipeline [`.github/workflows/production_ci_cd.yml`](file:///home/exploitx/Documents/MA%27AJO/actionlens/.github/workflows/production_ci_cd.yml).
- **35/35 Pytest Suite Passing**: Verified 100% test pass rate across all microservice layers.

---

## [1.6.0-phase3d] - 2026-07-26

### Added & Completed (Phase 3D Sprints & Benchmarking Suite)
- **Sprint 3D-1 Vision Verification Engine**: Built `VisionService` ([`fastapi/app/services/vision_service.py`](file:///home/exploitx/Documents/MA%27AJO/actionlens/fastapi/app/services/vision_service.py)) analyzing uploaded community report images for flood inundation, road blockages, infrastructure damage, EXIF GPS location metadata, and outputting `verified`, `confidence`, `category`, `severity`, `objects_detected`, `reasoning`, `recommended_action`, and `requires_human_review`.
- **Sprint 3D-2 Action Impact Simulator**: Built `ImpactSimulationService` ([`fastapi/app/services/simulation_service.py`](file:///home/exploitx/Documents/MA%27AJO/actionlens/fastapi/app/services/simulation_service.py)) combining deterministic hydrodynamic delay math with AI-generated narrative summaries (`POST /api/v1/simulations/calculate`).
- **Sprint 3D-3 Disaster Operations Streaming Assistant**: Built `OperationsAssistantService` ([`fastapi/app/services/assistant_service.py`](file:///home/exploitx/Documents/MA%27AJO/actionlens/fastapi/app/services/assistant_service.py)) executing `RAG search ➔ Review Alerts ➔ Review Telemetry ➔ Synthesize Operations Briefing ➔ Stream Tokens via SSE` (`POST /api/v1/assistant/stream`).
- **Automated AI Benchmarking Suite**: Created [`fastapi/tests/benchmarks/`](file:///home/exploitx/Documents/MA%27AJO/actionlens/fastapi/tests/benchmarks) with 5 dedicated benchmarks for Recommendation, RAG, Vision, Simulation, and Assistant tracking latency, token usage, cost, citation accuracy, and response quality.
- **30/30 Pytest Suite Passing**: Verified 100% test & benchmark pass rate across all microservice layers.

---

## [1.5.0-ai-platform] - 2026-07-26

### Added & Completed (ActionLens AI Platform Layer Upgrade)
- **Central AI Orchestrator**: Built `AIOrchestrator` ([`fastapi/app/ai/orchestrator.py`](file:///home/exploitx/Documents/MA%27AJO/actionlens/fastapi/app/ai/orchestrator.py)) as the single entry point (`POST /api/v1/ai/orchestrate`) routing capabilities through model selection, context injection, caching, guardrails, evaluations, and cost tracking.
- **Dynamic Model Router**: Created `ModelRouter` ([`fastapi/app/ai/model_router.py`](file:///home/exploitx/Documents/MA%27AJO/actionlens/fastapi/app/ai/model_router.py)) decoupling model assignments (`recommendation` -> `gpt-4o`, `embedding` -> `text-embedding-3-small`, etc.) from code.
- **Unified AI Context Builder**: Created `AIContextBuilder` ([`fastapi/app/ai/context_builder.py`](file:///home/exploitx/Documents/MA%27AJO/actionlens/fastapi/app/ai/context_builder.py)) injecting user role, region, risk levels, active alerts, historical incidents, RAG chunks, community reports, weather forecasts, and satellite telemetry.
- **AI Cost Dashboard API**: Integrated real-time metrics endpoint `GET /api/v1/ai/cost-dashboard` tracking daily tokens, USD cost, latency, cache hits/misses, RAG retrievals, vision requests, and embeddings.
- **AI Evaluation Suite (Evals)**: Built `AIEvaluationService` ([`fastapi/app/ai/evaluations.py`](file:///home/exploitx/Documents/MA%27AJO/actionlens/fastapi/app/ai/evaluations.py)) measuring quality pass rates and confidence metrics via `GET /api/v1/ai/evals-summary`.
- **Unified Cache, Telemetry & Guardrails**: Standardized caching (`cache.py`), operational telemetry (`telemetry.py`), and prompt injection guardrails (`guardrails.py`).
- **Expanded Pytest Suite**: Expanded test suite (`fastapi/tests/test_ai_platform_layer.py`) with 25/25 passing tests.

---

## [1.4.0-phase3c] - 2026-07-26

### Added & Completed (Phase 3C Execution & Architectural Enhancements)
- **Master AI Guardrails Policy**: Created [`backend/AI_GUARDRAILS.md`](file:///home/exploitx/Documents/MA%27AJO/actionlens/backend/AI_GUARDRAILS.md) governing allowed/forbidden capabilities, confidence calibration, citation rules, prompt injection defense, and human review triggers.
- **7-Stage Recommendation Approval Pipeline**: Evolved Recommendation Engine flow to `OpenAI -> Structured Output -> Pydantic Validation -> Business Rules -> Confidence Calibration -> Evidence Verification -> Supabase Persistence`.
- **Multi-Format Ingestion Pipeline**: Built `SemanticIngestionService` (`fastapi/app/rag/ingestion.py`) supporting PDF, DOCX, Markdown, and TXT files with page-aware chunking.
- **OpenAI 1536d Embeddings**: Integrated `text-embedding-3-small` in `EmbeddingService` (`fastapi/app/ai/embeddings.py`).
- **Supabase pgvector Persistence**: Created migration [`20260726000003_create_rag_pgvector.sql`](file:///home/exploitx/Documents/MA%27AJO/actionlens/supabase/migrations/20260726000003_create_rag_pgvector.sql) adding `document_embeddings` table and `match_documents` RPC vector similarity function.
- **Modular Production RAG Pipeline**: Built modular RAG architecture (`Intent Detection -> Retriever -> Reranker -> Context Limiter -> GPT-4o Synthesis -> Citation Injector`).
- **Structured Citations**: Every RAG citation strictly requires `document`, `page`, `chunk_id`, and `similarity_score`.
- **Low Confidence & Fallback**: Automatically outputs `"I couldn't find sufficient verified information."` when similarity score drops below 0.70 threshold.
- **Query Cache & Pytest Suite**: Implemented in-memory caching and expanded pytest suite (`fastapi/tests/test_phase3c_rag.py`) with 21/21 passing tests.

---

## [1.3.0-phase3b] - 2026-07-26

### Added & Completed (Phase 3B Execution)
- **Production Recommendation Service**: Created `RecommendationService` (`fastapi/app/services/recommendation_service.py`) and endpoint `POST /api/v1/recommendations/generate`.
- **GPT-4o Structured Outputs**: Enforced OpenAI JSON mode (`response_format={"type": "json_object"}`) utilizing prompt templates resolved from `PromptRegistry`.
- **9-Field Pydantic Schema**: Validated recommendation items (`RecommendationItem`) containing `title`, `priority`, `confidence`, `reasoning`, `evidence`, `time_window`, `expected_impact`, `recommended_resources`, and `action_checklist`.
- **Validation Retry & Graceful Fallback**: Implemented single-retry mechanism with lowered temperature (0.10) on Pydantic validation failure.
- **Supabase PostgreSQL Persistence**: Every generated AI recommendation set is automatically inserted into the Supabase `recommendations` table.
- **Token & USD Cost Tracking**: Integrated `cost_tracker` logging prompt and completion tokens to `ai_usage_logs`.
- **Pytest Suite Verification**: Added unit and integration tests (`fastapi/tests/test_phase3b_recommendations.py`) with 17/17 tests passing.

---

## [1.2.0-phase3a] - 2026-07-26

### Added & Completed (Phase 3A Execution)
- **FastAPI Microservice Infrastructure**: Initialized Python FastAPI application in `fastapi/` (`app/main.py`, `app/config.py`, `app/dependencies.py`).
- **OpenAI & Supabase Integration**: Configured `AsyncOpenAI` client dependency with timeout (30s) and retry (3) settings, and Supabase Admin service role client.
- **Environment Validation**: Added `validate_environment()` in `config.py` enforcing `OPENAI_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`.
- **Resilience & Rate Limiting**: Built `TokenBucketRateLimiter` middleware and `async_retry_with_backoff` decorator in `app/utils/resilience.py`.
- **Structured JSON Logging**: Implemented `JSONFormatter` in `app/utils/logger.py` formatting ISO timestamps, levels, logger names, and line numbers.
- **Lifespan Event Management**: Configured async `lifespan` context manager in `main.py` executing startup environment verification and shutdown client cleanup.
- **Pytest Verification Suite**: Created 10 unit and integration tests (`fastapi/tests/run_tests.py`, `test_config.py`, `test_health.py`, `test_resilience.py`) with 100% pass rate.

---

## [1.1.0-phase2] - 2026-07-26

### Added & Completed (Phase 2 Execution)
- **Database Seed Migration**: Created `supabase/migrations/20260726000001_seed_phase2_data.sql` seeding regional risk telemetry (`risk_data`), operational alerts (`alerts`), role-tailored recommendations (`recommendations`), and preparedness resources (`resources`).
- **Validation Schemas**: Created `src/lib/validations/recommendations.ts` (`RecommendationsQuerySchema`, `TaskToggleSchema`, `BriefingGenerateSchema`, `ImpactSimulationSchema`).
- **Dashboard & Recommendations API Handlers**:
  - `GET /api/dashboard/summary` (`src/app/api/dashboard/summary/route.ts`)
  - `GET /api/recommendations` (`src/app/api/recommendations/route.ts`)
  - `PATCH /api/recommendations/:id/tasks` (`src/app/api/recommendations/[id]/tasks/route.ts`)
  - `POST /api/briefings/generate` (`src/app/api/briefings/generate/route.ts`)
  - `POST /api/simulations/run` (`src/app/api/simulations/run/route.ts`)
- **Frontend API Service Layer**: Created `src/services/api.ts` with fully typed client fetchers (`fetchDashboardSummary`, `fetchRecommendations`, `toggleRecommendationTask`, `generateBriefing`, `runImpactSimulation`).

---

## [1.0.0-phase1] - 2026-07-26

### Added & Completed (Phase 1 Execution)
- **Database DDL Migration Script**: Created `supabase/migrations/20260726000000_init_schema.sql` defining all 12 tables, 7 enum types, `handle_new_user()` trigger, `updated_at` triggers, RLS policies, vector index, and spatial `match_nearby_reports` PostGIS RPC.
- **Supabase `@supabase/ssr` Client Framework**: Created browser client (`src/lib/supabase/client.ts`), async server client (`src/lib/supabase/server.ts`), session middleware helper (`src/lib/supabase/middleware.ts`), and admin service client (`src/lib/supabase/admin.ts`).
- **Authentication Route Handlers**: `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`, `/api/auth/forgot-password`, `/api/auth/reset-password`, `/api/user/onboarding`, `/api/user/profile`.
