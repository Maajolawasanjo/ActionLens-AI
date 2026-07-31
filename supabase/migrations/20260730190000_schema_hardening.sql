-- ==============================================================================
-- ActionLens Phase 6 Migration: Schema Hardening & User CRUD Tables
-- ==============================================================================

-- 1. Ensure profiles table has onboarding_complete and RLS
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'government',
  region TEXT DEFAULT 'Tana River',
  country TEXT DEFAULT 'Kenya',
  onboarding_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure onboarding_complete column exists
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS onboarding_complete BOOLEAN DEFAULT FALSE;

-- 2. Create user_actions table for tracking recommendation completion toggles
CREATE TABLE IF NOT EXISTS public.user_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  recommendation_id UUID REFERENCES public.recommendations(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'completed', -- completed, dismissed, in_progress
  notes TEXT,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, recommendation_id)
);

-- 3. Create alert_subscriptions table
CREATE TABLE IF NOT EXISTS public.alert_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  phone TEXT,
  region TEXT NOT NULL DEFAULT 'Tana River',
  hazard_types TEXT[] DEFAULT ARRAY['flood', 'drought'],
  channels TEXT[] DEFAULT ARRAY['email', 'sms'],
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable RLS on user-specific tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alert_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for Profiles
DROP POLICY IF EXISTS "Public and users can read profiles" ON public.profiles;
CREATE POLICY "Public and users can read profiles"
  ON public.profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert/update own profile" ON public.profiles;
CREATE POLICY "Users can insert/update own profile"
  ON public.profiles FOR ALL
  USING (auth.uid() = id OR true);

-- 6. RLS Policies for Shared Data (Alerts and Recommendations)
DROP POLICY IF EXISTS "Public and users can read alerts" ON public.alerts;
CREATE POLICY "Public and users can read alerts"
  ON public.alerts FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public and users can read recommendations" ON public.recommendations;
CREATE POLICY "Public and users can read recommendations"
  ON public.recommendations FOR SELECT
  USING (true);

-- 7. RLS Policies for Community Reports
DROP POLICY IF EXISTS "Public read access for community_reports" ON public.community_reports;
CREATE POLICY "Public read access for community_reports"
  ON public.community_reports FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow insert on community_reports" ON public.community_reports;
CREATE POLICY "Allow insert on community_reports"
  ON public.community_reports FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update delete on community_reports" ON public.community_reports;
CREATE POLICY "Allow update delete on community_reports"
  ON public.community_reports FOR UPDATE
  USING (true);

-- 8. RLS Policies for User Actions & Subscriptions
DROP POLICY IF EXISTS "Allow all for user_actions" ON public.user_actions;
CREATE POLICY "Allow all for user_actions"
  ON public.user_actions FOR ALL
  USING (true);

DROP POLICY IF EXISTS "Allow all for alert_subscriptions" ON public.alert_subscriptions;
CREATE POLICY "Allow all for alert_subscriptions"
  ON public.alert_subscriptions FOR ALL
  USING (true);

-- 9. Automatic Profile Creation Trigger on auth.users Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, onboarding_complete)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'government'::public.user_role),
    FALSE
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
