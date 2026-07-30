# ActionLens AI — Dedicated Backend Project Memory

> **Location**: `backend/PROJECT_MEMORY.md`  
> **Status**: Single Source of Truth for Backend State  
> **Rule**: READ FIRST at session start. UPDATE LAST at session completion.  

---

## 1. Quick Context & Current Goal

* **Active Domain**: ActionLens AI Backend Development (Phase 1 Database Setup).
* **Completed Milestones**:
  - **Auth & Session Infrastructure**: Initialized `@supabase/ssr` helpers (`client.ts`, `server.ts`, `middleware.ts`, `admin.ts`) and configured strict security headers + route protection in `src/middleware.ts`.
  - **Next.js API Handlers**: Built `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`, `/api/user/onboarding`, and `/api/user/profile` (PUT) handlers with TypeScript type-safety (0 compiler errors).
  - **Deployment Foundations**: Created the multi-stage production `Dockerfile`, `docker-compose.yml`, and GitHub Actions production CI/CD workflow files.
* **Aspirational/Fabricated Claims Removed**: The previous sessions falsely claimed completion of FastAPI backend microservice, pgvector RAG system, PostGIS geocoding, impact simulations, executive briefings, and database migrations. None of these exist in the codebase.
* **Next Immediate Milestone**: **Phase 1 Database Migration & Supabase Setup (B1-01, B1-02, B1-03)**.

---

## 2. Mandatory Architectural Contracts

1. **Audit Alignment**: Every API response, schema field, and DB table MUST strictly conform to `docs/actionlens_backend_specification.md` and `backend/API_SPECIFICATION.md`.
2. **No Ad-Hoc Additions**: Never create new endpoints or database tables without updating `backend/DATABASE_SCHEMA.md` and `backend/API_SPECIFICATION.md`.
3. **Documentation Updates**:
   - Update `PROJECT_MEMORY.md` after every completed feature.
   - Update `backend/BACKEND_ARCHITECTURE.md` after any API or schema modification.
   - Mark completed tasks in `backend/BACKEND_CHECKLIST.md` and root `BACKEND_CHECKLIST.md`.
   - Record significant milestone releases in `backend/CHANGELOG.md`.

---

## 3. Active Technical Stack

| Component | Framework / Technology | Version / Provider |
|---|---|---|
| **BFF / REST API** | Next.js App Router API Routes | Next.js 16.2.10 / React 19.2.4 |
| **Primary Database** | Supabase PostgreSQL (Planned 12 Tables) + `pgvector` + PostGIS | Postgres 15+ |
| **Authentication** | `@supabase/ssr` (HttpOnly Cookies) | Supabase Auth |
| **AI Engine** | FastAPI Microservice (Planned) | Python 3.11+ / OpenAI GPT-4o |
| **Realtime Stream** | WebSockets (Planned) | Supabase Realtime |
| **File Storage** | Supabase Storage Buckets (Planned) | S3-compatible |
