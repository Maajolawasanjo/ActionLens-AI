# ActionLens AI — Supabase Platform & Security Setup

> **Location**: `backend/SUPABASE_SETUP.md`  
> **Status**: Deployment & Security Configuration Guide  
> **Target Version**: ActionLens AI v1.0 Production Candidate  

---

## 1. Authentication Configuration

### 1.1 SSR Cookies Setup (`src/lib/supabase/`)
Configure Next.js 16 Server Client using `@supabase/ssr`:

```typescript
// src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Handled in middleware
          }
        },
      },
    }
  );
}
```

---

## 2. Storage Bucket Definitions

| Bucket Name | Access Level | Allowed MIME Types | Max Size | Purpose |
|---|---|---|---|---|
| `community-reports` | Public Read / Auth Write | `image/jpeg`, `image/png`, `image/webp` | 10 MB | Crowd-sourced hazard evidence |
| `avatars` | Public Read / Auth Write | `image/jpeg`, `image/png`, `image/webp` | 5 MB | User profile photos |
| `resource-documents` | Private Signed URLs | `application/pdf` | 25 MB | Official SOP manuals & guides |

---

## 3. Realtime Engine Channels

1. **`realtime:community_reports`**: Broadcasts new hazard report arrivals to field command centers.
2. **`realtime:alerts`**: Pushes emergency evacuation advisories to active user dashboards.

---

## 4. Row-Level Security (RLS) Rules Across All 12 Tables

```sql
-- Enable RLS across all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.impact_simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.briefings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alert_subscriptions ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
CREATE POLICY "Profiles read own record" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Profiles update own record" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Recommendations Policies
CREATE POLICY "Users read role recommendations" ON public.recommendations FOR SELECT 
USING (user_id = auth.uid() OR region IN (SELECT region FROM public.profiles WHERE id = auth.uid()));

-- 3. Community Reports Policies
CREATE POLICY "Anyone views verified reports" ON public.community_reports FOR SELECT USING (status = 'verified' OR user_id = auth.uid());
CREATE POLICY "Authenticated users submit reports" ON public.community_reports FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 4. Conversations & Messages Policies
CREATE POLICY "Users read own conversations" ON public.conversations FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users insert own conversations" ON public.conversations FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users read conversation messages" ON public.messages FOR SELECT USING (
  conversation_id IN (SELECT id FROM public.conversations WHERE user_id = auth.uid())
);

-- 5. Impact Simulations & Briefings Policies
CREATE POLICY "Users view own simulations" ON public.impact_simulations FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users view own briefings" ON public.briefings FOR SELECT USING (user_id = auth.uid());
```
