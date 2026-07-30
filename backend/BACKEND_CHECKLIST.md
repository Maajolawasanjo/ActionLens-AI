# ActionLens AI — Dedicated Backend Implementation Checklist

> **Location**: `backend/BACKEND_CHECKLIST.md`  
> **Status**: Living Execution Tracker  
> **Rule**: Mark items `[/]` when in-progress, `[x]` when completed, tested, and integrated with the frontend.

---

## Architecture & Contract Readiness
- [ ] **AUDIT-01** Perform Full Production Readiness Review & Architecture Audit
- [ ] **AUDIT-02** Expand DDL schema to 12 production tables including `conversations`, `messages`, `impact_simulations`, `briefings`, and `alert_subscriptions` (`backend/DATABASE_SCHEMA.md`)
- [ ] **AUDIT-03** Specify missing endpoints (`/api/simulations/run`, `/api/briefings/generate`, `/api/map/pins`, `/api/alerts/subscribe`, `/api/user/avatar`) (`backend/API_SPECIFICATION.md`)
- [ ] **AUDIT-04** Define AI prompt schemas for Consequence Simulator & Executive Briefing Generator (`backend/OPENAI_ARCHITECTURE.md`)
- [ ] **AUDIT-05** Formulate RLS security policies across all 12 database tables (`backend/SUPABASE_SETUP.md`)
- [ ] **AUDIT-06** Design & Deploy Managed AI Prompt Engineering Architecture (`backend/PROMPT_ENGINEERING_ARCHITECTURE.md` & `backend/AI_PROMPT_REGISTRY.md`)
- [ ] **AUDIT-07** Deploy Managed Prompt Registry DDL & Usage Logs
- [ ] **AUDIT-08** Implement Central AI Orchestrator, Dynamic Model Router, Unified Context Builder, AI Evaluations Suite, and Cost Dashboard

---

## Phase 1 — Authentication, Database & Profile Engine
- [ ] **B1-01** Execute PostgreSQL DDL schema & Enum type migration
- [ ] **B1-02** Deploy Supabase Auth Trigger `handle_new_user()`
- [ ] **B1-03** Configure Supabase RLS policies across all 12 tables
- [x] **B1-04** Initialize `@supabase/ssr` helpers (`src/lib/supabase/client.ts`, `server.ts`, `middleware.ts`, `admin.ts`)
- [x] **B1-05** Implement Auth Route: `POST /api/auth/register` (`src/app/api/auth/register/route.ts`)
- [x] **B1-06** Implement Auth Route: `POST /api/auth/login` (`src/app/api/auth/login/route.ts`)
- [x] **B1-07** Implement Auth Route: `POST /api/auth/logout` (`src/app/api/auth/logout/route.ts`)
- [x] **B1-08** Implement Auth Route: `GET /api/auth/me` (`src/app/api/auth/me/route.ts`)
- [x] **B1-09** Implement Onboarding Route: `PATCH /api/user/onboarding` (`src/app/api/user/onboarding/route.ts`)
- [x] **B1-10** Build Route Protection Middleware (`src/middleware.ts`)

---

## Phase 2 — Recommendations, Simulations & Dashboard Engine
- [ ] **B2-01** Implement Dashboard Route: `GET /api/dashboard/summary`
- [ ] **B2-02** Implement Recommendations Route: `GET /api/recommendations`
- [ ] **B2-03** Implement Action Task Toggle Route: `PATCH /api/recommendations/:id/tasks`
- [ ] **B2-04** Implement Briefing Generation Route: `POST /api/briefings/generate`
- [ ] **B2-05** Implement Consequence Simulator Route: `POST /api/simulations/run`
- [ ] **B2-06** Seed initial region risk data

---

## Phase 3 — Comprehensive AI Microservice Engine & Vision Verification

### Phase 3A — OpenAI Foundation & Microservice Setup
- [ ] **B3A-01** Initialize Python FastAPI project shell in `fastapi/`
- [ ] **B3A-02** Configure Async OpenAI Client & environment variable validation
- [ ] **B3A-03** Create Pydantic data schemas
- [ ] **B3A-04** Build Central Prompt Manager
- [ ] **B3A-05** Implement Structured Logging, Retry Decorators, and Rate Limiting

### Phase 3B — AI Recommendation Engine & Structured Outputs
- [ ] **B3B-01** Build FastAPI service: `POST /api/v1/recommendations/generate`
- [ ] **B3B-02** Implement GPT-4o with OpenAI Json Schema Structured Outputs
- [ ] **B3B-03** Validate AI outputs against Pydantic schema
- [ ] **B3B-04** Implement single-retry fallback mechanism on Pydantic validation failure & log usage
- [ ] **B3B-05** Persist every generated recommendation set to Supabase `recommendations` table
- [ ] **B3B-06** Connect Recommendation Engine to Prompt Registry Manager

### Phase 3C — RAG & Knowledge Base Engine
- [ ] **B3C-01** Build Embedding Generator Service (`text-embedding-3-small` 1536d vectors)
- [ ] **B3C-02** Integrate Supabase `pgvector` similarity search & `match_documents` RPC
- [ ] **B3C-03** Build Semantic Chunking & Document Ingestion pipeline
- [ ] **B3C-04** Build Modular RAG Pipeline

### Phase 3.5 — AI Integration Layer & System Event Bus
- [ ] **B3.5-01** Decoupled System Event Bus with Async Event Publisher/Subscriber pattern
- [ ] **B3.5-02** Integrated End-to-End AI Pipeline Service
- [ ] **B3.5-03** Connect Community Report Submission ➔ Vision Verification ➔ Supabase DB ➔ Event Bus ➔ AI Recommendations ➔ Assistant Context
- [ ] **B3.5-04** Phase 3.5 End-to-End Pipeline Integration Test Suite
- [ ] **B3.5-05** Exposed Integrated Pipeline Endpoint and System Events Log

### Phase 3E — Production Hardening & Observability
- [ ] **B3E-01** Infrastructure Observability Metrics
- [ ] **B3E-02** Distributed Cache Layer
- [ ] **B3E-03** Asynchronous Background Job Worker Queue
- [ ] **B3E-04** AI Safety Evaluation Suite
- [ ] **B3E-05** End-to-End User Flow Test Suite
- [ ] **B3E-06** Load & Concurrency Stress Test Suite
- [ ] **B3E-07** Infrastructure as Code (FastAPI Dockerfile, Nginx profile)

---

## Phase 4 — Community Reports, Storage & Realtime Stream
- [ ] **B4-01** Storage Bucket `community-reports`
- [ ] **B4-02** Storage Bucket `avatars`
- [ ] **B4-03** Storage Bucket `resource-documents`
- [ ] **B4-04** Community Feed API `GET /api/community/reports`
- [ ] **B4-05** Community Report Submission `POST /api/community/reports`
- [ ] **B4-06** Supabase Realtime Channel `realtime:community_reports`
- [ ] **B4-07** `CommunityFeed`, `CommunityReportCard`, `SubmitReportModal` frontend components connected to live Realtime API
- [ ] **B4-08** Offline Queue with localStorage persistence and auto-sync on reconnect
- [ ] **B4-09** Report detail `GET /api/community/reports/[id]`, admin PATCH, and upvote
- [ ] **B4-10** Signed-URL upload endpoint

---

## Phase 5 — Track A: Finish the Product

### Analytics
- [ ] **B5A-01** `GET /api/analytics/metrics`
- [ ] **B5A-02** `AnalyticsDashboard` component

### Emergency Resource Directory
- [ ] **B5A-03** `emergency_resources` table creation
- [ ] **B5A-04** `GET /api/resources` geo-sort API
- [ ] **B5A-05** `POST /api/resources` + `PATCH /api/resources/[id]` admin CRUD
- [ ] **B5A-06** `EmergencyResourceDirectory` component

### Notification Center
- [ ] **B5A-07** `notifications` table creation
- [ ] **B5A-08** `GET /api/notifications` + `POST /api/notifications` + `PATCH /api/notifications/[id]`
- [ ] **B5A-09** `NotificationBell` component

### Incident Timeline
- [ ] **B5A-10** `incident_timelines` table creation
- [ ] **B5A-11** `GET /api/incidents/[id]` + `POST /api/incidents/[id]`
- [ ] **B5A-12** `IncidentTimelineView` component

---

## Track B — Production Readiness
- [x] **B5B-01** Multi-stage Next.js Dockerfile (deps ➔ builder ➔ Alpine runner)
- [x] **B5B-02** Production docker-compose.yml
- [x] **B5B-03** Security headers middleware (CSP nonce, HSTS, X-Frame-Options, X-XSS-Protection, Permissions-Policy, Referrer-Policy)
- [ ] **B5B-04** CI/CD pipeline (production_ci_cd.yml file exists, but depends on unbuilt backend parts)
- [ ] **B5B-05** Dependency security scanning
- [x] **B5B-06** TypeScript: 0 errors
