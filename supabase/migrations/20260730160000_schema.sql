-- Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Enum Definitions
CREATE TYPE user_role AS ENUM ('government', 'ngo', 'responder', 'farmer', 'health_worker', 'citizen');
CREATE TYPE risk_level AS ENUM ('critical', 'high', 'moderate', 'low', 'safe');
CREATE TYPE risk_type AS ENUM ('flood', 'drought', 'disease', 'agriculture', 'storm', 'food');
CREATE TYPE priority_level AS ENUM ('critical', 'high', 'medium', 'low');
CREATE TYPE time_horizon AS ENUM ('now', '6h', '24h', '72h');
CREATE TYPE report_category AS ENUM ('flood', 'drought', 'infrastructure', 'health', 'food', 'other');
CREATE TYPE report_status AS ENUM ('pending', 'verified', 'rejected');

-- 1. Profiles Table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'citizen',
  country TEXT NOT NULL DEFAULT 'Kenya',
  region TEXT NOT NULL DEFAULT 'Tana River',
  district TEXT,
  interests TEXT[] DEFAULT '{}',
  notification_email BOOLEAN NOT NULL DEFAULT true,
  notification_sms BOOLEAN NOT NULL DEFAULT false,
  phone_number TEXT,
  onboarding_complete BOOLEAN NOT NULL DEFAULT false,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Risk Data Table
CREATE TABLE public.risk_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  region TEXT NOT NULL,
  country TEXT NOT NULL,
  risk_type risk_type NOT NULL,
  risk_level risk_level NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  source TEXT NOT NULL,
  geom GEOMETRY(Point, 4326),
  valid_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  valid_until TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Recommendations Table
CREATE TABLE public.recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  region TEXT NOT NULL,
  risk_type risk_type NOT NULL,
  action TEXT NOT NULL,
  priority priority_level NOT NULL DEFAULT 'high',
  time_horizon time_horizon NOT NULL DEFAULT 'now',
  confidence_score NUMERIC(3,2) NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 1.0),
  reasoning TEXT NOT NULL,
  expected_impact TEXT NOT NULL,
  evidence JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- 4. User Actions Table
CREATE TABLE public.user_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recommendation_id UUID REFERENCES public.recommendations(id) ON DELETE SET NULL,
  task_text TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Alerts Table
CREATE TABLE public.alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  severity risk_level NOT NULL DEFAULT 'high',
  type risk_type NOT NULL,
  region TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'Kenya',
  source TEXT NOT NULL,
  source_url TEXT,
  affected_areas TEXT[] DEFAULT '{}',
  affected_population INTEGER,
  ai_summary TEXT,
  geom GEOMETRY(Point, 4326),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Community Reports Table
CREATE TABLE public.community_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  category report_category NOT NULL,
  severity risk_level NOT NULL DEFAULT 'moderate',
  latitude NUMERIC(10, 8) NOT NULL,
  longitude NUMERIC(11, 8) NOT NULL,
  image_url TEXT,
  ai_confidence NUMERIC(3,2),
  ai_verified BOOLEAN NOT NULL DEFAULT false,
  ai_analysis JSONB DEFAULT '{}'::jsonb,
  status report_status NOT NULL DEFAULT 'pending',
  geom GEOMETRY(Point, 4326),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Resources & Vector Embeddings Table
CREATE TABLE public.resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL,
  file_url TEXT,
  category risk_type NOT NULL,
  language TEXT NOT NULL DEFAULT 'en',
  embedding vector(1536),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Conversations Table (AI Assistant Sessions)
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'New Disaster Query',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Messages Table (AI Chat Message Stream)
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  citations TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Impact Simulations Table (Consequence Calculator Logs)
CREATE TABLE public.impact_simulations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  scenario_text TEXT NOT NULL,
  scenario_a JSONB NOT NULL,
  scenario_b JSONB NOT NULL,
  key_differences TEXT[] DEFAULT '{}',
  recommendation TEXT NOT NULL,
  confidence NUMERIC(3,2) NOT NULL DEFAULT 0.90,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Briefings Table (Generated Disaster Reports)
CREATE TABLE public.briefings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  region TEXT NOT NULL,
  role user_role NOT NULL,
  content_markdown TEXT NOT NULL,
  pdf_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. Alert Subscriptions Table
CREATE TABLE public.alert_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  region TEXT NOT NULL,
  channel TEXT NOT NULL CHECK (channel IN ('email', 'sms', 'push')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, region, channel)
);

-- 13. Incident Timelines Table
CREATE TABLE public.incident_timelines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  alert_id UUID NOT NULL REFERENCES public.alerts(id) ON DELETE CASCADE,
  event_text TEXT NOT NULL,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  source TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexing Strategy
CREATE INDEX idx_profiles_role_region ON public.profiles(role, region);
CREATE INDEX idx_recommendations_user ON public.recommendations(user_id);
CREATE INDEX idx_community_reports_status ON public.community_reports(status);
CREATE INDEX idx_resources_embedding ON public.resources USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX idx_incident_timelines_alert ON public.incident_timelines(alert_id);

-- Spatial Indexes (GIST) on new geom columns
CREATE INDEX idx_community_reports_geom ON public.community_reports USING GIST (geom);
CREATE INDEX idx_alerts_geom ON public.alerts USING GIST (geom);
CREATE INDEX idx_risk_data_geom ON public.risk_data USING GIST (geom);

-- PostGIS Distance RPC Function
CREATE OR REPLACE FUNCTION match_nearby_reports (
  lat NUMERIC,
  lng NUMERIC,
  radius_km NUMERIC
)
RETURNS TABLE (
  id UUID,
  description TEXT,
  category report_category,
  severity risk_level,
  latitude NUMERIC,
  longitude NUMERIC,
  distance_km NUMERIC
)
LANGUAGE sql STABLE
AS $$
  SELECT
    id,
    description,
    category,
    severity,
    latitude,
    longitude,
    (ST_Distance(geom::geography, ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography) / 1000.0) AS distance_km
  FROM public.community_reports
  WHERE ST_DWithin(geom::geography, ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography, radius_km * 1000.0)
  ORDER BY distance_km ASC;
$$;

-- Automatic Community Report geometry sync trigger
CREATE OR REPLACE FUNCTION public.sync_community_report_geom()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
    NEW.geom := ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_sync_community_report_geom
  BEFORE INSERT OR UPDATE OF latitude, longitude ON public.community_reports
  FOR EACH ROW EXECUTE FUNCTION public.sync_community_report_geom();

-- Profile Trigger for Auth.Users Creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'citizen')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Row Level Security (RLS) Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

ALTER TABLE public.community_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view verified reports" ON public.community_reports FOR SELECT USING (status = 'verified' OR user_id = auth.uid());
CREATE POLICY "Users can create reports" ON public.community_reports FOR INSERT WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view role/region recommendations" ON public.recommendations FOR SELECT 
USING (user_id = auth.uid() OR region IN (SELECT region FROM public.profiles WHERE id = auth.uid()));

ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active alerts" ON public.alerts FOR SELECT USING (is_active = true);
