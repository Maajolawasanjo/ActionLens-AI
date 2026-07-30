"use client";

import Link from "next/link";
import { 
  Shield, ArrowRight, Radio, Brain, Users, MapPin, 
  BarChart3, AlertTriangle, Globe2, Clock, Landmark,
  HeartPulse, Sprout, ShieldAlert, Cpu, Database, Network
} from "lucide-react";

export default function MarketingLandingPage() {
  return (
    <div className="min-h-screen bg-[#0B111E] text-[#E2E8F0] flex flex-col selection:bg-[#C5A880]/30 selection:text-[#C5A880] font-sans">
      
      {/* ── HEADER NAVIGATION ── */}
      <header className="w-full border-b border-[#2E3A4E] bg-[#0B111E]/85 backdrop-blur-md sticky top-0 z-50">
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

          <div className="flex items-center gap-6">
            <Link
              href="/login"
              className="text-xs font-mono uppercase tracking-wider text-[#94A3B8] hover:text-[#E2E8F0] transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="text-xs font-mono uppercase tracking-wider text-[#0B111E] bg-[#C5A880] hover:bg-[#D4B992] transition-colors py-2.5 px-5 rounded-xs font-bold shadow-md shadow-[#C5A880]/5"
            >
              Initialize Console
            </Link>
          </div>
        </div>
      </header>

      {/* ── SECTION 1: HERO & COMMAND GATEWAY ── */}
      <section className="relative min-h-[85vh] flex flex-col justify-center border-b border-[#2E3A4E] py-20 bg-[radial-gradient(ellipse_at_top_right,#1C2638_0%,#0B111E_70%)]">
        <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#C5A880]/10 border border-[#C5A880]/30 rounded-xs">
                <Radio className="h-3 w-3 text-[#C5A880] animate-pulse" />
                <span className="text-[9px] font-mono text-[#C5A880] uppercase tracking-widest font-bold">
                  Climate Resilience & Tactical Dispatch System
                </span>
              </div>
              <h1 className="font-editorial text-4xl sm:text-6xl font-normal leading-[1.05] tracking-tight text-[#E2E8F0]">
                Smarter Early Warning, <br />
                <span className="text-[#C5A880] font-bold">Stronger Communities.</span>
              </h1>
              <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed max-w-2xl font-normal font-sans">
                ActionLens AI bridges the gap between complex climate predictions and immediate community actions. We ingest environmental telemetry feeds and convert them into clear, role-specific checklists to safeguard lives before hazard impacts occur.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-3 px-8 py-4 bg-[#C5A880] hover:bg-[#D4B992] text-[#0B111E] text-xs font-bold uppercase tracking-widest rounded-xs transition-all shadow-lg"
              >
                <span>Initialize Console Account</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-3 px-8 py-4 border border-[#2E3A4E] hover:border-[#C5A880]/60 text-[#E2E8F0] text-xs font-bold uppercase tracking-widest rounded-xs transition-all bg-[#151D2A]/40"
              >
                <span>Sign In to Mission Control</span>
              </Link>
            </div>

            {/* High-status regional metrics */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-[#2E3A4E]/60 max-w-lg">
              <div>
                <span className="text-[10px] font-mono text-[#94A3B8] uppercase block tracking-wider">Citizens Protected</span>
                <span className="text-2xl font-editorial font-bold text-[#E2E8F0] tabular-nums mt-1">42,380+</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#94A3B8] uppercase block tracking-wider">Warning Precision</span>
                <span className="text-2xl font-editorial font-bold text-[#E2E8F0] tabular-nums mt-1">94.6%</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#94A3B8] uppercase block tracking-wider">Telemetry Feeds</span>
                <span className="text-2xl font-editorial font-bold text-[#E2E8F0] tabular-nums mt-1">128 / Active</span>
              </div>
            </div>
          </div>

          {/* Right Visual Console Graphic */}
          <div className="lg:col-span-5 bg-[#151D2A] border border-[#2E3A4E] p-6 sm:p-8 rounded-xs space-y-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 h-40 w-40 bg-[#C5A880]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="flex justify-between items-center border-b border-[#2E3A4E]/60 pb-3">
              <span className="text-[10px] font-mono text-[#C5A880] uppercase tracking-wider font-bold">SYSTEM TELEMETRY CORE</span>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#2E7D5B] animate-pulse" />
                <span className="text-[8px] font-mono text-[#2E7D5B]">LIVE SYNCED</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-mono text-[#94A3B8]">
                  <span>RIVER TANA DISCHARGE RATE</span>
                  <span className="text-[#8C2F2F] font-bold">8.4m [CRITICAL]</span>
                </div>
                <div className="w-full bg-[#0B111E] h-1.5 rounded-xs overflow-hidden">
                  <div className="bg-[#8C2F2F] h-full w-[85%]" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-mono text-[#94A3B8]">
                  <span>GARISSA DROUGHT INDEX</span>
                  <span className="text-[#C1622E] font-bold">0.64 [HIGH ALERT]</span>
                </div>
                <div className="w-full bg-[#0B111E] h-1.5 rounded-xs overflow-hidden">
                  <div className="bg-[#C1622E] h-full w-[64%]" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-mono text-[#94A3B8]">
                  <span>AI VERIFICATION CONFIDENCE</span>
                  <span className="text-[#2E7D5B] font-bold">96% [HIGH TRUST]</span>
                </div>
                <div className="w-full bg-[#0B111E] h-1.5 rounded-xs overflow-hidden">
                  <div className="bg-[#2E7D5B] h-full w-[96%]" />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#2E3A4E]/60 text-center">
              <span className="text-[10px] font-mono text-[#94A3B8]">
                Access dashboard console to view full GIS maps and coordinate telemetry.
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* ── SECTION 2: THE CRISIS COMMUNICATION GAP (THE PROBLEM) ── */}
      <section className="py-24 bg-[#0B111E] border-b border-[#2E3A4E]">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <span className="text-xs font-mono text-[#C5A880] uppercase tracking-widest font-bold">The Core Challenge</span>
          <h2 className="font-editorial text-3xl sm:text-5xl font-normal text-[#E2E8F0] tracking-tight leading-tight">
            Traditional warnings create alerts. <br />
            We create <span className="text-[#C5A880] font-bold">decisions.</span>
          </h2>
          <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed max-w-2xl mx-auto">
            Disaster response fails not because of a lack of climate data, but due to <strong>Action Paralysis</strong>. Knowing a flood is coming is only half the battle. Responders, local leaders, and citizens need to know exactly what steps to execute in the crucial 72-hour window before impact.
          </p>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#C5A880] uppercase tracking-widest border border-[#C5A880]/30 py-2 px-4 bg-[#C5A880]/5">
            <ShieldAlert className="h-4 w-4" />
            <span>Eliminating Uncertainty In Crisis Response</span>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: HOW IT WORKS (THE CORE LOOP) ── */}
      <section className="py-24 bg-[#111827] border-b border-[#2E3A4E]">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-xs font-mono text-[#C5A880] uppercase tracking-widest font-bold">System Workflow</span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#E2E8F0]">
              The Three pillars of Disaster Resilience
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                step: "01", 
                title: "Data Ingestion & Synthesis", 
                desc: "We aggregate multi-source sensor networks: ICPAC hydrological registers, remote meteorological maps, and real-time geotagged reports uploaded directly by citizens in the field." 
              },
              { 
                step: "02", 
                title: "Impact Consequence Modeling", 
                desc: "The database models incoming telemetry coordinates to identify flood exposure vectors and predict population displacement and local asset damages under various evacuation delay assumptions." 
              },
              { 
                step: "03", 
                title: "Tailored Tactical Dispatch", 
                desc: "RAG AI engines consult standard operating procedures to output personalized action checklists based on user profile roles. Directives are distributed instantly." 
              }
            ].map((p, i) => (
              <div key={i} className="bg-[#151D2A] border border-[#2E3A4E] p-8 rounded-xs space-y-4 relative group">
                <span className="font-editorial text-4xl font-bold text-[#C5A880]/20 group-hover:text-[#C5A880]/40 transition-colors block">
                  {p.step}
                </span>
                <h3 className="font-editorial text-xl text-[#E2E8F0] font-semibold">{p.title}</h3>
                <p className="text-xs text-[#94A3B8] leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: VULNERABILITY INDEXING & SIMULATOR ── */}
      <section className="py-24 bg-[#0B111E] border-b border-[#2E3A4E]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-mono text-[#C5A880] uppercase tracking-widest font-bold">Decision Intelligence</span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#E2E8F0]">
              Pre-Disaster Consequence Simulator
            </h2>
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              ActionLens introduces predictive risk simulation modeling. Operational managers can slide evacuation notification timelines (from immediate alert to 72-hour delay) to view projected casualties, displacement, and financial losses dynamically. 
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-[#C5A880]/10 flex items-center justify-center border border-[#C5A880]/30">
                  <BarChart3 className="h-3 w-3 text-[#C5A880]" />
                </div>
                <span className="text-xs font-mono text-[#E2E8F0] uppercase tracking-wider font-semibold">Vulnerability Index Overlays</span>
              </div>
              <p className="text-xs text-[#94A3B8] leading-relaxed pl-9">
                Assess socio-economic indicators, agricultural drought stress indices, and waterborne disease outbreaks mapped side-by-side with telemetry readings.
              </p>
            </div>
          </div>

          {/* Simulator Visual Mockup */}
          <div className="lg:col-span-7 bg-[#151D2A] border border-[#2E3A4E] p-6 sm:p-8 rounded-xs space-y-6 shadow-xl">
            <div className="flex justify-between items-center border-b border-[#2E3A4E]/60 pb-3">
              <span className="text-xs font-mono text-[#C5A880] uppercase tracking-widest font-bold">Simulator Preview</span>
              <span className="text-[10px] font-mono text-[#94A3B8] uppercase">Horizon: 72 Hours</span>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#94A3B8]">Evacuation Delay Timeline</span>
                <span className="text-[#C5A880] font-bold">24h Delay (Watch)</span>
              </div>
              <div className="h-1 bg-[#0B111E] rounded-full relative">
                <div className="absolute left-0 top-0 h-full bg-[#C5A880] w-1/3" />
                <div className="absolute left-1/3 -top-1.5 h-4 w-4 bg-[#C5A880] border-2 border-[#151D2A] rounded-full cursor-pointer shadow" />
              </div>
              <div className="flex justify-between text-[9px] font-mono text-[#94A3B8]">
                <span>0h (Immediate)</span>
                <span>24h (Watch)</span>
                <span>48h (Alert)</span>
                <span>72h (Severe)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#2E3A4E]/60">
              <div>
                <span className="text-[9px] font-mono text-[#94A3B8] uppercase block">PROJECTED CASUALTIES</span>
                <span className="text-xl font-mono font-bold text-[#EF4444]">4,400 People</span>
              </div>
              <div>
                <span className="text-[9px] font-mono text-[#94A3B8] uppercase block">PROJECTED LOSSES</span>
                <span className="text-xl font-mono font-bold text-[#E2E8F0]">$696,000 USD</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── SECTION 5: THE SIX STAKEHOLDER ECOSYSTEM ── */}
      <section className="py-24 bg-[#111827] border-b border-[#2E3A4E]">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-mono text-[#C5A880] uppercase tracking-widest font-bold">User Segmentation</span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#E2E8F0]">
              Six Perspectives. One Unified Response.
            </h2>
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              We divide information based on operational capabilities. When you create an account, you select your role to receive matching checklists:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                role: "Government Official", 
                icon: Landmark, 
                desc: "Authorize emergency funding, declare disaster zones, and coordinate high-level evacuation policies across counties." 
              },
              { 
                role: "NGO Humanitarian Lead", 
                icon: Globe2, 
                desc: "Coordinate distribution centers, dispatch emergency rations, and organize local rescue shelter logistics." 
              },
              { 
                role: "Emergency Responder", 
                icon: Shield, 
                desc: "Execute search & rescue operations, secure communication grids, and manage medical field triage camps." 
              },
              { 
                role: "Agro-Agent / Farmer", 
                icon: Sprout, 
                desc: "Evacuate livestock along forecasted flood plains, secure seed storage, and schedule harvest windows." 
              },
              { 
                role: "Public Health Lead", 
                icon: HeartPulse, 
                desc: "Monitor post-disaster vector epidemics, deploy cholera vaccines, and distribute hygiene supplies." 
              },
              { 
                role: "Citizen / Resident", 
                icon: Users, 
                desc: "Access localized safety maps, receive urgent notifications, and submit field reports (geotagged reports)." 
              }
            ].map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div key={idx} className="bg-[#151D2A] border border-[#2E3A4E] p-6 rounded-xs hover:border-[#C5A880]/60 transition-colors group">
                  <div className="h-10 w-10 bg-[#C5A880]/10 border border-[#C5A880]/30 rounded-xs flex items-center justify-center text-[#C5A880] group-hover:bg-[#C5A880] group-hover:text-[#0B111E] transition-all">
                    <IconComp className="h-5 w-5" />
                  </div>
                  <h3 className="font-editorial text-lg text-[#E2E8F0] mt-4 font-semibold">{item.role}</h3>
                  <p className="text-xs text-[#94A3B8] leading-relaxed mt-2">{item.desc}</p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ── SECTION 6: SYSTEM INTEGRITY & ARCHITECTURE ── */}
      <section className="py-24 bg-[#0B111E] border-b border-[#2E3A4E]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-mono text-[#C5A880] uppercase tracking-widest font-bold">Under The Hood</span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#E2E8F0]">
              Built for high-stakes, low-bandwidth operational environments
            </h2>
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              When disaster strikes, communications and power systems fail. ActionLens AI is engineered to operate under constrained environments, prioritizing minimal data payloads, lightning-fast GIS indexing, and instant database alerts.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Cpu className="h-5 w-5 text-[#C5A880] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-mono text-[#E2E8F0] uppercase font-bold">FastAPI RAG Backend</h4>
                  <p className="text-[11px] text-[#94A3B8] mt-1 leading-relaxed">High-performance async Python parsing climate records and policies.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Database className="h-5 w-5 text-[#C5A880] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-mono text-[#E2E8F0] uppercase font-bold">PostGIS & GIST Spatial</h4>
                  <p className="text-[11px] text-[#94A3B8] mt-1 leading-relaxed">Geospatial queries targeting proximity radius and hazard boundaries.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Network className="h-5 w-5 text-[#C5A880] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-mono text-[#E2E8F0] uppercase font-bold">Supabase Realtime</h4>
                  <p className="text-[11px] text-[#94A3B8] mt-1 leading-relaxed">Instantly broadcasts warnings and community uploads without refreshing.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-[#C5A880] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-mono text-[#E2E8F0] uppercase font-bold">Civic Cryptography</h4>
                  <p className="text-[11px] text-[#94A3B8] mt-1 leading-relaxed">Roles are verified through database triggers and row-level security (RLS).</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-[#151D2A] border border-[#2E3A4E] p-8 rounded-xs space-y-4">
            <h3 className="font-editorial text-xl text-[#E2E8F0] border-b border-[#2E3A4E]/60 pb-3">Technical Stack Credentials</h3>
            
            <div className="space-y-3 font-mono text-xs text-[#94A3B8]">
              <div className="flex justify-between">
                <span>UI Framework:</span>
                <span className="text-[#E2E8F0]">Next.js 16 (React 19)</span>
              </div>
              <div className="flex justify-between">
                <span>Design Engine:</span>
                <span className="text-[#E2E8F0]">Tailwind CSS 4</span>
              </div>
              <div className="flex justify-between">
                <span>Data Storage & Auth:</span>
                <span className="text-[#E2E8F0]">Supabase PostgreSQL</span>
              </div>
              <div className="flex justify-between">
                <span>Mapping Service:</span>
                <span className="text-[#E2E8F0]">Leaflet Spatial Engine</span>
              </div>
              <div className="flex justify-between">
                <span>AI processing:</span>
                <span className="text-[#E2E8F0]">Async RAG pipeline (FastAPI + OpenAI)</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── SECTION 7: EDITORIAL CALL TO ACTION ── */}
      <section className="py-24 bg-[#111827] text-center border-b border-[#2E3A4E] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1C2638_0%,#111827_70%)] pointer-events-none" />
        <div className="max-w-3xl mx-auto px-6 space-y-8 relative z-10">
          <span className="text-xs font-mono text-[#C5A880] uppercase tracking-widest font-bold">Secure Credentials</span>
          <h2 className="font-editorial text-4xl sm:text-5xl font-normal text-[#E2E8F0] tracking-tight leading-tight">
            Begin Coordinated Response Operations
          </h2>
          <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed max-w-xl mx-auto">
            Initialize your role-based profile today to explore the early warning dashboards, map GIS overlays, and test the consequence simulator.
          </p>
          <div className="pt-2">
            <Link
              href="/register"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#C5A880] hover:bg-[#D4B992] text-[#0B111E] text-xs font-bold uppercase tracking-widest rounded-xs transition-all shadow-lg shadow-[#C5A880]/5"
            >
              <span>Initialize Stakeholder Console</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── PREMIUM MULTI-COLUMN FOOTER ── */}
      <footer className="bg-[#0B111E] border-t border-[#2E3A4E] pt-16 pb-8 text-xs font-mono text-[#94A3B8]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-[#2E3A4E]/60">
          
          {/* Col 1: Brand & Status */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <Shield className="h-5 w-5 text-[#C5A880]" />
              <span className="font-editorial text-lg text-[#E2E8F0] font-bold">ActionLens AI</span>
            </div>
            <p className="text-[11px] leading-relaxed max-w-xs font-sans">
              State-of-the-art climate warning, spatial telemetry mapping, and RAG action intelligence for the East Africa IGAD region.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#2E7D5B] animate-pulse" />
              <span className="text-[9px] uppercase font-bold tracking-wider text-[#2E7D5B]">All services operational</span>
            </div>
          </div>

          {/* Col 2: Console Portals */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-[10px] font-bold text-[#E2E8F0] uppercase tracking-wider">Console Portals</h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <Link href="/login" className="hover:text-[#E2E8F0] transition-colors">Stakeholder Sign In</Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-[#E2E8F0] transition-colors">Register Profile</Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-[#E2E8F0] transition-colors">Regional Dashboard</Link>
              </li>
              <li>
                <Link href="/forgot-password" className="hover:text-[#E2E8F0] transition-colors">Reset Credentials</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Regional Agencies */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-[10px] font-bold text-[#E2E8F0] uppercase tracking-wider">Data Integration Partners</h4>
            <ul className="space-y-2 text-[11px] font-sans">
              <li>
                <a href="https://www.icpac.net" target="_blank" rel="noopener noreferrer" className="hover:text-[#E2E8F0] transition-colors">ICPAC Climate Prediction</a>
              </li>
              <li>
                <a href="https://www.ndma.go.ke" target="_blank" rel="noopener noreferrer" className="hover:text-[#E2E8F0] transition-colors">NDMA Kenya</a>
              </li>
              <li>
                <a href="https://nimet.gov.ng" target="_blank" rel="noopener noreferrer" className="hover:text-[#E2E8F0] transition-colors">NiMet Nigeria Meteorological</a>
              </li>
              <li>
                <a href="https://igad.int" target="_blank" rel="noopener noreferrer" className="hover:text-[#E2E8F0] transition-colors">IGAD Secretariat</a>
              </li>
            </ul>
          </div>

          {/* Col 4: Developer Node & Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-[10px] font-bold text-[#E2E8F0] uppercase tracking-wider">Developer Contacts</h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <span>Email: maajolawasanjo@gmail.com</span>
              </li>
              <li>
                <span>WhatsApp: +2348105510626</span>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/nathan-ma-ajo" target="_blank" rel="noopener noreferrer" className="hover:text-[#E2E8F0] underline">
                  LinkedIn Profile
                </a>
              </li>
              <li>
                <a href="https://github.com/Maajolawasanjo/ActionLens-AI.git" target="_blank" rel="noopener noreferrer" className="hover:text-[#E2E8F0] underline">
                  GitHub Repository
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright segment */}
        <div className="max-w-7xl mx-auto px-6 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[#64748B] text-[10px]">
          <span>© 2026 ActionLens AI. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#94A3B8]">Terms of Service</a>
            <a href="#" className="hover:text-[#94A3B8]">Privacy Policy</a>
            <a href="#" className="hover:text-[#94A3B8]">Security Standards</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
