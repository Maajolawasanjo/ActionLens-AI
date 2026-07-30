export type UserRole = "government" | "ngo" | "responder" | "farmer" | "health_worker" | "citizen";
export type RiskLevel = "critical" | "high" | "moderate" | "low" | "safe";
export type RiskType = "flood" | "drought" | "disease" | "agriculture" | "storm" | "food";
export type PriorityLevel = "critical" | "high" | "medium" | "low";
export type TimeHorizon = "now" | "6h" | "24h" | "72h";
export type ReportCategory = "flood" | "drought" | "infrastructure" | "health" | "food" | "other";
export type ReportStatus = "pending" | "verified" | "rejected";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  country: string;
  region: string;
  district?: string | null;
  interests?: string[] | null;
  notification_email: boolean;
  notification_sms: boolean;
  phone_number?: string | null;
  onboarding_complete: boolean;
  avatar_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface RiskData {
  id: string;
  region: string;
  country: string;
  risk_type: RiskType;
  risk_level: RiskLevel;
  payload: Record<string, any>;
  source: string;
  geom?: string | null;
  valid_from: string;
  valid_until: string;
  created_at: string;
}

export interface Recommendation {
  id: string;
  user_id?: string | null;
  role: UserRole;
  region: string;
  risk_type: RiskType;
  action: string;
  priority: PriorityLevel;
  time_horizon: TimeHorizon;
  confidence_score: number;
  reasoning: string;
  expected_impact: string;
  evidence: Array<{ label: string; value: string; weight: number }> | any;
  status: string;
  created_at: string;
  expires_at?: string | null;
}

export interface UserAction {
  id: string;
  user_id: string;
  recommendation_id?: string | null;
  task_text: string;
  status: string;
  completed_at?: string | null;
  created_at: string;
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: RiskLevel;
  type: RiskType;
  region: string;
  country: string;
  source: string;
  source_url?: string | null;
  affected_areas?: string[] | null;
  affected_population?: number | null;
  ai_summary?: string | null;
  geom?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CommunityReport {
  id: string;
  user_id: string;
  description: string;
  category: ReportCategory;
  severity: RiskLevel;
  latitude: number;
  longitude: number;
  image_url?: string | null;
  ai_confidence?: number | null;
  ai_verified: boolean;
  ai_analysis?: Record<string, any> | null;
  status: ReportStatus;
  geom?: string | null;
  created_at: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: string;
  file_url?: string | null;
  category: RiskType;
  language: string;
  embedding?: number[] | null;
  created_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  citations?: string[] | null;
  created_at: string;
}

export interface ImpactSimulation {
  id: string;
  user_id: string;
  scenario_text: string;
  scenario_a: Record<string, any>;
  scenario_b: Record<string, any>;
  key_differences?: string[] | null;
  recommendation: string;
  confidence: number;
  created_at: string;
}

export interface Briefing {
  id: string;
  user_id: string;
  title: string;
  region: string;
  role: UserRole;
  content_markdown: string;
  pdf_url?: string | null;
  created_at: string;
}

export interface AlertSubscription {
  id: string;
  user_id: string;
  region: string;
  channel: "email" | "sms" | "push";
  is_active: boolean;
  created_at: string;
}

export interface IncidentTimeline {
  id: string;
  alert_id: string;
  event_text: string;
  occurred_at: string;
  source?: string | null;
  created_at: string;
}
