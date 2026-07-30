"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { 
  Shield, ArrowRight, Radio, Brain, Users, MapPin, 
  BarChart3, AlertTriangle, Globe2, Clock, Landmark,
  HeartPulse, Sprout, FileText
} from "lucide-react";
import { 
  DEMO_ACTIVE_ALERTS, 
  DEMO_RESOURCE_DOCUMENTS 
} from "@/lib/demoSeedData";

// Dynamically import map component for the landing page map preview
const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#151D2A] border border-[#2E3A4E] rounded-xs flex items-center justify-center">
      <span className="text-xs font-mono text-[#94A3B8] animate-pulse">
        Loading regional GIS coordinates...
      </span>
    </div>
  ),
});

export default function LandingPage() {
  // Coordinates & markers for landing page preview
  const eastAfricaCenter: [number, number] = [-1.8800, 40.1200];
  const mapMarkers = DEMO_ACTIVE_ALERTS.map((alert, idx) => ({
    id: alert.id,
    lat: idx === 0 ? -1.8800 : idx === 1 ? -0.4500 : 0.5142,
    lng: idx === 0 ? 40.1200 : idx === 1 ? 39.6400 : 35.2697,
    title: alert.title,
    severity: alert.severity,
    type: alert.type
  }));

  return (
    <div className="min-h-screen bg-[#0B111E] text-[#E2E8F0] flex flex-col selection:bg-[#C5A880]/30 selection:text-[#C5A880] font-sans">
      
      {/* Navigation Header */}
      <header className="w-full border-b border-[#2E3A4E] bg-[#0B111E]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xs bg-[#C5A880]/10 border border-[#C5A880]/40 flex items-center justify-center">
              <Shield className="h-5 w-5 text-[#C5A880]" />
            </div>
            <div>
              <span className="font-editorial text-xl tracking-tight text-[#E2E8F0] font-bold block">
                ActionLens <span className="text-[#C5A880] font-sans text-xs tracking-widest uppercase ml-1 font-semibold">AI</span>
              </span>
              <p className="text-[9px] text-[#94A3B8] uppercase tracking-widest font-mono">IGAD Region Disaster Intelligence</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-xs font-mono uppercase tracking-wider text-[#94A3B8] hover:text-[#E2E8F0] transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="text-xs font-mono uppercase tracking-wider text-[#0B111E] bg-[#C5A880] hover:bg-[#D4B992] transition-colors py-2 px-4 rounded-xs font-bold"
            >
              Initialize Console
            </Link>
          </div>
        </div>
      </header>

      {/* ── SECTION 1: HERO COMMAND SECTION ── */}
      <section className="relative min-h-[90vh] flex flex-col justify-center border-b border-[#2E3A4E] py-20 bg-[radial-gradient(ellipse_at_top_right,#1C2638_0%,#0B111E_70%)]">
        <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#C5A880]/10 border border-[#C5A880]/30 rounded-xs">
                <Radio className="h-3 w-3 text-[#C5A880] animate-pulse" />
                <span className="text-[9px] font-mono text-[#C5A880] uppercase tracking-widest font-bold">
                  Active Monitoring Network
                </span>
              </div>
              <h1 className="font-editorial text-4xl sm:text-6xl font-normal leading-[1.05] tracking-tight text-[#E2E8F0]">
                Bridging Early Warning <br />
                with <span className="text-[#C5A880] font-bold">Resilience Actions</span>
              </h1>
              <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed max-w-2xl font-normal">
                ActionLens AI converts complex regional climate, hydrological, and vector disease data feeds into customized, role-specific action lists, empowering stakeholders to react before disasters strike.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-3 px-8 py-4 bg-[#C5A880] hover:bg-[#D4B992] text-[#0B111E] text-xs font-bold uppercase tracking-widest rounded-xs transition-all shadow-lg"
              >
                <span>Enter Command Console</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-3 px-8 py-4 border border-[#2E3A4E] hover:border-[#C5A880]/60 text-[#E2E8F0] text-xs font-bold uppercase tracking-widest rounded-xs transition-all bg-[#151D2A]/40"
              >
                <span>Console Sign In</span>
              </Link>
            </div>

            {/* Platform statistics strip */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-[#2E3A4E]/60 max-w-lg">
              <div>
                <span className="text-[10px] font-mono text-[#94A3B8] uppercase block">Protected Areas</span>
                <span className="text-2xl font-editorial font-bold text-[#E2E8F0] tabular-nums mt-1">42K+</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#94A3B8] uppercase block">Response Accuracy</span>
                <span className="text-2xl font-editorial font-bold text-[#E2E8F0] tabular-nums mt-1">94.6%</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#94A3B8] uppercase block">Telemetry Stations</span>
                <span className="text-2xl font-editorial font-bold text-[#E2E8F0] tabular-nums mt-1">128</span>
              </div>
            </div>
          </div>

          {/* Right Preview Card */}
          <div className="lg:col-span-5 bg-[#151D2A] border border-[#2E3A4E] p-6 rounded-xs space-y-4 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 h-40 w-40 bg-[#C5A880]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="flex justify-between items-center border-b border-[#2E3A4E]/60 pb-3">
              <span className="text-[10px] font-mono text-[#C5A880] uppercase tracking-wider font-bold">SYSTEM TELEMETRY</span>
              <span className="h-2 w-2 rounded-full bg-[#8C2F2F] animate-pulse" />
            </div>
            
            <div className="space-y-3">
              <div className="p-3 bg-[#0B111E] border border-[#2E3A4E]/60 rounded-xs flex justify-between items-center">
                <div>
                  <span className="text-[9px] font-mono text-[#94A3B8] uppercase block">River Tana Gauge</span>
                  <span className="text-sm font-mono font-bold text-[#EF4444]">8.4m (CRITICAL)</span>
                </div>
                <AlertTriangle className="h-4 w-4 text-[#EF4444]" />
              </div>

              <div className="p-3 bg-[#0B111E] border border-[#2E3A4E]/60 rounded-xs flex justify-between items-center">
                <div>
                  <span className="text-[9px] font-mono text-[#94A3B8] uppercase block">NDMA Drought Index</span>
                  <span className="text-sm font-mono font-bold text-[#C1622E]">High Alert (Garissa)</span>
                </div>
                <Radio className="h-4 w-4 text-[#C1622E]" />
              </div>

              <div className="p-3 bg-[#0B111E] border border-[#2E3A4E]/60 rounded-xs flex justify-between items-center">
                <div>
                  <span className="text-[9px] font-mono text-[#94A3B8] uppercase block">AI Verification Rate</span>
                  <span className="text-sm font-mono font-bold text-[#2E7D5B]">96% Confidence</span>
                </div>
                <Brain className="h-4 w-4 text-[#2E7D5B]" />
              </div>
            </div>

            <Link 
              href="/register" 
              className="text-xs font-mono uppercase text-[#C5A880] hover:text-[#D4B992] flex items-center gap-1.5 pt-2"
            >
              Initialize Profile Credentials <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

        </div>
      </section>

      {/* ── SECTION 2: REGIONAL COVERAGE MAP PREVIEW ── */}
      <section className="py-24 bg-[#0B111E] border-b border-[#2E3A4E]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-mono text-[#C5A880] uppercase tracking-widest font-bold">GIS Geolocation</span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#E2E8F0]">
              IGAD Monitoring & Hazard Network
            </h2>
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              Consolidated real-time mapping registers local reports, emergency shelters, and telemetry sensors. Our active PostGIS spatial integration maps coordinates to identify exact flood zones, drought anomalies, and vector outbreaks instantly.
            </p>
            <div className="pt-2">
              <Link 
                href="/login" 
                className="text-xs font-mono uppercase text-[#C5A880] hover:text-[#D4B992] flex items-center gap-1.5"
              >
                Access Active GIS Map <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 border border-[#2E3A4E] rounded-xs overflow-hidden h-[380px]">
            <MapComponent center={eastAfricaCenter} zoom={7} markers={mapMarkers} />
          </div>

        </div>
      </section>

      {/* ── SECTION 3: 6 STAKEHOLDER PERSONAS ── */}
      <section className="py-24 bg-[#111827] border-b border-[#2E3A4E]">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-mono text-[#C5A880] uppercase tracking-widest font-bold">Stakeholder Alignment</span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#E2E8F0]">
              Six Operational Roles. Zero Action Paralysis.
            </h2>
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              Disaster alerts are filtered through role-specific schemas to yield step-by-step checklists, ensuring teams receive relevant instructions without noise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Government Official", icon: Landmark, desc: "Issue coordinated regional crisis directives, approve emergency relief funds, and coordinate inter-department budgets." },
              { title: "NGO Humanitarian Lead", icon: Globe2, desc: "Log and dispatch water purification kits, coordinate emergency displacement shelter setup, and allocate aids." },
              { title: "Emergency Responder", icon: Shield, desc: "Pre-position emergency water rescue crafts, configure evacuation routes, and manage mobile hospital triage posts." },
              { title: "Agro-Agent / Farmer", icon: Sprout, desc: "Track soil moisture index telemetry, organize crop harvests, and evacuate livestock before inundation corridors flood." },
              { title: "Public Health Lead", icon: HeartPulse, desc: "Monitor post-flood vector disease outbreaks, manage medicine cold chains, and deploy rapid testing kits." },
              { title: "Citizen Resident", icon: Users, desc: "Receive immediate localized hazard warning alerts, access home evacuation routes, and submit verified hazard reports." }
            ].map((p, i) => {
              const IconComp = p.icon;
              return (
                <div key={i} className="bg-[#151D2A] border border-[#2E3A4E] p-6 rounded-xs space-y-4 hover:border-[#C5A880]/60 transition-colors group">
                  <div className="h-10 w-10 rounded-xs bg-[#C5A880]/10 border border-[#C5A880]/30 flex items-center justify-center group-hover:bg-[#C5A880] group-hover:text-[#0B111E] transition-all">
                    <IconComp className="h-5 w-5 text-[#C5A880] group-hover:text-inherit" />
                  </div>
                  <h3 className="font-editorial text-xl text-[#E2E8F0]">{p.title}</h3>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">{p.desc}</p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ── SECTION 4: LIVE HAZARD REGISTRY ── */}
      <section className="py-24 bg-[#0B111E] border-b border-[#2E3A4E]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-mono text-[#C5A880] uppercase tracking-widest font-bold">Active Warnings</span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#E2E8F0]">
              Live Regional Incident Bulletin
            </h2>
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              Aggregated real-time warnings pulled from regional sensors and verified community feedback networks. Built to eliminate lag between data logging and alert broadcasting.
            </p>
            <div className="pt-2">
              <Link 
                href="/login" 
                className="text-xs font-mono uppercase text-[#C5A880] hover:text-[#D4B992] flex items-center gap-1.5"
              >
                Access Alert Detail Center <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#151D2A] border border-[#2E3A4E] rounded-xs overflow-hidden">
            <div className="p-4 border-b border-[#2E3A4E] flex justify-between items-center bg-[#111827]">
              <span className="text-xs font-mono font-bold text-[#E2E8F0] uppercase">Latest Bulletins</span>
              <span className="text-[10px] font-mono text-[#94A3B8]">Region: East Africa</span>
            </div>

            <div className="divide-y divide-[#2E3A4E]/60">
              {DEMO_ACTIVE_ALERTS.map((alert) => (
                <div key={alert.id} className="p-5 flex justify-between items-start gap-4 hover:bg-[#1C2638]/20 transition-colors">
                  <div>
                    <span className={`text-[9px] font-mono px-2 py-0.5 border rounded-xs uppercase font-bold ${
                      alert.severity === "critical" 
                        ? "bg-[#8C2F2F]/20 border-[#8C2F2F]/40 text-[#EF4444]" 
                        : "bg-[#C1622E]/20 border-[#C1622E]/40 text-[#C1622E]"
                    }`}>
                      {alert.severity}
                    </span>
                    <h4 className="font-editorial text-base text-[#E2E8F0] mt-2 font-semibold">{alert.title}</h4>
                    <p className="text-xs text-[#94A3B8] mt-1">{alert.recommended_action}</p>
                  </div>
                  <span className="text-[10px] font-mono text-[#94A3B8] shrink-0">{alert.issued_time}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── SECTION 5: PREDICTIVE SIMULATOR PREVIEW ── */}
      <section className="py-24 bg-[#111827] border-b border-[#2E3A4E]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Simulated Panel Layout */}
          <div className="lg:col-span-7 bg-[#151D2A] border border-[#2E3A4E] p-6 rounded-xs space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-[#2E3A4E]/60 pb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4.5 w-4.5 text-[#C5A880]" />
                <span className="text-xs font-mono text-[#E2E8F0] uppercase tracking-wider font-bold">
                  Pre-Disaster Impact Modeling (Simulation)
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#94A3B8]">Confidence Score: 0.95</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#0B111E] border border-[#2E3A4E]/60 p-4 rounded-xs">
                <span className="text-[9px] font-mono text-[#94A3B8] uppercase block">Delayed Notification (72h)</span>
                <span className="text-2xl font-editorial font-bold text-[#8C2F2F] block mt-1 tabular-nums">12,400</span>
                <span className="text-[9px] font-mono text-[#64748B] block mt-0.5">Projected Displacements</span>
              </div>

              <div className="bg-[#0B111E] border border-[#2E3A4E]/60 p-4 rounded-xs">
                <span className="text-[9px] font-mono text-[#94A3B8] uppercase block">Delayed Notification (72h)</span>
                <span className="text-2xl font-editorial font-bold text-[#E2E8F0] block mt-1 tabular-nums">$1.85M</span>
                <span className="text-[9px] font-mono text-[#64748B] block mt-0.5">Financial Damages</span>
              </div>
            </div>

            <div className="p-3 bg-[#8C2F2F]/10 border-l-2 border-[#8C2F2F] text-[11px] text-[#E2E8F0] leading-relaxed">
              AI Recommendation: Unleashing early warnings 72h prior saves an estimated $1.73M and prevents severe regional displacement casualties.
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-mono text-[#C5A880] uppercase tracking-widest font-bold">Decision Intelligence</span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#E2E8F0]">
              Predictive Consequence Modeling
            </h2>
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              Simulate disaster exposure curves by modeling evacuation time delays. Use ActionLens Decision Matrix overlays to visualize human displacement and infrastructure impact before dispatching resources.
            </p>
            <div className="pt-2">
              <Link 
                href="/login" 
                className="text-xs font-mono uppercase text-[#C5A880] hover:text-[#D4B992] flex items-center gap-1.5"
              >
                Access Consequence Simulator <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ── SECTION 6: SOP & RESOURCES DIRECTORY ── */}
      <section className="py-24 bg-[#0B111E] border-b border-[#2E3A4E]">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-mono text-[#C5A880] uppercase tracking-widest font-bold">Authoritative Manuals</span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#E2E8F0]">
              Emergency Standard Operating Procedures
            </h2>
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              Instant access to official disaster action guides, checklists, and manuals aligned to regional guidelines.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {DEMO_RESOURCE_DOCUMENTS.slice(0, 3).map((doc) => (
              <div key={doc.id} className="bg-[#151D2A] border border-[#2E3A4E] p-6 rounded-xs space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[9px] font-mono text-[#94A3B8] uppercase">
                    <span>{doc.author_organization}</span>
                    <span className="px-1.5 py-0.5 bg-[#C5A880]/15 text-[#C5A880] rounded-xs font-bold">{doc.type}</span>
                  </div>
                  <h4 className="font-editorial text-base text-[#E2E8F0] font-semibold line-clamp-2">{doc.title}</h4>
                  <p className="text-xs text-[#94A3B8] leading-relaxed line-clamp-3">{doc.description}</p>
                </div>
                
                <div className="pt-4 border-t border-[#2E3A4E]/60 flex justify-between items-center">
                  <span className="text-[10px] font-mono text-[#94A3B8] uppercase">Format: {doc.file_format}</span>
                  <Link 
                    href="/login" 
                    className="text-xs font-mono uppercase text-[#C5A880] hover:text-[#D4B992] flex items-center gap-1.5"
                  >
                    Download <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-[#0B111E] py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-xs font-mono text-[#94A3B8]">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-[#C5A880]" />
            <span className="font-bold text-[#E2E8F0]">ActionLens Disaster Intelligence Grid</span>
          </div>
          <div className="text-center md:text-left">
            <span>Contact: maajolawasanjo@gmail.com | +2348105510626</span>
          </div>
          <div className="flex justify-center md:justify-end gap-6">
            <a href="https://www.linkedin.com/in/nathan-ma-ajo" target="_blank" className="hover:text-[#E2E8F0] underline">
              LinkedIn Profile
            </a>
            <a href="https://github.com/Maajolawasanjo/ActionLens-AI.git" target="_blank" className="hover:text-[#E2E8F0] underline">
              GitHub Repository
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
