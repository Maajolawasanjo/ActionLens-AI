# BACKEND_MASTER_PLAN.md — ActionLens AI Backend Master Plan
> **Status**: Living Master Blueprint & Backend Contract  
> **Single Source of Truth**: Referenced by `PROJECT_MEMORY.md`, `BACKEND_ARCHITECTURE.md`, and `BACKEND_CHECKLIST.md`.  
> **Rule**: No un-audited APIs or un-audited DB tables allowed.

---

## 1. Principles of Backend Execution

1. **Frontend Contract Integrity**: Every API endpoint, response schema, and database relationship MUST strictly reflect the audit documented in `docs/actionlens_backend_specification.md`.
2. **Zero Unapproved Extensions**: Never introduce ad-hoc APIs, extra tables, or un-audited endpoints without updating this Master Plan and `BACKEND_ARCHITECTURE.md`.
3. **TypeScript & DB Synchronization**: All request/response DTOs must strictly match `@/types/index.ts` and the PostgreSQL schema.
4. **Mandatory Documentation Updates**:
   - Update `PROJECT_MEMORY.md` after completing any backend feature.
   - Update `BACKEND_ARCHITECTURE.md` when any schema or API behavior is implemented/refined.
   - Mark completed items in `BACKEND_CHECKLIST.md`.

---

## 2. Core Backend Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            NEXT.JS 16 APP ROUTER                            │
│           (React 19 Presentation Tier · Tailwind CSS 4 · Framer Motion)      │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ (HTTPS / WSS / JWT)
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                            SUPABASE PAAS LAYER                              │
│   Auth (SSR Cookies) │ PostgreSQL + pgvector │ Storage Buckets │ Realtime Engine│
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ (Internal REST / gRPC)
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                        FASTAPI AI BACKEND SERVICE                           │
│  OpenAI GPT-4o (Structured Outputs) │ RAG Document Ingestion │ Vector Search │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Implementation Sequence & Phase Roadmap

### Phase 1: Auth, Database Foundation & Security (Sprint 1)
- **Objectives**: Initialize `@supabase/ssr`, run PostgreSQL DDL migration, setup RLS policies, implement triggers.
- **Endpoints**: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`, `PATCH /api/user/onboarding`.
- **Database Tables**: `profiles`, `auth.users`.

### Phase 2: Recommendations & Dashboard Engine (Sprint 2)
- **Objectives**: Connect Dashboard summary and AI Recommendation checklists to PostgreSQL.
- **Endpoints**: `GET /api/dashboard/summary`, `GET /api/recommendations`, `POST /api/recommendations/generate`, `PATCH /api/recommendations/:id/tasks`.
- **Database Tables**: `recommendations`, `user_actions`, `risk_data`.

### Phase 3: FastAPI AI Microservice & Vision Verification (Sprint 3)
- **Objectives**: Deploy FastAPI service for OpenAI GPT-4o Structured Outputs and Vision inspection.
- **Endpoints**: FastAPI `/generate-recommendations`, FastAPI `/verify-report-vision`.
- **Dependencies**: Python 3.11+, OpenAI SDK, FastAPI, Pydantic v2.

### Phase 4: Community Reports, Storage & Realtime Stream (Sprint 4)
- **Objectives**: Image uploads, spatial hazard reports, Supabase Storage buckets, and Realtime WebSocket subscriptions.
- **Endpoints**: `GET /api/community/reports`, `POST /api/community/reports`, Storage buckets `community-reports`, `avatars`.
- **Database Tables**: `community_reports`.

### Phase 5: RAG Streaming Assistant & Analytics (Sprint 5)
- **Objectives**: `pgvector` vector similarity search, Server-Sent Events (SSE) streaming chat, and executive analytics aggregation.
- **Endpoints**: `POST /api/assistant/chat`, `GET /api/resources`, `GET /api/analytics/metrics`.
- **Database Tables**: `resources`, `conversations`.

---

## 4. Single Source of Truth References
* **Audit & Engineering Specification**: `docs/actionlens_backend_specification.md`
* **Architecture & API Schema**: `BACKEND_ARCHITECTURE.md`
* **Execution Checklist**: `BACKEND_CHECKLIST.md`
* **Project Memory & Session Log**: `PROJECT_MEMORY.md`
