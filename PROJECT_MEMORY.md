# PROJECT_MEMORY.md
## ActionLens AI — Permanent Project Memory

> ⚠️ This file is the single source of truth for this project.
> READ IT FIRST at the start of every session.
> UPDATE IT LAST at the end of every session.
> Never leave it outdated.

---

# START HERE

**Files to open first**: `PROJECT_MEMORY.md` ➔ `backend/PROJECT_MEMORY.md` ➔ `backend/BACKEND_MASTER_PLAN.md` ➔ `backend/BACKEND_ARCHITECTURE.md`

**Current Status**: **MVP COMPLETE** — Phase 5 Track A (Analytics Dashboard, Geo-aware Emergency Resource Directory, Notification Center w/ Realtime, Incident Timeline with demo mode) and Track B (multi-stage Dockerfile, production docker-compose, CSP/HSTS/XFO security headers, 4-job CI/CD pipeline, dependency scanning). TypeScript: 0 errors. FastAPI: 36/37 tests passing.

**Focus**: Polish, demo preparation, and deployment. Stop adding features.

**Single Source of Truth Rules**:
> ⚠️ Never invent ad-hoc APIs or un-audited database tables.
> ⚠️ All backend work must strictly match `docs/actionlens_backend_specification.md` and `BACKEND_ARCHITECTURE.md`.
> ⚠️ Update `PROJECT_MEMORY.md` after every completed feature.
> ⚠️ Update `BACKEND_ARCHITECTURE.md` after every API/schema modification.
> ⚠️ Track progress in `BACKEND_CHECKLIST.md`.


---

## Project Information

| Field | Value |
|---|---|
| **Project Name** | ActionLens AI |
| **Tagline** | Turning Early Warnings into Intelligent Action |
| **Category** | AI Decision Intelligence Platform |
| **Blueprint** | `ACTIONLENS_BLUEPRINT.md` (25 sections — full engineering spec) |
| **Vision** | Every person in a crisis gets a clear, AI-generated action plan personalized to their role |
| **MVP Goal** | Complete AI decision loop: ingest risk → personalize → explain → simulate impact → collect reports → generate briefings |

### Technology Stack
| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **UI** | React 19, Tailwind CSS 4, Framer Motion |
| **Forms** | React Hook Form + Zod |
| **Data Fetching** | TanStack Query (React Query) |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Auth** | Supabase Authentication |
| **Database** | Supabase PostgreSQL |
| **Storage** | Supabase Storage |
| **Realtime** | Supabase Realtime |
| **Security** | Supabase RLS (Row Level Security) |
| **Vector DB** | pgvector (Supabase extension) |
| **AI Model** | OpenAI GPT-4o + text-embedding-3-small |
| **AI Backend** | FastAPI (Python) — deployed separately |
| **Maps** | Google Maps Platform (JS API + Places + Geocoding) |
| **Email** | Resend (via Supabase Auth + custom) |
| **Deployment** | Vercel (Next.js) + Railway or Render (FastAPI) |

### Design System
| Token | Value |
|---|---|
| **Font** | Aspekta Variable (self-hosted) |
| **Background** | `#F2E9D8` (warm cream) |
| **Surface** | `#FFFFFF` (white cards) |
| **Surface Alt** | `#8FB3C7` (steel blue) |
| **Text Primary** | `#06162B` (deep navy) |
| **Text Muted** | `#5A6E82` |
| **Navy** | `#0B244A` |
| **Steel Blue** | `#1D4D7A` |
| **Success** | `#3FAE6A` |
| **Warning** | `#F4B400` |
| **Danger** | `#D64545` |
| **Border** | `#E5DDD0` |
| **Button Height** | 56px |
| **Border Radius** | 20px (cards), 9999px (buttons) |

---

## Current Development Status

| Field | Value |
|---|---|
| **Current Phase** | Development |
| **Current Sprint** | Sprint 1 — Foundation |
| **Overall Completion** | 15% |
| **Last Updated** | July 30, 2026 |

---

## Completed Features

- **Auth & Session Infrastructure**: Initialized `@supabase/ssr` helpers and configured strict security headers + route protection in Next.js middleware.
- **API routes**: Registration, login, logout, me, onboarding, and profile update endpoints implemented and validated.
- **Client Auth Provider**: Fully integrated `AuthProvider` context in the frontend.
- **Base UI Library**: Configured Tailwind CSS 4 design tokens and created base UI primitives (Button, Card, Input, Badge, Avatar).
- **Public Pages**: Built interactive and visually rich Landing, Login, Register, and Forgot Password pages.
- **Production DevOps**: Created multi-stage Next.js Dockerfile, Docker Compose file, and GitHub Actions CI/CD configuration.

---

## Current Task

**Task ID**: S1-08
**Objective**: Create Supabase project & run database migrations
**Status**: ⬜ Not started

**Steps**:
1. Set up Supabase local environment or cloud instance.
2. Formulate database schema DDL migrations for tables.
3. Deploy DB triggers (e.g. `handle_new_user()`) and configure Row Level Security (RLS) policies.
4. Load mock seed data for testing.

**Blockers**: Need Supabase credentials / local DB setup.

---

## Next Tasks (Ordered Checklist)

### Sprint 1 — Foundation (Days 1–2)
- [x] **S1-01** Initialize Next.js 16.2.10 + React 19 + TypeScript project
- [x] **S1-02** Install all dependencies
- [x] **S1-03** Configure Tailwind CSS 4 with full design tokens
- [ ] **S1-04** Self-host Aspekta Variable font
- [x] **S1-05** Create complete folder structure
- [x] **S1-06** Build UI: Button, Card, Input, Badge, Avatar
- [ ] **S1-07** Build UI: EmptyState, ErrorState, LoadingSkeleton, StatusDot, RoleBadge
- [ ] **S1-08** Create Supabase project + run all SQL migrations (First unstarted task)
- [ ] **S1-09** Configure RLS policies
- [ ] **S1-10** Load demo seed data
- [x] **S1-11** Set up @supabase/ssr + browser/server clients
- [x] **S1-12** Create middleware.ts (route protection + CSP headers)
- [x] **S1-13** Build Login page
- [x] **S1-14** Build Register page
- [x] **S1-15** Build Forgot Password page
- [x] **S1-16** Create AuthContext + all providers

### Sprint 2 — Core App + Dashboard + AI (Days 3–4)
- [ ] **S2-01** Build App shell: Sidebar + Header
- [ ] **S2-02** Build Onboarding flow (6 steps)
- [ ] **S2-03** Set up TanStack Query provider + base hooks
- [ ] **S2-04** Initialize FastAPI project + Railway deployment
- [ ] **S2-05** OpenAI client + all system prompts + Zod schemas
- [ ] **S2-06** Recommendations API (FastAPI endpoint + Next.js Route Handler)
- [ ] **S2-07** Build Dashboard page (all components)
- [ ] **S2-08** Build AIRecommendationCard (hero component)
- [ ] **S2-09** Build ExplainabilityPanel (sliding evidence chain)
- [ ] **S2-10** Build ActionTimeline (NOW/6h/24h/72h)
- [ ] **S2-11** Build Action Impact Simulator

### Sprint 3 — Map + Community + Assistant (Days 5–6)
- [ ] **S3-01** Google Maps integration + custom styling
- [ ] **S3-02** Risk map layers (flood, drought, disease, agriculture)
- [ ] **S3-03** Infrastructure layers (shelters, hospitals, roads)
- [ ] **S3-04** Community Reports list page
- [ ] **S3-05** Community Report submit form + Supabase Storage
- [ ] **S3-06** AI report verification (FastAPI + GPT-4o Vision)
- [ ] **S3-07** Supabase Realtime subscription for reports + alerts
- [ ] **S3-08** Alerts list + detail pages
- [ ] **S3-09** AI Assistant streaming interface
- [ ] **S3-10** RAG knowledge base document ingestion script

### Sprint 4 — Analytics + Resources + Polish (Days 7–8)
- [ ] **S4-01** Analytics page (Recharts: metric cards + trend charts)
- [ ] **S4-02** Resources page + knowledge base
- [ ] **S4-03** Notifications center page
- [ ] **S4-04** Settings pages (all 4 sub-pages)
- [ ] **S4-05** Profile page
- [ ] **S4-06** Dark mode (full application)
- [ ] **S4-07** Mobile responsive polish (375px)
- [ ] **S4-08** Loading skeletons on all pages
- [ ] **S4-09** Empty + Error states on all pages
- [x] **S4-10** Landing page

### Sprint 5 — QA + Deployment (Day 9)
- [ ] **S5-01** Playwright E2E test suite (critical paths)
- [ ] **S5-02** Manual QA (all devices + dark mode)
- [ ] **S5-03** Vercel production deployment
- [ ] **S5-04** FastAPI production deployment (Railway)
- [ ] **S5-05** Performance audit (Lighthouse ≥ 85)
- [ ] **S5-06** Final PROJECT_MEMORY.md update

---

## Packages to Install

### NPM (after create-next-app)
```bash
npm install @supabase/supabase-js @supabase/ssr
npm install @tanstack/react-query @tanstack/react-virtual
npm install react-hook-form zod @hookform/resolvers
npm install framer-motion
npm install lucide-react
npm install recharts
npm install @googlemaps/js-api-loader
npm install clsx tailwind-merge
npm install @vercel/analytics
```

### Python (FastAPI — fastapi/requirements.txt)
```
fastapi
uvicorn
openai
supabase
python-dotenv
slowapi
pydantic
httpx
```

---

## Folder Structure

*Will be built in S1-05. Target structure per blueprint Section 7:*

```
actionlens/
├── PROJECT_MEMORY.md         ← THIS FILE (always updated)
├── ACTIONLENS_BLUEPRINT.md   ← Full engineering spec
├── src/
│   ├── app/                  ← Next.js App Router routes
│   ├── components/           ← UI components (never business logic)
│   │   ├── ui/               ← Base primitives
│   │   ├── layout/           ← Shell, Sidebar, Header
│   │   ├── dashboard/
│   │   ├── recommendations/
│   │   ├── map/
│   │   ├── alerts/
│   │   ├── community/
│   │   ├── assistant/
│   │   ├── analytics/
│   │   ├── ai/               ← ExplainabilityPanel, ImpactSimulator, ConfidenceScore
│   │   ├── onboarding/
│   │   ├── landing/
│   │   └── shared/           ← EmptyState, ErrorState, LoadingSkeleton
│   ├── features/             ← Feature-sliced business logic
│   ├── hooks/                ← Custom React hooks
│   ├── providers/            ← React context providers
│   ├── services/             ← API service layer (no direct fetch in components)
│   ├── lib/
│   │   ├── supabase/         ← client.ts + server.ts
│   │   ├── openai/           ← client.ts + prompts.ts + schemas.ts
│   │   └── maps/
│   ├── utils/                ← Pure utility functions
│   ├── types/                ← TypeScript interfaces
│   ├── constants/            ← Immutable config values
│   └── config/               ← Runtime configuration
├── fastapi/                  ← Python AI backend (separate deployment)
│   ├── main.py
│   ├── routers/
│   ├── services/
│   ├── models/
│   ├── requirements.txt
│   └── Dockerfile
├── public/
│   └── fonts/               ← Aspekta Variable (self-hosted)
├── middleware.ts
├── next.config.ts
├── tailwind.config.ts
├── .env.local               ← Never commit
├── .env.example             ← Commit this (no values)
└── package.json
```

---

## Pages

| Page | Route | Status | % |
|---|---|---|---|
| Landing | `/` | ✅ | 100% |
| Login | `/login` | ⬜ | 0% |
| Register | `/register` | ⬜ | 0% |
| Forgot Password | `/forgot-password` | ⬜ | 0% |
| Onboarding Welcome | `/onboarding/welcome` | ⬜ | 0% |
| Onboarding Role | `/onboarding/role` | ⬜ | 0% |
| Onboarding Location | `/onboarding/location` | ⬜ | 0% |
| Onboarding Interests | `/onboarding/interests` | ⬜ | 0% |
| Onboarding Notifications | `/onboarding/notifications` | ⬜ | 0% |
| Onboarding Complete | `/onboarding/complete` | ⬜ | 0% |
| Dashboard | `/dashboard` | ⬜ | 0% |
| Recommendations | `/recommendations` | ⬜ | 0% |
| Risk Map | `/map` | ⬜ | 0% |
| Alerts | `/alerts` | ⬜ | 0% |
| Community Reports | `/community` | ⬜ | 0% |
| AI Assistant | `/assistant` | ⬜ | 0% |
| Resources | `/resources` | ⬜ | 0% |
| Analytics | `/analytics` | ⬜ | 0% |
| Notifications | `/notifications` | ⬜ | 0% |
| Settings | `/settings` | ⬜ | 0% |
| Profile | `/profile` | ⬜ | 0% |

---

## Components

*Will populate as components are built*

| Component | Location | Status |
|---|---|---|
| Button | `components/ui/` | ⬜ |
| Card | `components/ui/` | ⬜ |
| Input | `components/ui/` | ⬜ |
| Badge | `components/ui/` | ⬜ |
| Avatar | `components/ui/` | ⬜ |
| EmptyState | `components/shared/` | ⬜ |
| ErrorState | `components/shared/` | ⬜ |
| LoadingSkeleton | `components/shared/` | ⬜ |
| Sidebar | `components/layout/` | ⬜ |
| Header | `components/layout/` | ⬜ |
| AIRecommendationCard | `components/recommendations/` | ⬜ |
| ExplainabilityPanel | `components/ai/` | ⬜ |
| ConfidenceScore | `components/ai/` | ⬜ |
| ActionTimeline | `components/recommendations/` | ⬜ |
| ImpactSimulatorModal | `components/ai/` | ⬜ |
| MapContainer | `components/map/` | ⬜ |
| ChatInterface | `components/assistant/` | ⬜ |
| StreamingText | `components/assistant/` | ⬜ |
| RecommendationCard | `components/recommendations/` | ⬜ |
| AlertCard | `components/alerts/` | ⬜ |
| CommunityReportCard | `components/community/` | ⬜ |
| MetricCard | `components/analytics/` | ⬜ |

---

## API Endpoints

| Endpoint | Method | Status | Auth |
|---|---|---|---|
| `/api/recommendations` | POST | ⬜ | JWT required |
| `/api/assistant` | POST (SSE) | ⬜ | JWT required |
| `/api/impact-simulator` | POST | ⬜ | JWT + gov/ngo role |
| `/api/community/verify` | POST | ⬜ | Internal |
| `/api/briefing` | POST | ⬜ | JWT + gov/ngo role |
| FastAPI `/recommendations` | POST | ⬜ | App secret |
| FastAPI `/assistant/chat` | POST (SSE) | ⬜ | App secret |
| FastAPI `/impact-simulator` | POST | ⬜ | App secret |
| FastAPI `/verify-report` | POST | ⬜ | App secret |
| FastAPI `/embeddings` | POST | ⬜ | App secret |
| FastAPI `/briefing/generate` | POST | ⬜ | App secret |

---

## Database

| Table | Status | Migration |
|---|---|---|
| `profiles` | ⬜ | Not run |
| `recommendations` | ⬜ | Not run |
| `alerts` | ⬜ | Not run |
| `community_reports` | ⬜ | Not run |
| `user_actions` | ⬜ | Not run |
| `conversations` | ⬜ | Not run |
| `impact_simulations` | ⬜ | Not run |
| `resources` | ⬜ | Not run |
| `risk_data` | ⬜ | Not run |
| `recommendation_cache` | ⬜ | Not run |

*Full schema in ACTIONLENS_BLUEPRINT.md Section 12*

---

## Authentication

**Status**: ❌ Not implemented

**Planned**: Supabase email/password + @supabase/ssr cookie sessions

*Full auth plan in ACTIONLENS_BLUEPRINT.md Section 13*

---

## AI System

| Component | Status |
|---|---|
| OpenAI client | ⬜ Not configured |
| System prompts | ⬜ Not written |
| Zod schemas (Structured Outputs) | ⬜ Not written |
| RAG knowledge base | ⬜ Not initialized |
| Embeddings | ⬜ Not configured |
| FastAPI AI services | ⬜ Not built |

*Full AI architecture in ACTIONLENS_BLUEPRINT.md Section 15*

---

## Environment Variables

### Next.js (.env.local)
| Variable | Purpose | Status |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | ⬜ Not set |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public key | ⬜ Not set |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps API key | ⬜ Not set |
| `NEXT_PUBLIC_APP_URL` | App base URL | ⬜ Not set |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only Supabase key | ⬜ Not set |
| `FASTAPI_URL` | FastAPI backend URL | ⬜ Not set |
| `FASTAPI_SECRET_KEY` | Internal API auth token | ⬜ Not set |
| `RESEND_API_KEY` | Email sending | ⬜ Not set |

### FastAPI (.env)
| Variable | Purpose | Status |
|---|---|---|
| `OPENAI_API_KEY` | OpenAI API key | ⬜ Not set |
| `SUPABASE_URL` | Database connection | ⬜ Not set |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin DB access | ⬜ Not set |
| `ALLOWED_ORIGINS` | CORS whitelist | ⬜ Not set |
| `APP_SECRET` | Internal auth | ⬜ Not set |

---

## Known Issues

*None — development not started*

---

## Technical Debt

*None — development not started*

---

## Architecture Decisions

| Decision | Rationale |
|---|---|
| **Supabase over Firebase** | PostgreSQL for relational data; RLS; pgvector for RAG — no separate vector DB needed |
| **OpenAI over Gemini** | User preference; GPT-4o Structured Outputs production-proven |
| **FastAPI for AI** | Python AI ecosystem; keeps AI logic separate; easier RAG with langchain/tiktoken |
| **Aspekta as sole font** | Single-font system per design spec; all hierarchy via weight/size |
| **TanStack Query** | Best caching + optimistic updates for server state |
| **GPT-4o Structured Outputs** | Enforces response schema via Zod; eliminates parsing errors |
| **pgvector for RAG** | Native Supabase extension; no Pinecone/Weaviate needed for MVP |
| **Framer Motion** | Most expressive React animation library; needed for card lifts, panel slides, streaming text |

---

## Session Log

### Session 1 — July 10, 2026
- **Objectives**: Blueprint + memory system setup
- **Completed**:
  - `ACTIONLENS_BLUEPRINT.md` created (25 sections, full engineering spec)
  - `PROJECT_MEMORY.md` created (this file)
  - Project folder created at `c:\Users\NUTM ADMIN\Documents\MA'AJO\ActionLens`
- **Files Created**: `PROJECT_MEMORY.md`, `ACTIONLENS_BLUEPRINT.md`
- **Next Recommended Task**: S1-01 — Initialize Next.js 15 project

---

## Completion Checklist

### Foundation
- [x] Project initialized (Next.js 16.2.10, TypeScript, Tailwind 4)
- [x] Design system complete (base components in src/components/ui/)
- [ ] Supabase schema deployed
- [ ] RLS policies configured
- [ ] Seed data loaded
- [x] PROJECT_MEMORY.md maintained throughout

### Authentication
- [x] Register · [x] Login · [x] Forgot Password
- [x] Middleware (route protection & security headers) · [x] Onboarding guard (implemented in middleware)

### Onboarding
- [ ] Welcome · [ ] Role · [ ] Location · [ ] Interests · [ ] Notifications · [ ] Complete

### Dashboard
- [ ] Risk Level Card · [ ] AI Recommendation Card · [ ] Action Timeline
- [ ] Map preview · [ ] Alert feed · [ ] Quick stats

### AI
- [ ] Personalized recs (6 roles) · [ ] Confidence scores · [ ] Explainability Panel
- [ ] Action Impact Simulator · [ ] AI Assistant (streaming) · [ ] RAG · [ ] Briefings

### Map
- [ ] Google Maps · [ ] All 8 layers · [ ] Community pins · [ ] Report sidebar

### Community & Alerts
- [ ] Report list · [ ] Submit form · [ ] AI verification · [ ] Realtime
- [ ] Alerts list · [ ] Alert detail

### Analytics, Resources, Settings
- [ ] Analytics (Recharts) · [ ] Resources · [ ] Notifications · [ ] Settings · [ ] Profile

### Polish
- [ ] Dark mode · [ ] Mobile (375px) · [ ] Skeletons · [ ] Empty states · [ ] Error states · [x] Landing page

### Deployment
- [ ] Vercel · [ ] FastAPI (Railway) · [ ] E2E tests · [ ] Lighthouse ≥ 85
