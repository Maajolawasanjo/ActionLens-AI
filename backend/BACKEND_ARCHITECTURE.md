# ActionLens AI — Backend Architecture Specification

> **Location**: `backend/BACKEND_ARCHITECTURE.md`  
> **Status**: Technical Reference & System Topology Contract  
> **Target Version**: ActionLens AI v1.0  

---

## 1. Executive System Topology

ActionLens AI utilizes a high-performance, low-latency, decoupled microservice architecture tailored for climate resilience and real-time decision intelligence:

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

## 2. Infrastructure Layer Responsibilities

### 2.1 Next.js 16 App Router (BFF Layer)
* Serves dynamic React 19 UI views and handles client interactions.
* Manages user authentication sessions via `@supabase/ssr` with HttpOnly cookies.
* Exposes API Route Handlers (`src/app/api/*`) for data validation, proxying, and client response formatting using `Zod`.
* Enforces route protection middleware (`middleware.ts`).

### 2.2 Supabase Platform Layer
* **Authentication**: Manages OAuth, email/password credentials, and JWT generation.
* **PostgreSQL Database**: Acts as the primary database with `pgvector` enabled for 1536-dimensional embedding storage.
* **Storage**: Provides secure file storage across `community-reports`, `avatars`, and `resource-documents` buckets.
* **Realtime Server**: Broadcasts database `INSERT` / `UPDATE` events to connected clients via WebSockets.
* **Row-Level Security (RLS)**: Enforces table access rules directly in the database.

### 2.3 FastAPI AI Microservice Layer
* Python 3.11+ async service handling heavy AI compute workloads.
* Executes OpenAI GPT-4o queries using strict **Structured Outputs** (JSON Schema).
* Conducts GPT-4o Vision analysis on crowd-sourced disaster photos.
* Runs RAG document ingestion and vector similarity calculations.

---

## 3. Communication Protocols

| Source | Destination | Protocol | Security / Auth |
|---|---|---|---|
| Frontend Client | Next.js API Routes | HTTPS / JSON | Supabase SSR Cookie JWT |
| Frontend Client | Supabase Realtime | WebSocket (`wss://`) | Supabase Anon Key + User JWT |
| Next.js API Routes | Supabase Postgres | TCP / SSL (pg) | Supabase Service Role Key |
| Next.js API Routes | FastAPI Microservice | HTTPS / JSON | Internal Secret Header (`X-Internal-Secret`) |
| FastAPI Service | OpenAI API | HTTPS / REST | Bearer API Key |

---

## 4. Security & Compliance Model

1. **Zero-Trust RLS Policies**: Database rows are protected at the database engine level based on authenticated `auth.uid()`.
2. **Session Cookie Isolation**: Auth tokens are never stored in `localStorage` or `sessionStorage` to mitigate XSS vulnerabilities.
3. **Structured Prompt Defense**: All inputs to OpenAI GPT-4o are wrapped inside immutable Pydantic/Zod schemas to prevent prompt injection.
