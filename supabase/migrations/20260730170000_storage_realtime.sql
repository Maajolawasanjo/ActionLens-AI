-- ==============================================================================
-- ActionLens Phase 4 Migration: Storage Bucket & Realtime Integration
-- ==============================================================================

-- 1. Create Public Storage Bucket for Report Attachments
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'report-attachments',
  'report-attachments',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. Storage Policies for report-attachments
CREATE POLICY "Public Read Access for Report Attachments"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'report-attachments');

CREATE POLICY "Authenticated and Public Upload Access for Report Attachments"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'report-attachments');

-- 3. Enable Supabase Realtime for Alerts and Community Reports
ALTER PUBLICATION supabase_realtime ADD TABLE public.alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_reports;
ALTER PUBLICATION supabase_realtime ADD TABLE public.telemetry_risk_data;
