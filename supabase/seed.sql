-- Disable triggers temporarily during seeding if needed (or let the handle_new_user trigger create profiles naturally)
-- Seed Auth Users (Supabase Local Dev Environment)
INSERT INTO auth.users (id, email, raw_user_meta_data, created_at, updated_at, aud, role, encrypted_password)
VALUES 
  ('a6102a9b-731b-4171-8894-37a5998f4110', 'director@icpac.net', '{"full_name": "Dr. Sarah Chen", "role": "government"}'::jsonb, NOW(), NOW(), 'authenticated', 'authenticated', '$2a$10$abcdefghijklmnopqrstuv'),
  ('b6102a9b-731b-4171-8894-37a5998f4111', 'officer@redcross.or.ke', '{"full_name": "Abdi Ibrahim", "role": "responder"}'::jsonb, NOW(), NOW(), 'authenticated', 'authenticated', '$2a$10$abcdefghijklmnopqrstuv'),
  ('c6102a9b-731b-4171-8894-37a5998f4112', 'farmer.kibet@gmail.com', '{"full_name": "Joseph Kibet", "role": "farmer"}'::jsonb, NOW(), NOW(), 'authenticated', 'authenticated', '$2a$10$abcdefghijklmnopqrstuv'),
  ('d6102a9b-731b-4171-8894-37a5998f4113', 'mary.kamau@outlook.com', '{"full_name": "Mary Kamau", "role": "citizen"}'::jsonb, NOW(), NOW(), 'authenticated', 'authenticated', '$2a$10$abcdefghijklmnopqrstuv')
ON CONFLICT (id) DO NOTHING;

-- Enforce onboarding profiles update
UPDATE public.profiles
SET 
  country = 'Kenya',
  region = 'Nairobi',
  district = 'Westlands',
  interests = '{flood,drought,food}',
  notification_email = true,
  notification_sms = true,
  phone_number = '+254711223344',
  onboarding_complete = true
WHERE id = 'a6102a9b-731b-4171-8894-37a5998f4110';

UPDATE public.profiles
SET 
  country = 'Kenya',
  region = 'Garissa',
  district = 'Garissa Central',
  interests = '{flood,disease}',
  notification_email = true,
  notification_sms = true,
  phone_number = '+254722334455',
  onboarding_complete = true
WHERE id = 'b6102a9b-731b-4171-8894-37a5998f4111';

UPDATE public.profiles
SET 
  country = 'Kenya',
  region = 'Rift Valley',
  district = 'Nandi',
  interests = '{drought,agriculture}',
  notification_email = true,
  notification_sms = true,
  phone_number = '+254733445566',
  onboarding_complete = true
WHERE id = 'c6102a9b-731b-4171-8894-37a5998f4112';

UPDATE public.profiles
SET 
  country = 'Kenya',
  region = 'Tana River',
  district = 'Garsen',
  interests = '{flood,food}',
  notification_email = true,
  notification_sms = false,
  phone_number = '+254744556677',
  onboarding_complete = true
WHERE id = 'd6102a9b-731b-4171-8894-37a5998f4113';

-- Seed Risk Data (Physical Telemetry)
INSERT INTO public.risk_data (id, region, country, risk_type, risk_level, payload, source, geom, valid_from, valid_until)
VALUES
  (
    'e0102a9b-731b-4171-8894-37a5998f4120',
    'Tana River',
    'Kenya',
    'flood',
    'critical',
    '{"river_level_m": 8.4, "flood_prob_pct": 92, "precipitation_forecast_mm": 120}'::jsonb,
    'KMD Meteorological Station 4',
    ST_SetSRID(ST_MakePoint(40.1245, -1.8924), 4326),
    NOW(),
    NOW() + INTERVAL '72 hours'
  ),
  (
    'e0102a9b-731b-4171-8894-37a5998f4121',
    'Garissa',
    'Kenya',
    'drought',
    'high',
    '{"soil_moisture_index": 0.12, "days_without_rain": 94, "temperature_c": 39.5}'::jsonb,
    'NDMA Drought Monitoring Index',
    ST_SetSRID(ST_MakePoint(39.6412, -0.4568), 4326),
    NOW(),
    NOW() + INTERVAL '30 days'
  ),
  (
    'e0102a9b-731b-4171-8894-37a5998f4122',
    'Rift Valley',
    'Kenya',
    'agriculture',
    'moderate',
    '{"locust_swarm_density_sq_km": 15, "wind_direction": "SW", "speed_kmh": 22}'::jsonb,
    'DLCO-EA Locust Watch',
    ST_SetSRID(ST_MakePoint(35.2697, 0.5142), 4326),
    NOW(),
    NOW() + INTERVAL '7 days'
  );

-- Seed Alerts
INSERT INTO public.alerts (id, title, description, severity, type, region, country, source, affected_areas, affected_population, ai_summary, geom, is_active)
VALUES
  (
    'f0102a9b-731b-4171-8894-37a5998f4130',
    'Imminent River Tana Levee Overtopping Warning',
    'Upper catchment heavy rainfall has caused rapid river swell. Levels at Garsen station are currently at 8.4m (+1.2m past critical threshold). Residents in low-lying Garsen district must evacuate immediately.',
    'critical',
    'flood',
    'Tana River',
    'Kenya',
    'Kenya Meteorological Department (KMD)',
    ARRAY['Garsen Central', 'Ndera', 'Salama', 'Kipini'],
    12400,
    'CRITICAL: River Tana Garsen levee is near overflow at 8.4m. Evacuate Garsen Central, Ndera, and Salama immediately.',
    ST_SetSRID(ST_MakePoint(40.1200, -1.8800), 4326),
    true
  ),
  (
    'f0102a9b-731b-4171-8894-37a5998f4131',
    'Garissa Regional Agricultural Drought Alarm',
    'Severe moisture deficits recorded across pastoral zones. Watering points drying up. Critical livestock health decline forecast in the next 14 days.',
    'high',
    'drought',
    'Garissa',
    'Kenya',
    'National Drought Management Authority (NDMA)',
    ARRAY['Dadaab', 'Fafi', 'Lagdera'],
    34500,
    'HIGH WATCH: Pastoral zones entering crisis levels. Evaporation rate up. Emergency food/water security response activated.',
    ST_SetSRID(ST_MakePoint(39.6400, -0.4500), 4326),
    true
  );

-- Seed Incident Timelines
INSERT INTO public.incident_timelines (alert_id, event_text, occurred_at, source)
VALUES
  (
    'f0102a9b-731b-4171-8894-37a5998f4130',
    'Rainfall intensity exceeds 65mm/hr in Upper Catchment gauge #22',
    NOW() - INTERVAL '18 hours',
    'KMD Automated Gauge'
  ),
  (
    'f0102a9b-731b-4171-8894-37a5998f4130',
    'Garsen River Level indicator reaches 7.2m (Moderate Warning threshold)',
    NOW() - INTERVAL '12 hours',
    'WRA Sensor Team'
  ),
  (
    'f0102a9b-731b-4171-8894-37a5998f4130',
    'Garsen Levee erosion observed near sector B-12',
    NOW() - INTERVAL '6 hours',
    'Citizen Hazard Report verified by Red Cross'
  ),
  (
    'f0102a9b-731b-4171-8894-37a5998f4130',
    'Red alert activated. Level recorded at 8.4m. Evacuation order broadcast.',
    NOW() - INTERVAL '1 hour',
    'ICPAC Regional Coordinator'
  );

-- Seed Recommendations
INSERT INTO public.recommendations (id, user_id, role, region, risk_type, action, priority, time_horizon, confidence_score, reasoning, expected_impact, evidence)
VALUES
  (
    'ac102a9b-731b-4171-8894-37a5998f4140',
    'b6102a9b-731b-4171-8894-37a5998f4111',
    'responder',
    'Garissa',
    'drought',
    'Pre-position mobile veterinary and emergency water trucks in Dadaab camp sector 3',
    'high',
    '24h',
    0.91,
    'NDMA regional moisture depletion rate dictates critical failure of shallow wells in sector 3 within 24 hours.',
    'Saves up to 4,000 cattle from severe dehydration stress.',
    '[{"label": "Dadaab Sensor 4", "value": "12% soil moist", "weight": 0.85}]'::jsonb
  ),
  (
    'ac102a9b-731b-4171-8894-37a5998f4141',
    'c6102a9b-731b-4171-8894-37a5998f4112',
    'farmer',
    'Rift Valley',
    'agriculture',
    'Apply crop-defense covers and prepare protective smoke boundaries to deter approaching swarm locust path',
    'medium',
    '72h',
    0.85,
    'Locust flight trajectories align SW with Rift Valley wind directions.',
    'Reduces crop damage yields by up to 35% across farm acreage.',
    '[{"label": "DLCO Swarm Index", "value": "15 sq km dense", "weight": 0.74}]'::jsonb
  ),
  (
    'ac102a9b-731b-4171-8894-37a5998f4142',
    'd6102a9b-731b-4171-8894-37a5998f4113',
    'citizen',
    'Tana River',
    'flood',
    'Evacuate immediately to Garsen High School assembly point A',
    'critical',
    'now',
    0.98,
    'Garsen sector B levee is experiencing active erosion, flooding likely in 2 hours.',
    'Prevents life-threatening isolation and flood injury.',
    '[{"label": "Garsen River Level", "value": "8.4m", "weight": 0.95}]'::jsonb
  );

-- Seed User Actions (Checklist Tasks)
INSERT INTO public.user_actions (user_id, recommendation_id, task_text, status, completed_at)
VALUES
  ('b6102a9b-731b-4171-8894-37a5998f4111', 'ac102a9b-731b-4171-8894-37a5998f4140', 'Mobilize emergency water trucks from Garissa depot', 'completed', NOW() - INTERVAL '3 hours'),
  ('b6102a9b-731b-4171-8894-37a5998f4111', 'ac102a9b-731b-4171-8894-37a5998f4140', 'Alert local camp leaders in Dadaab Sector 3', 'pending', NULL),
  ('c6102a9b-731b-4171-8894-37a5998f4112', 'ac102a9b-731b-4171-8894-37a5998f4141', 'Procure crop defensive covers from Garsen agro-dealer', 'pending', NULL),
  ('c6102a9b-731b-4171-8894-37a5998f4112', 'ac102a9b-731b-4171-8894-37a5998f4141', 'Clear debris from primary drainage channel A-4', 'completed', NOW() - INTERVAL '1 day');

-- Seed Community Reports
INSERT INTO public.community_reports (id, user_id, description, category, severity, latitude, longitude, image_url, ai_confidence, ai_verified, ai_analysis, status)
VALUES
  (
    '00102a9b-731b-4171-8894-37a5998f4150',
    'd6102a9b-731b-4171-8894-37a5998f4113',
    'Severe erosion observed along Garsen sector B levee wall. Cracks are expanding fast.',
    'flood',
    'critical',
    -1.8845,
    40.1221,
    'https://images.unsplash.com/photo-1547683905-f686c993aae5?q=80&w=600',
    0.94,
    true,
    '{"hazard_detected": "levee erosion", "structural_risk": "high", "recommends_verification": true}'::jsonb,
    'verified'
  ),
  (
    '00102a9b-731b-4171-8894-37a5998f4151',
    'b6102a9b-731b-4171-8894-37a5998f4111',
    'Borehole #4 pumps dry, pastoralists migrating south earlier than normal.',
    'drought',
    'high',
    -0.4589,
    39.6432,
    'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?q=80&w=600',
    0.89,
    true,
    '{"hazard_detected": "drought migration", "agricultural_risk": "critical"}'::jsonb,
    'verified'
  );

-- Seed Resources (SOPs)
INSERT INTO public.resources (title, description, type, file_url, category, language)
VALUES
  (
    'ICPAC Regional Flood Action Standard Operating Procedures',
    'Official guidelines for river basin evacuation triggers, coordinator checklists, and alert levels.',
    'PDF Manual',
    '/documents/ICPAC_Flood_SOP_2026.pdf',
    'flood',
    'en'
  ),
  (
    'National Drought Management Guidelines for Arid Regions',
    'SOPs for emergency water distributions, livestock feed subsidies, and water trucking logistics.',
    'PDF Manual',
    '/documents/NDMA_Drought_Response_Guidelines.pdf',
    'drought',
    'en'
  );

-- Seed Impact Simulations
INSERT INTO public.impact_simulations (user_id, scenario_text, scenario_a, scenario_b, key_differences, recommendation, confidence)
VALUES
  (
    'a6102a9b-731b-4171-8894-37a5998f4110',
    'Tana River Flood Levee Breach Delay Impact',
    '{"evacuation_delay_hours": 0, "displaced_population": 400, "estimated_losses_usd": 120000}'::jsonb,
    '{"evacuation_delay_hours": 72, "displaced_population": 12400, "estimated_losses_usd": 1850000}'::jsonb,
    ARRAY['Breach occurs in 24 hours', '72h delay results in +12,000 citizens trapped in flooded sector B', 'Financial damages increase by $1.7M due to submerged assets'],
    'Initiate evacuation immediately. Delaying response by 72 hours results in catastrophic exposure curves.',
    0.95
  );

-- Seed Alert Subscriptions
INSERT INTO public.alert_subscriptions (user_id, region, channel, is_active)
VALUES
  ('b6102a9b-731b-4171-8894-37a5998f4111', 'Garissa', 'sms', true),
  ('b6102a9b-731b-4171-8894-37a5998f4111', 'Garissa', 'email', true),
  ('c6102a9b-731b-4171-8894-37a5998f4112', 'Rift Valley', 'sms', true);
