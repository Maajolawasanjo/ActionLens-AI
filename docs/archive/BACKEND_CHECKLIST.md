# BACKEND_CHECKLIST.md — ActionLens AI Backend Execution Tracker
> **Status**: Living Execution Progress Tracker  
> **Rule**: Mark items `[/]` when in-progress, `[x]` when completed, tested, and integrated with the frontend.

---

## Phase 1 — Authentication, Database & Profile Engine
- [ ] **B1-01** Execute PostgreSQL DDL schema & Enum type migration
- [ ] **B1-02** Deploy Supabase Auth Trigger `handle_new_user()`
- [ ] **B1-03** Configure Supabase RLS policies across all 7 tables
- [x] **B1-04** Initialize `@supabase/ssr` helper (`src/lib/supabase/server.ts` & `client.ts`)
- [x] **B1-05** Implement Auth Route: `POST /api/auth/register`
- [x] **B1-06** Implement Auth Route: `POST /api/auth/login`
- [x] **B1-07** Implement Auth Route: `POST /api/auth/logout`
- [x] **B1-08** Implement Auth Route: `GET /api/auth/me`
- [x] **B1-09** Implement Onboarding Route: `PATCH /api/user/onboarding`
- [x] **B1-10** Build Route Protection Middleware (`middleware.ts`)

---

## Phase 2 — Recommendations & Dashboard Engine
- [ ] **B2-01** Implement Dashboard Route: `GET /api/dashboard/summary`
- [ ] **B2-02** Implement Recommendations Route: `GET /api/recommendations`
- [ ] **B2-03** Implement Action Task Toggle Route: `PATCH /api/recommendations/:id/tasks`
- [ ] **B2-04** Implement Briefing Generation Route: `POST /api/briefing`
- [ ] **B2-05** Seed initial region risk data (`risk_data` table)

---

## Phase 3 — FastAPI AI Microservice & Vision Verification
- [ ] **B3-01** Initialize Python FastAPI project shell in `fastapi/`
- [ ] **B3-02** Configure OpenAI GPT-4o Client & Pydantic response schemas
- [ ] **B3-03** Build FastAPI endpoint: `POST /generate-recommendations`
- [ ] **B3-04** Build FastAPI endpoint: `POST /verify-report-vision` (GPT-4o Vision)
- [ ] **B3-05** Connect Next.js API handlers to FastAPI internal service

---

## Phase 4 — Community Reports, Storage & Realtime Stream
- [ ] **B4-01** Create Supabase Storage Bucket: `community-reports`
- [ ] **B4-02** Create Supabase Storage Bucket: `avatars`
- [ ] **B4-03** Create Supabase Storage Bucket: `resource-documents`
- [ ] **B4-04** Implement Community Feed Route: `GET /api/community/reports`
- [ ] **B4-05** Implement Community Report Submission Route: `POST /api/community/reports`
- [ ] **B4-06** Enable Supabase Realtime Channel: `realtime:community_reports`
- [ ] **B4-07** Connect frontend report submission modal to live multipart API

---

## Phase 5 — RAG Streaming Assistant & Analytics
- [ ] **B5-01** Configure `pgvector` index & RPC similarity search function (`match_documents`)
- [ ] **B5-02** Build PDF document chunking & vector embedding ingestion script
- [ ] **B5-03** Implement Assistant Route: `POST /api/assistant/chat` (Server-Sent Events)
- [ ] **B5-04** Implement Analytics Metrics Route: `GET /api/analytics/metrics`
- [ ] **B5-05** Implement Resources Route: `GET /api/resources`
- [ ] **B5-06** Final Security & Rate Limiter Audit
