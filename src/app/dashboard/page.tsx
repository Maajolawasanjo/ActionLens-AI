"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { 
  Shield, ArrowRight, Sprout, Landmark, Users, 
  AlertTriangle, CheckCircle, ArrowLeft, Send, RefreshCw
} from "lucide-react";
import { DEMO_RESOURCE_DOCUMENTS } from "@/lib/demoSeedData";

// ── Types ──
interface LiveAlert {
  id: string;
  title: string;
  severity: string;
  type: string;
  region: string;
  country: string;
  source: string;
  affected_population: number;
  created_at: string;
}
interface LiveRec {
  id: string;
  role: string;
  region: string;
  risk_type: string;
  action: string;
  priority: string;
  time_horizon: string;
  confidence_score: number;
  reasoning: string;
  expected_impact: string;
  evidence: { label: string; value: string; source_type: string }[];
  status: string;
}
interface DashboardSummary {
  active_alerts: number;
  critical_alerts: number;
  citizens_protected: string;
  community_reports: number;
  verified_reports: number;
  telemetry_feeds: number;
  warning_precision: string;
  ai_confidence: string;
}
interface CommunityReport {
  id: string;
  description: string;
  category: string;
  severity: string;
  status: string;
  latitude: number;
  longitude: number;
  created_at: string;
}

// Dynamically import map component to disable SSR issues with Leaflet
const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#151D2A] border border-[#2E3A4E] rounded-xs flex items-center justify-center">
      <span className="text-xs font-mono text-[#94A3B8] animate-pulse">
        Initializing Spatial Telemetry Grid...
      </span>
    </div>
  ),
});

export default function DashboardPage() {
  const [activeScreen, setActiveScreen] = useState<"overview" | "alerts" | "community" | "decision">("overview");
  const [selectedPersona, setSelectedPersona] = useState<string>("government");
  const [delayHours, setDelayHours] = useState<number>(24);
  const [successMsg, setSuccessMsg] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Live data state
  const [summary, setSummary] = useState<DashboardSummary>({
    active_alerts: 8, critical_alerts: 3, citizens_protected: "42,380+",
    community_reports: 0, verified_reports: 0, telemetry_feeds: 2,
    warning_precision: "94.6%", ai_confidence: "96%",
  });
  const [liveAlerts, setLiveAlerts] = useState<LiveAlert[]>([]);
  const [liveReports, setLiveReports] = useState<CommunityReport[]>([]);
  const [recommendations, setRecommendations] = useState<LiveRec[]>([]);
  const [dataError, setDataError] = useState<string | null>(null);

  // Community Form State
  const [formDescription, setFormDescription] = useState("");
  const [formCategory, setFormCategory] = useState("flood");
  const [formSeverity, setFormSeverity] = useState("moderate");
  const [formLat, setFormLat] = useState("-1.8845");
  const [formLng, setFormLng] = useState("40.1221");
  const [formSubmitting, setFormSubmitting] = useState(false);

  // ── Fetch live dashboard data ──
  const fetchDashboard = useCallback(async () => {
    setIsRefreshing(true);
    setDataError(null);
    try {
      const [summaryRes, recsRes] = await Promise.all([
        fetch("/api/dashboard/summary"),
        fetch("/api/recommendations"),
      ]);

      if (summaryRes.ok) {
        const data = await summaryRes.json();
        if (data.summary) setSummary(data.summary);
        if (data.active_alerts?.length) setLiveAlerts(data.active_alerts);
        if (data.community_reports?.length) setLiveReports(data.community_reports);
      }

      if (recsRes.ok) {
        const data = await recsRes.json();
        if (data.recommendations?.length) setRecommendations(data.recommendations);
      }
    } catch {
      setDataError("Live telemetry temporarily unavailable. Displaying cached data.");
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // Handle community report submission (POST to API, fallback to local state)
  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDescription.trim()) return;
    setFormSubmitting(true);

    try {
      const res = await fetch("/api/community/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: formDescription,
          category: formCategory,
          severity: formSeverity,
          latitude: parseFloat(formLat) || -1.8845,
          longitude: parseFloat(formLng) || 40.1221,
        }),
      });

      const newReport: CommunityReport = {
        id: `rep_live_${Date.now()}`,
        description: formDescription,
        category: formCategory,
        severity: formSeverity,
        status: "pending",
        latitude: parseFloat(formLat) || -1.8845,
        longitude: parseFloat(formLng) || 40.1221,
        created_at: new Date().toISOString(),
      };

      if (res.ok) {
        const data = await res.json();
        setLiveReports([data.report ?? newReport, ...liveReports]);
      } else {
        setLiveReports([newReport, ...liveReports]);
      }
    } catch {
      const newReport: CommunityReport = {
        id: `rep_live_${Date.now()}`,
        description: formDescription,
        category: formCategory,
        severity: formSeverity,
        status: "pending",
        latitude: parseFloat(formLat) || -1.8845,
        longitude: parseFloat(formLng) || 40.1221,
        created_at: new Date().toISOString(),
      };
      setLiveReports([newReport, ...liveReports]);
    } finally {
      setFormDescription("");
      setFormSubmitting(false);
      setSuccessMsg("Hazard report successfully registered. Coordinate geometry updated.");
      setTimeout(() => setSuccessMsg(""), 5000);
    }
  };

  // Filter recommendations based on selected persona
  const filteredRecs = recommendations.filter(
    (rec) => rec.role.toLowerCase() === selectedPersona.toLowerCase()
  );

  // Consequence Simulator variables
  const displacedPeople = Math.round(400 + (delayHours / 72) * 12000);
  const financialLosses = Math.round(120000 + (delayHours / 72) * 1730000);

  // Map markers from live alerts
  const eastAfricaCenter: [number, number] = [-1.8800, 40.1200];
  const alertCoords: Record<string, [number, number]> = {
    "Lagos": [6.4969, 3.3881], "Florida": [25.7617, -80.1918],
    "California": [34.1808, -118.0963], "Northern Region": [12.0022, 8.5920],
    "Nairobi": [-1.2921, 36.8219], "Tokyo": [35.6895, 139.6917],
    "Benue": [7.7322, 8.5214], "Tana River": [-1.8845, 40.1221],
    "Greater Accra": [5.5500, -0.2167], "Garissa": [-0.4500, 39.6400],
  };
  const activeAlertMarkers = liveAlerts.map((alert) => {
    const [lat, lng] = alertCoords[alert.region] ?? [-1.8800, 40.1200];
    return { id: alert.id, lat, lng, title: alert.title, severity: alert.severity as any, type: alert.type };
  });



  return (
    <div className="min-h-screen bg-[#0B111E] text-[#E2E8F0] flex flex-col selection:bg-[#C5A880]/30 selection:text-[#C5A880] font-sans">
      
      {/* ── HEADER ── */}
      <header className="w-full border-b border-[#2E3A4E] bg-[#0B111E]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-9 w-9 rounded-xs bg-[#C5A880]/15 border border-[#C5A880]/40 flex items-center justify-center shrink-0">
              <img src="/app-icon.png" alt="AL" className="h-5 w-5 object-contain" />
            </div>
            <div className="min-w-0">
              <Link href="/" className="font-editorial text-lg sm:text-xl tracking-tight text-[#E2E8F0] font-bold block truncate">
                ActionLens <span className="text-[#C5A880] font-sans text-xs tracking-widest uppercase ml-1 font-semibold">AI</span>
              </Link>
              <p className="text-[9px] text-[#94A3B8] uppercase tracking-widest font-mono hidden min-[360px]:block truncate">IGAD Region Disaster Intelligence</p>
            </div>
          </div>

          {/* Interactive Screen Tab Selectors */}
          <nav className="hidden md:flex items-center gap-1 bg-[#151D2A] border border-[#2E3A4E] p-1 rounded-xs">
            {[
              { id: "overview", label: "Regional Overview" },
              { id: "alerts", label: "Alert Detail" },
              { id: "community", label: "Citizen Mobile View" },
              { id: "decision", label: "Decision Matrix" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveScreen(tab.id as any)}
                className={`text-xs font-mono uppercase tracking-wider py-2 px-4 transition-all rounded-xs cursor-pointer ${
                  activeScreen === tab.id
                    ? "bg-[#C5A880] text-[#0B111E] font-bold"
                    : "text-[#94A3B8] hover:text-[#E2E8F0]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs font-mono uppercase tracking-wider text-[#94A3B8] hover:text-[#E2E8F0] transition-colors"
            >
              Sign Out
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Screen Tab Selectors */}
      <div className="md:hidden flex justify-start min-[360px]:justify-around overflow-x-auto border-b border-[#2E3A4E] bg-[#151D2A] py-3 px-4 gap-2 scrollbar-none">
        {[
          { id: "overview", label: "Overview" },
          { id: "alerts", label: "Alert" },
          { id: "community", label: "Citizen" },
          { id: "decision", label: "Matrix" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveScreen(tab.id as any)}
            className={`text-[10px] font-mono uppercase tracking-wider py-1.5 px-3 rounded-xs shrink-0 ${
              activeScreen === tab.id ? "bg-[#C5A880] text-[#0B111E] font-bold" : "text-[#94A3B8]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        
        {/* ──────── SCREEN 1: REGIONAL RISK OVERVIEW ──────── */}
        {activeScreen === "overview" && (
          <div className="space-y-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 border-b border-[#2E3A4E] pb-6">
              <div className="space-y-2 min-w-0">
                <span className="text-xs font-mono text-[#C5A880] uppercase tracking-widest">Active Watch</span>
                <h1 className="font-editorial text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal text-[#E2E8F0] leading-tight">
                  Garsen Basin Water Discharge Past Critical Threshold
                </h1>
                <p className="text-xs sm:text-sm text-[#94A3B8] max-w-3xl leading-relaxed">
                  Real-time hydrometer telemetry reports River Tana water height at <span className="text-[#C1622E] font-bold">8.4 meters</span>, representing an active levee erosion event. Pre-disaster evacuations recommended.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={fetchDashboard}
                  disabled={isRefreshing}
                  className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#94A3B8] hover:text-[#C5A880] border border-[#2E3A4E] hover:border-[#C5A880]/40 px-3 py-2 rounded-xs transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`} />
                  {isRefreshing ? "Syncing" : "Sync"}
                </button>
                <div className="bg-[#8C2F2F]/20 border border-[#8C2F2F]/40 p-3 sm:p-4 rounded-xs text-left lg:text-right w-full lg:w-auto">
                  <span className="text-[9px] sm:text-[10px] font-mono text-[#E2E8F0] uppercase tracking-wider block">BASIN STATUS</span>
                  <span className="text-xl sm:text-2xl font-editorial text-[#8C2F2F] font-bold uppercase tracking-tight">CRITICAL ALERT</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-6">
                <div className="border border-[#2E3A4E] rounded-xs overflow-hidden">
                  <div className="p-4 border-b border-[#2E3A4E] bg-[#151D2A] flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-[#8C2F2F] animate-pulse" />
                      <span className="text-xs font-mono uppercase tracking-wider font-bold">East Africa Regional Risk Map</span>
                    </div>
                  </div>
                  <div className="h-[250px] sm:h-[350px] md:h-[400px]">
                    <MapComponent 
                      center={eastAfricaCenter} 
                      zoom={7} 
                      markers={activeAlertMarkers}
                      bufferCircle={{ center: [-1.8800, 40.1200], radiusKm: 15, severity: "critical" }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {dataError && (
                    <div className="col-span-2 sm:col-span-4 text-[10px] font-mono text-[#D9A441] bg-[#D9A441]/10 border border-[#D9A441]/30 px-3 py-2 rounded-xs">
                      ⚠ {dataError}
                    </div>
                  )}
                  {[
                    { label: "Communities Guarded",  val: summary.citizens_protected,   sub: "+8.4%",             color: "text-[#E2E8F0]" },
                    { label: "Active Warnings",      val: String(summary.active_alerts), sub: "IGAD Region",       color: "text-[#C1622E]" },
                    { label: "River Level",           val: "8.4m",                       sub: "+1.2m Threshold",   color: "text-[#8C2F2F]" },
                    { label: "Warning Precision",    val: summary.warning_precision,    sub: "AI Verified",       color: "text-[#D9A441]" }
                  ].map((stat, i) => (
                    <div key={i} className="bg-[#151D2A] border border-[#2E3A4E] p-3 sm:p-4 rounded-xs min-w-0">
                      <span className="text-[8px] sm:text-[10px] font-mono text-[#94A3B8] uppercase block tracking-wider truncate">{stat.label}</span>
                      <span className={`text-lg sm:text-2xl font-editorial font-bold tabular-nums block mt-1 sm:mt-2 truncate ${stat.color}`}>{stat.val}</span>
                      <span className="text-[8px] sm:text-[9px] font-mono text-[#94A3B8] uppercase mt-0.5 sm:mt-1 block truncate">{stat.sub}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4 space-y-6">
                <div className="bg-[#151D2A] border border-[#2E3A4E] p-6 rounded-xs space-y-4">
                  <div>
                    <h3 className="font-editorial text-lg text-[#E2E8F0]">Role-Tailored Intelligence</h3>
                    <p className="text-[11px] text-[#94A3B8] mt-1">
                      Filter live action directives by selecting your operational stakeholder role:
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "government", label: "Government", icon: Landmark },
                      { id: "responder", label: "Responder", icon: Shield },
                      { id: "farmer", label: "Farmer", icon: Sprout },
                      { id: "citizen", label: "Citizen", icon: Users }
                    ].map((persona) => (
                      <button
                        key={persona.id}
                        onClick={() => setSelectedPersona(persona.id)}
                        className={`flex items-center gap-2 p-2 border rounded-xs transition-all text-left cursor-pointer ${
                          selectedPersona === persona.id
                            ? "bg-[#C5A880]/15 border-[#C5A880] text-[#E2E8F0]"
                            : "border-[#2E3A4E] text-[#94A3B8] hover:border-[#94A3B8]/60"
                        }`}
                      >
                        <persona.icon className="h-4 w-4 shrink-0 text-[#C5A880]" />
                        <span className="text-[10px] font-mono uppercase tracking-wider font-bold">{persona.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-[#151D2A] border border-[#2E3A4E] p-6 rounded-xs space-y-4">
                  <div className="flex justify-between items-center border-b border-[#2E3A4E] pb-3">
                    <span className="text-[10px] font-mono text-[#C5A880] uppercase tracking-widest font-bold">Action Directive</span>
                    <span className="text-[9px] font-mono text-[#94A3B8] uppercase">Horizon: 24h-72h</span>
                  </div>

                  {filteredRecs.length > 0 ? (
                    filteredRecs.slice(0, 1).map((rec) => (
                      <div key={rec.id} className="space-y-4">
                        <div className="space-y-2">
                          <h4 className="font-editorial text-[#E2E8F0] leading-snug">{rec.action}</h4>
                          <p className="text-xs text-[#94A3B8] leading-relaxed">{rec.reasoning}</p>
                        </div>

                        <div className="bg-[#0B111E] border border-[#2E3A4E]/60 p-3 rounded-xs flex items-center justify-between">
                          <div>
                            <span className="text-[9px] font-mono text-[#94A3B8] uppercase block">AI CONFIDENCE</span>
                            <span className="text-xs font-mono font-bold text-[#E2E8F0] tabular-nums">
                              {(rec.confidence_score * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-[9px] font-mono text-[#94A3B8] uppercase block">TIME HORIZON</span>
                            <span className="text-[10px] font-mono text-[#C5A880] font-bold uppercase">
                              {rec.time_horizon}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2 pt-2">
                          <span className="text-[9px] font-mono text-[#94A3B8] uppercase tracking-wider">Required Field Actions</span>
                          <div className="space-y-2">
                            {(rec.evidence ?? []).slice(0, 3).map((item, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-xs">
                                <CheckCircle className="h-4 w-4 text-[#C5A880] shrink-0 mt-0.5" />
                                <span className="text-[#E2E8F0]">{item.label}: {item.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs font-mono text-[#94A3B8]">
                      {isRefreshing ? "Loading directives..." : "No active checklists for this role."}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ──────── SCREEN 2: ALERT DETAIL VIEW ──────── */}
        {activeScreen === "alerts" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-[#151D2A] border border-[#2E3A4E] p-4 sm:p-8 rounded-xs space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-[#8C2F2F]/20 border border-[#8C2F2F]/40 text-[#8C2F2F] font-bold uppercase">
                    Level 4 Severe
                  </span>
                  <span className="text-xs font-mono text-[#94A3B8]">Issued by: KMD Hydrological Service</span>
                  <span className="text-xs font-mono text-[#94A3B8] sm:ml-auto">Expires: 18h</span>
                </div>
                
                <h1 className="font-editorial text-2xl sm:text-4xl text-[#E2E8F0] leading-tight">
                  Garsen Levee Erosion & Flood Basin Cresting
                </h1>
                
                <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                  Upper catchment heavy precipitation has caused river discharge volumes to surge to 1,420 m³/s. Physical telemetry indicators identify early-stage structural fractures in the sector B-12 earthen levee wall. Floodwaters are projected to breach Garsen central farmlands in under 12 hours.
                </p>

                <div className="grid grid-cols-1 min-[340px]:grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-[#2E3A4E]/60">
                  <div>
                    <span className="text-[9px] font-mono text-[#94A3B8] uppercase block">AFFECTED POPULATION</span>
                    <span className="text-lg sm:text-xl font-mono font-bold text-[#E2E8F0] tabular-nums">12,400</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-[#94A3B8] uppercase block">TARGET CORRIDOR</span>
                    <span className="text-lg sm:text-xl font-mono font-bold text-[#E2E8F0]">Garsen Basin</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-[#94A3B8] uppercase block">GPS COORDINATES</span>
                    <span className="text-lg sm:text-xl font-mono font-bold text-[#E2E8F0] tabular-nums truncate block">-1.8800, 40.1200</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#151D2A] border border-[#2E3A4E] p-4 sm:p-6 rounded-xs space-y-4">
                <h3 className="font-editorial text-lg sm:text-xl text-[#E2E8F0]">Evacuation Operations Map</h3>
                <div className="h-[220px] sm:h-[280px]">
                  <MapComponent 
                    center={[-1.8800, 40.1200]} 
                    zoom={10} 
                    markers={[{
                      id: "evt_1",
                      lat: -1.8800,
                      lng: 40.1200,
                      title: "Critical Levee Erosion Site",
                      severity: "critical",
                      type: "flood"
                    }]}
                    bufferCircle={{ center: [-1.8800, 40.1200], radiusKm: 8, severity: "critical" }}
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#151D2A] border border-[#2E3A4E] p-4 sm:p-6 rounded-xs space-y-6">
                <div>
                  <h3 className="font-editorial text-base sm:text-lg text-[#E2E8F0]">Chronological Incident Log</h3>
                  <p className="text-[10px] text-[#94A3B8] mt-1 font-mono uppercase">
                    Milestones (UTC +3 hours)
                  </p>
                </div>

                <div className="relative border-l border-[#2E3A4E] ml-2 pl-4 space-y-6">
                  {[
                    { time: "06:15 EAT", title: "Upper Basin Rain", text: "NiMet satellite registers heavy storm pattern above upper catchment.", color: "bg-[#D9A441]" },
                    { time: "11:30 EAT", title: "River Gage 7.2m", text: "Gauge exceeds safety threshold. Warning triggered.", color: "bg-[#C1622E]" },
                    { time: "14:10 EAT", title: "Levee Fracture", text: "Earthen crack detected by field inspectors in Sector B.", color: "bg-[#8C2F2F]" },
                    { time: "15:45 EAT", title: "Evacuation Alert", text: "Emergency notification broadcast to mobile subscribers.", color: "bg-[#8C2F2F]" }
                  ].map((evt, i) => (
                    <div key={i} className="relative space-y-1">
                      <div className={`absolute -left-[21px] top-1.5 h-2 w-2 rounded-full border border-[#E2E8F0] ${evt.color}`} />
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono font-bold text-[#C5A880]">{evt.time}</span>
                      </div>
                      <h4 className="text-xs font-mono font-bold text-[#E2E8F0]">{evt.title}</h4>
                      <p className="text-[11px] text-[#94A3B8] leading-relaxed">{evt.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ──────── SCREEN 3: CITIZEN MOBILE VIEW ──────── */}
        {activeScreen === "community" && (
          <div className="w-full max-w-md mx-auto bg-[#151D2A] border border-[#2E3A4E] rounded-xs overflow-hidden shadow-2xl">
            <div className="bg-[#0B111E] border-b border-[#2E3A4E] p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#8C2F2F] animate-pulse" />
                <span className="text-[10px] font-mono text-[#E2E8F0] uppercase tracking-wider font-bold">
                  LOCAL FIELD PORTAL (LOW-BANDWIDTH)
                </span>
              </div>
            </div>

            <div className="bg-[#8C2F2F] p-4 text-center">
              <h2 className="font-editorial text-lg text-white font-bold">⚠️ CRITICAL FLOOD ORDER</h2>
              <p className="text-[10px] font-mono text-white/90 uppercase tracking-widest mt-1">
                Garsen Sector B — Evacuate to High Ground
              </p>
            </div>

            <div className="p-6 space-y-6">
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <h3 className="font-editorial text-lg text-[#E2E8F0] border-b border-[#2E3A4E] pb-2">
                  Submit Hazard Report
                </h3>
                
                {successMsg && (
                  <div className="p-3 bg-[#2E7D5B]/20 border border-[#2E7D5B]/40 text-[#2E7D5B] text-xs rounded-xs">
                    {successMsg}
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-[#94A3B8] uppercase">Description of Danger</label>
                  <textarea
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Describe flood levels, levee issues, or blockages..."
                    className="w-full text-xs bg-[#0B111E] border border-[#2E3A4E] p-3 rounded-xs text-[#E2E8F0] placeholder-[#64748B] focus:border-[#C5A880] focus:outline-none min-h-[70px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-[#94A3B8] uppercase">Category</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full text-xs bg-[#0B111E] border border-[#2E3A4E] p-2.5 rounded-xs text-[#E2E8F0] focus:border-[#C5A880]"
                    >
                      <option value="flood">Flood Inundation</option>
                      <option value="drought">Drought Impact</option>
                      <option value="infrastructure">Infrastructure Damage</option>
                      <option value="health">Disease Outbreak</option>
                      <option value="other">Other Hazard</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-[#94A3B8] uppercase">Severity</label>
                    <select
                      value={formSeverity}
                      onChange={(e) => setFormSeverity(e.target.value)}
                      className="w-full text-xs bg-[#0B111E] border border-[#2E3A4E] p-2.5 rounded-xs text-[#E2E8F0] focus:border-[#C5A880]"
                    >
                      <option value="moderate">Moderate</option>
                      <option value="high">High Warning</option>
                      <option value="critical">Critical Severe</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-[#94A3B8] uppercase">Latitude</label>
                    <input
                      type="text"
                      value={formLat}
                      onChange={(e) => setFormLat(e.target.value)}
                      className="w-full text-xs bg-[#0B111E] border border-[#2E3A4E] p-2.5 rounded-xs text-[#E2E8F0] font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-[#94A3B8] uppercase">Longitude</label>
                    <input
                      type="text"
                      value={formLng}
                      onChange={(e) => setFormLng(e.target.value)}
                      className="w-full text-xs bg-[#0B111E] border border-[#2E3A4E] p-2.5 rounded-xs text-[#E2E8F0] font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#C5A880] text-[#0B111E] font-bold text-xs uppercase tracking-widest rounded-xs hover:bg-[#D4B992] transition-colors cursor-pointer"
                >
                  Broadcast Report
                </button>
              </form>

              <div className="space-y-3 pt-4 border-t border-[#2E3A4E]">
                <h4 className="font-editorial text-base text-[#E2E8F0]">Latest Community Reports</h4>
                
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {liveReports.map((rep) => (
                    <div key={rep.id} className="bg-[#0B111E] border border-[#2E3A4E] p-3 rounded-xs space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-mono px-1.5 py-0.5 bg-[#8C2F2F]/20 text-[#EF4444] rounded-xs uppercase">
                          {rep.severity}
                        </span>
                        <span className="text-[9px] font-mono text-[#94A3B8]">{rep.created_at}</span>
                      </div>
                      <p className="text-xs text-[#E2E8F0]">{rep.description}</p>
                      <p className="text-[9px] text-[#94A3B8] font-mono">
                        {rep.category?.toUpperCase() ?? "REPORT"} · ({rep.latitude?.toFixed(4)}, {rep.longitude?.toFixed(4)})
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ──────── SCREEN 4: DECISION-MAKER VIEW ──────── */}
        {activeScreen === "decision" && (
          <div className="space-y-8">
            <div className="border-b border-[#2E3A4E] pb-6">
              <h1 className="font-editorial text-2xl sm:text-4xl text-[#E2E8F0]">
                ICPAC Coordinator Control Panel
              </h1>
              <p className="text-xs text-[#94A3B8] font-mono uppercase tracking-widest mt-1">
                Data-Dense Climate, Food, and Inundation Overlays
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 bg-[#151D2A] border border-[#2E3A4E] p-6 rounded-xs space-y-6">
                <div>
                  <h3 className="font-editorial text-xl text-[#E2E8F0]">Pre-Disaster Consequence Simulator</h3>
                  <p className="text-xs text-[#94A3B8] leading-relaxed mt-1">
                    Slide the evacuation notification delay timeline to simulate the exposure curve of displacement and financial vulnerability.
                  </p>
                </div>

                <div className="space-y-4 bg-[#0B111E] border border-[#2E3A4E]/60 p-6 rounded-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono text-[#94A3B8] uppercase">Evacuation Directive Delay</span>
                    <span className="text-lg font-mono font-bold text-[#C5A880] tabular-nums">
                      {delayHours} Hours
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="72"
                    step="6"
                    value={delayHours}
                    onChange={(e) => setDelayHours(parseInt(e.target.value))}
                    className="w-full accent-[#C5A880] bg-[#151D2A] h-1.5 rounded-lg appearance-none cursor-pointer"
                  />

                  <div className="flex justify-between text-[9px] font-mono text-[#64748B]">
                    <span>0h (Immediate Action)</span>
                    <span>24h Watch</span>
                    <span>48h Alert</span>
                    <span>72h Severe Delay</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border border-[#2E3A4E]/60 p-3 sm:p-4 rounded-xs min-w-0">
                    <span className="text-[9px] sm:text-[10px] font-mono text-[#94A3B8] uppercase block truncate">
                      Projected Displaced Population
                    </span>
                    <span className="text-xl sm:text-3xl font-editorial font-bold text-[#8C2F2F] block mt-1 tabular-nums truncate">
                      {displacedPeople.toLocaleString()}
                    </span>
                  </div>

                  <div className="border border-[#2E3A4E]/60 p-3 sm:p-4 rounded-xs min-w-0">
                    <span className="text-[9px] sm:text-[10px] font-mono text-[#94A3B8] uppercase block truncate">
                      Estimated Financial Loss (USD)
                    </span>
                    <span className="text-xl sm:text-3xl font-editorial font-bold text-[#E2E8F0] block mt-1 tabular-nums truncate">
                      ${financialLosses.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-[#8C2F2F]/10 border-l-2 border-[#8C2F2F] text-xs text-[#E2E8F0] leading-relaxed">
                  <span className="font-bold font-mono text-[#8C2F2F] uppercase block mb-1">SIMULATION DIRECTIVE</span>
                  {delayHours > 24 ? (
                    <span>WARNING: Evacuation delay exceeds 24 hours. Severe inundation models project levee wall breaches across Garsen central, blocking key evacuation highways. Evacuate immediately.</span>
                  ) : (
                    <span>SAFEGUARDING: Immediate response mitigates downstream displacement casualties by 90%+ and allows agricultural agents to secure stock.</span>
                  )}
                </div>
              </div>

              <div className="lg:col-span-5 space-y-6">
                <div className="bg-[#151D2A] border border-[#2E3A4E] p-6 rounded-xs space-y-4">
                  <h3 className="font-editorial text-lg text-[#E2E8F0]">East Africa Vulnerability Indexes</h3>
                  
                  <div className="space-y-3">
                    {[
                      { name: "Socio-Economic Vulnerability Index", score: "0.78", status: "Critical", color: "text-[#8C2F2F]" },
                      { name: "Agricultural Stress Telemetry Index", score: "0.64", status: "High", color: "text-[#C1622E]" },
                      { name: "Disease Outbreak Risk Index (Waterborne)", score: "0.52", status: "Medium", color: "text-[#D9A441]" },
                      { name: "Regional Infrastructure Defense Index", score: "0.32", status: "Low", color: "text-[#2E7D5B]" }
                    ].map((idx, i) => (
                      <div key={i} className="border-b border-[#2E3A4E]/60 pb-3 last:border-0 last:pb-0">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-[#E2E8F0] font-medium">{idx.name}</span>
                          <span className={`font-mono font-bold tabular-nums ${idx.color}`}>{idx.score}</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-[#94A3B8] font-mono mt-1">
                          <span>ICPAC 2026 Registry</span>
                          <span className="uppercase font-bold">{idx.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#151D2A] border border-[#2E3A4E] p-6 rounded-xs space-y-4">
                  <h3 className="font-editorial text-lg text-[#E2E8F0]">Executive briefing repository</h3>
                  
                  <div className="space-y-2">
                    {DEMO_RESOURCE_DOCUMENTS.slice(0, 3).map((doc) => (
                      <a
                        key={doc.id}
                        href="#"
                        className="flex items-center justify-between p-3 border border-[#2E3A4E]/60 hover:border-[#C5A880]/60 rounded-xs transition-colors group"
                      >
                        <div className="space-y-1">
                          <span className="text-xs text-[#E2E8F0] font-medium group-hover:text-[#C5A880] transition-colors line-clamp-1">
                            {doc.title}
                          </span>
                          <span className="text-[9px] font-mono text-[#94A3B8] uppercase block">
                            {doc.author_organization} | {doc.file_format}
                          </span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-[#94A3B8] group-hover:text-[#C5A880] transition-colors shrink-0 ml-2" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ── FOOTER ── */}
      <footer className="w-full border-t border-[#2E3A4E] bg-[#0B111E]/80 backdrop-blur-md py-8 mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-[#94A3B8]">
          <div className="flex items-center gap-2">
            <img src="/app-icon.png" alt="AL" className="h-4 w-4 object-contain" />
            <span>ActionLens Disaster Intelligence Grid</span>
          </div>
          <div>
            <span>Contact: maajolawasanjo@gmail.com | +2348105510626</span>
          </div>
          <div>
            <a href="https://www.linkedin.com/in/nathan-ma-ajo" target="_blank" className="hover:text-[#E2E8F0] underline">
              LinkedIn
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
