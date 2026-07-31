"use client";

import { 
  CloudRain, ShieldAlert, Phone, MapPin, Radio, 
  Users, Activity, Clock, FileText, Settings, 
  AlertTriangle, CheckCircle, Database, Sprout, Landmark, HeartPulse
} from "lucide-react";

interface HomeTabProps {
  role: string;
  region?: string;
  country?: string;
  userName?: string;
  onNavigate: (tab: string) => void;
  summaryData?: any;
}

export default function HomeTab({ 
  role, 
  region = "Tana River", 
  country = "Kenya", 
  userName = "Officer", 
  onNavigate,
  summaryData 
}: HomeTabProps) {

  // Current date
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* ── TOP HEADER BLOCK ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#2E3A4E] pb-6 gap-4">
        <div>
          <span className="text-[10px] font-mono text-[#C5A880] uppercase tracking-widest block font-bold">
            Operations Center • Phase 2 Verified
          </span>
          <h1 className="font-editorial text-2xl sm:text-4xl font-normal text-[#E2E8F0] tracking-tight mt-1">
            Welcome, <span className="text-[#C5A880] font-semibold">{userName}</span>
          </h1>
          <p className="text-xs text-[#94A3B8] font-mono mt-1 uppercase tracking-wider">
            Role Profile: {role === "admin" ? "Disaster Operations Center" : role === "government" ? "Government Agency" : role === "responder" ? "Emergency Responder" : role === "ngo" ? "Humanitarian Organization" : "Community Profile"} • {region}, {country}
          </p>
        </div>
        <div className="bg-[#151D2A] border border-[#2E3A4E] py-2.5 px-4 rounded-xs text-right shrink-0">
          <span className="text-[9px] font-mono text-[#94A3B8] block uppercase tracking-wider">Current Node Time</span>
          <span className="text-xs font-mono font-bold text-[#E2E8F0]">{today}</span>
        </div>
      </div>

      {/* ── WIDGETS DYNAMIC RENDER BY ROLE ── */}
      {role === "citizen" && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Main Citizen Alerts */}
          <div className="md:col-span-8 space-y-6">
            <div className="bg-[#151D2A] border border-[#2E3A4E] p-6 rounded-xs relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A880]/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-[#EF4444] animate-pulse" />
                <span className="text-[9px] font-mono text-[#EF4444] uppercase tracking-widest font-bold">Active ICPAC Hazard Watch Alert</span>
              </div>
              <h2 className="font-editorial text-xl sm:text-2xl text-[#E2E8F0] mt-2 font-medium">
                Tana River Flood Warning
              </h2>
              <p className="text-xs text-[#94A3B8] leading-relaxed mt-2 max-w-2xl font-sans">
                River Tana discharge rate continues to hover at 8.4m, breaching safety embankments. Ground reports verify localized crop inundation. Please check safe routing.
              </p>

              <div className="mt-6 flex flex-wrap gap-4">
                <button 
                  onClick={() => onNavigate("community")}
                  className="bg-[#C5A880] hover:bg-[#D4B992] text-[#0B111E] text-[10px] font-bold uppercase tracking-widest py-3 px-6 rounded-xs transition-all cursor-pointer font-mono"
                >
                  Submit Ground Report
                </button>
                <button 
                  onClick={() => onNavigate("map")}
                  className="border border-[#2E3A4E] hover:border-[#C5A880]/60 text-[#E2E8F0] text-[10px] font-bold uppercase tracking-widest py-3 px-6 rounded-xs transition-all bg-[#0B111E]/40 cursor-pointer font-mono"
                >
                  View Operations Map
                </button>
              </div>
            </div>

            {/* Safe Routes & Weather Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-[#151D2A] border border-[#2E3A4E] p-5 rounded-xs space-y-4">
                <h3 className="text-xs font-mono text-[#C5A880] uppercase tracking-wider font-bold">Weather Snapshot</h3>
                <div className="flex items-center gap-4">
                  <CloudRain className="h-10 w-10 text-[#C5A880] shrink-0" />
                  <div>
                    <span className="text-xl font-mono text-[#E2E8F0] block">24°C</span>
                    <span className="text-xs text-[#94A3B8] font-sans">Heavy Precip (120mm/hr)</span>
                  </div>
                </div>
                <p className="text-[11px] text-[#94A3B8] font-sans leading-relaxed">
                  Humidity: 94% • Winds: 18km/h NNE • Forecast: Intense monsoon downpours expected for next 24 hours.
                </p>
              </div>

              <div className="bg-[#151D2A] border border-[#2E3A4E] p-5 rounded-xs space-y-3">
                <h3 className="text-xs font-mono text-[#C5A880] uppercase tracking-wider font-bold">Safe Corridors</h3>
                <div className="space-y-2 text-[11px] font-mono">
                  <div className="flex justify-between items-center py-1.5 border-b border-[#2E3A4E]/60">
                    <span className="text-[#94A3B8]">Tana Bypass Expressway</span>
                    <span className="text-[#2E7D5B] bg-[#2E7D5B]/10 px-2 py-0.5 rounded-xs text-[10px] font-semibold">CLEAR</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-[#2E3A4E]/60">
                    <span className="text-[#94A3B8]">Makoko Access Bridge</span>
                    <span className="text-[#8C2F2F] bg-[#8C2F2F]/10 px-2 py-0.5 rounded-xs text-[10px] font-semibold">INUNDATED</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-[#94A3B8]">Garissa North Corridor</span>
                    <span className="text-[#C1622E] bg-[#C1622E]/10 px-2 py-0.5 rounded-xs text-[10px] font-semibold">WATCH</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Citizen Contacts & AI recommendation */}
          <div className="md:col-span-4 space-y-6">
            <div className="bg-[#151D2A] border border-[#2E3A4E] p-5 rounded-xs space-y-4">
              <h3 className="text-xs font-mono text-[#C5A880] uppercase tracking-wider font-bold">AI Priority Actions</h3>
              <div className="bg-[#0B111E] border border-[#2E3A4E] p-4 rounded-xs text-[11px] font-sans leading-relaxed text-[#E2E8F0]">
                "Hydrology models confirm flood crest arrival at 03:00 UTC. If residing in Sector B floodplains, power down all ground circuits, pack primary medical files, and proceed immediately to the Wadata Relief Hub."
              </div>
              <span className="text-[9px] font-mono text-[#94A3B8] block text-right">Confidence Level: 96%</span>
            </div>

            <div className="bg-[#151D2A] border border-[#2E3A4E] p-5 rounded-xs space-y-3">
              <h3 className="text-xs font-mono text-[#C5A880] uppercase tracking-wider font-bold">Emergency Contacts</h3>
              <div className="space-y-2.5">
                <a href="tel:999" className="flex items-center justify-between p-3 bg-[#0B111E] border border-[#2E3A4E] rounded-xs hover:border-[#C5A880]/60 transition-colors text-xs">
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-[#C5A880]" />
                    <span className="text-[#E2E8F0] font-bold">National Disaster Line</span>
                  </div>
                  <span className="text-[#C5A880] font-mono font-bold">999</span>
                </a>
                <a href="tel:112" className="flex items-center justify-between p-3 bg-[#0B111E] border border-[#2E3A4E] rounded-xs hover:border-[#C5A880]/60 transition-colors text-xs">
                  <div className="flex items-center gap-2">
                    <Landmark className="h-3.5 w-3.5 text-[#C5A880]" />
                    <span className="text-[#E2E8F0] font-bold">Red Cross Disaster Command</span>
                  </div>
                  <span className="text-[#C5A880] font-mono font-bold">112</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {role === "responder" && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Responder Incidents Feed */}
          <div className="md:col-span-8 space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#151D2A] border border-[#2E3A4E] p-5 rounded-xs">
                <span className="text-[9px] font-mono text-[#94A3B8] uppercase block">ACTIVE HAZARD EVENTS</span>
                <span className="text-2xl font-mono font-bold text-[#E2E8F0] mt-1 block">14</span>
              </div>
              <div className="bg-[#151D2A] border border-[#2E3A4E] p-5 rounded-xs">
                <span className="text-[9px] font-mono text-[#94A3B8] uppercase block">RESPONSE TEAMS</span>
                <span className="text-2xl font-mono font-bold text-[#C5A880] mt-1 block">8 / Active</span>
              </div>
              <div className="bg-[#151D2A] border border-[#2E3A4E] p-5 rounded-xs">
                <span className="text-[9px] font-mono text-[#94A3B8] uppercase block">AVG RESPONSE TIME</span>
                <span className="text-2xl font-mono font-bold text-[#2E7D5B] mt-1 block">18 Mins</span>
              </div>
            </div>

            <div className="bg-[#151D2A] border border-[#2E3A4E] p-6 rounded-xs space-y-4">
              <div className="flex justify-between items-center border-b border-[#2E3A4E]/60 pb-3">
                <h3 className="text-xs font-mono text-[#C5A880] uppercase tracking-wider font-bold">Recent Early Warning Dispatches</h3>
                <span className="text-[9px] font-mono text-[#94A3B8]">Updated 1m ago</span>
              </div>

              <div className="space-y-3.5">
                {[
                  { id: "inc_1", desc: "Tana River Flood Warning: 4 stranded vehicles near Garsen basin", severity: "CRITICAL", time: "5 mins ago", squad: "Rescue Crew Alpha" },
                  { id: "inc_2", desc: "Maiduguri River Overflow: approaching critical residential sectors", severity: "HIGH", time: "18 mins ago", squad: "Fire Squad B" },
                  { id: "inc_3", desc: "Kampala Landslide Alert: local sensor threshold breach", severity: "MODERATE", time: "1 hour ago", squad: "Standby Monitor" },
                ].map((inc) => (
                  <div key={inc.id} className="bg-[#0B111E] border border-[#2E3A4E] p-4 rounded-xs flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-mono font-bold py-0.5 px-2 rounded-xs ${inc.severity === "CRITICAL" ? "bg-[#8C2F2F]/20 text-[#EF4444]" : inc.severity === "HIGH" ? "bg-[#C1622E]/20 text-[#E07A5F]" : "bg-[#2E7D5B]/20 text-[#3A86C8]"}`}>
                          {inc.severity}
                        </span>
                        <span className="text-[9px] font-mono text-[#94A3B8]">{inc.time}</span>
                      </div>
                      <p className="text-xs text-[#E2E8F0] font-sans">{inc.desc}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-mono text-[#C5A880] block">{inc.squad}</span>
                      <button 
                        onClick={() => onNavigate("map")} 
                        className="text-[9px] font-mono text-[#94A3B8] hover:text-[#C5A880] underline block mt-1 cursor-pointer"
                      >
                        Locate Hazard Event
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Responder Teams Availability */}
          <div className="md:col-span-4 space-y-6">
            <div className="bg-[#151D2A] border border-[#2E3A4E] p-5 rounded-xs space-y-4">
              <h3 className="text-xs font-mono text-[#C5A880] uppercase tracking-wider font-bold">Crew Deployment State</h3>
              <div className="space-y-3 text-[11px] font-mono">
                <div className="flex justify-between items-center py-1">
                  <span className="text-[#94A3B8]">Water Rescue Team A</span>
                  <span className="text-[#EF4444] font-bold">DISPATCHED</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-[#94A3B8]">Table Mountain Brush Crew</span>
                  <span className="text-[#EF4444] font-bold">DISPATCHED</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-[#94A3B8]">Lagos Medical Triage Unit</span>
                  <span className="text-[#2E7D5B] font-bold">STANDBY</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-[#94A3B8]">Nairobi Helicopter Crew #2</span>
                  <span className="text-[#2E7D5B] font-bold">AVAILABLE</span>
                </div>
              </div>
            </div>

            <div className="bg-[#151D2A] border border-[#2E3A4E] p-5 rounded-xs space-y-3">
              <h3 className="text-xs font-mono text-[#C5A880] uppercase tracking-wider font-bold">Priority Actions Checklist</h3>
              <ul className="space-y-2 text-[11px] font-sans text-[#94A3B8] list-disc list-inside">
                <li>Deploy drone telemetry scans over basin coordinates</li>
                <li>Audit boat reserve gas supply levels</li>
                <li>Distribute satellite radio frequencies to dispatch squads</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {role === "government" && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Government Dashboard */}
          <div className="md:col-span-8 space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#151D2A] border border-[#2E3A4E] p-5 rounded-xs">
                <span className="text-[9px] font-mono text-[#94A3B8] uppercase block">PREPAREDNESS INDEX</span>
                <span className="text-2xl font-mono font-bold text-[#C5A880] mt-1 block">88.4%</span>
              </div>
              <div className="bg-[#151D2A] border border-[#2E3A4E] p-5 rounded-xs">
                <span className="text-[9px] font-mono text-[#94A3B8] uppercase block">ACTIVE EARLY WARNINGS</span>
                <span className="text-2xl font-mono font-bold text-[#E2E8F0] mt-1 block">8</span>
              </div>
              <div className="bg-[#151D2A] border border-[#2E3A4E] p-5 rounded-xs">
                <span className="text-[9px] font-mono text-[#94A3B8] uppercase block">ANTICIPATORY EXPOSURE FORECAST</span>
                <span className="text-xl font-mono font-bold text-[#EF4444] mt-1 block">42,380 Communities</span>
              </div>
            </div>

            <div className="bg-[#151D2A] border border-[#2E3A4E] p-6 rounded-xs space-y-4">
              <h3 className="text-xs font-mono text-[#C5A880] uppercase tracking-wider font-bold">Situation Overview Briefing</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed font-sans">
                Flooding across the coastal lagoons of the Tana River has breached the 8.4m mark. Current consequence simulations forecast a potential casualty baseline of 4,400 lives and crop capital damage totaling $696,000 USD if evacuations are delayed past the 24-hour mark. Emergency funding remains on reserve.
              </p>
              <div className="pt-4 border-t border-[#2E3A4E]/60 flex items-center justify-between gap-4">
                <span className="text-[9px] font-mono text-[#94A3B8]">Generated by ActionLens Decision Engine</span>
                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      const element = document.createElement("a");
                      const file = new Blob(["ActionLens AI Situation Report\n\nGenerated for: Government Stakeholder\nDate: " + today + "\nThreat: Garsen Basin Flood\nActive Alerts: 8\nCasualty projection at 24h delay: 4,400"], {type: 'text/plain'});
                      element.href = URL.createObjectURL(file);
                      element.download = "actionlens_executive_briefing.txt";
                      document.body.appendChild(element);
                      element.click();
                    }}
                    className="bg-[#C5A880] hover:bg-[#D4B992] text-[#0B111E] text-[9px] font-mono font-bold uppercase tracking-wider py-2 px-4 rounded-xs transition-colors cursor-pointer"
                  >
                    Export Situation PDF
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Government Threats Overview */}
          <div className="md:col-span-4 space-y-6">
            <div className="bg-[#151D2A] border border-[#2E3A4E] p-5 rounded-xs space-y-4">
              <h3 className="text-xs font-mono text-[#C5A880] uppercase tracking-wider font-bold">Priority Actions</h3>
              <div className="space-y-3">
                <div className="bg-[#0B111E] p-3 border border-[#2E3A4E] rounded-xs text-[11px] font-sans">
                  <span className="text-[#C5A880] font-bold uppercase block font-mono text-[9px] mb-1">ANTICIPATORY ACTION</span>
                  Authorize instant budget dispatch of Level-2 EOC funds for Garissa sandbagging and bus corridors.
                </div>
                <div className="bg-[#0B111E] p-3 border border-[#2E3A4E] rounded-xs text-[11px] font-sans">
                  <span className="text-[#C5A880] font-bold uppercase block font-mono text-[9px] mb-1">EARLY WARNING PROTOCOLS</span>
                  Publish localized broadcast guidelines regarding high ground assembly coordinates.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {role === "ngo" && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Humanitarian Board */}
          <div className="md:col-span-8 space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#151D2A] border border-[#2E3A4E] p-5 rounded-xs">
                <span className="text-[9px] font-mono text-[#94A3B8] uppercase block">TOTAL CAPACITY</span>
                <span className="text-2xl font-mono font-bold text-[#E2E8F0] mt-1 block">5,500</span>
              </div>
              <div className="bg-[#151D2A] border border-[#2E3A4E] p-5 rounded-xs">
                <span className="text-[9px] font-mono text-[#94A3B8] uppercase block">SHELTER OCCUPANCY</span>
                <span className="text-2xl font-mono font-bold text-[#C5A880] mt-1 block">3,220 (73%)</span>
              </div>
              <div className="bg-[#151D2A] border border-[#2E3A4E] p-5 rounded-xs">
                <span className="text-[9px] font-mono text-[#94A3B8] uppercase block">SUPPLY LEVEL</span>
                <span className="text-2xl font-mono font-bold text-[#2E7D5B] mt-1 block">Optimal (9d)</span>
              </div>
            </div>

            <div className="bg-[#151D2A] border border-[#2E3A4E] p-6 rounded-xs space-y-4">
              <div className="flex justify-between items-center border-b border-[#2E3A4E]/60 pb-3">
                <h3 className="text-xs font-mono text-[#C5A880] uppercase tracking-wider font-bold">Active Response Centers Operations</h3>
                <span className="text-[9px] font-mono text-[#94A3B8]">Capacity Track</span>
              </div>

              <div className="space-y-3 font-mono text-[11px]">
                {[
                  { name: "National Stadium Emergency Hub", city: "Lagos", capacity: 2500, occupancy: 1420, water: "Filter active", food: "Adequate (7d)" },
                  { name: "Abuja International Relief Camp", city: "Abuja", capacity: 1800, occupancy: 650, water: "Trucking active", food: "Adequate (5d)" },
                  { name: "Makurdi Riverine Transit Center", city: "Makurdi", capacity: 1200, occupancy: 1150, water: "Critical", food: "Critical (2d)" },
                ].map((s, idx) => (
                  <div key={idx} className="bg-[#0B111E] border border-[#2E3A4E] p-4 rounded-xs flex justify-between items-center gap-4">
                    <div>
                      <span className="text-[#E2E8F0] font-bold block">{s.name}</span>
                      <span className="text-[#94A3B8] text-[10px]">Location: {s.city} • Capacity: {s.capacity}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[#C5A880] block font-bold">Occupancy: {s.occupancy}</span>
                      <span className="text-[9px] text-[#94A3B8]">Water: {s.water} | Food: {s.food}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Humanitarian Coordination */}
          <div className="md:col-span-4 space-y-6">
            <div className="bg-[#151D2A] border border-[#2E3A4E] p-5 rounded-xs space-y-4">
              <h3 className="text-xs font-mono text-[#C5A880] uppercase tracking-wider font-bold">Response Resources Log</h3>
              <div className="space-y-3 text-[11px] font-sans text-[#94A3B8]">
                <div className="bg-[#0B111E] p-3 border border-[#2E3A4E] rounded-xs">
                  <span className="font-bold text-[#E2E8F0] block mb-1">Makurdi Hub Food Ration Supply</span>
                  Requires urgent transport dispatch. Water purification kits are at critical levels.
                </div>
                <div className="bg-[#0B111E] p-3 border border-[#2E3A4E] rounded-xs">
                  <span className="font-bold text-[#E2E8F0] block mb-1">Volunteer Placement</span>
                  Coordinate 45 Red Cross field responders to Garissa shelter grids.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {role === "admin" && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Admin Home Dashboard */}
          <div className="md:col-span-8 space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#151D2A] border border-[#2E3A4E] p-5 rounded-xs">
                <span className="text-[9px] font-mono text-[#94A3B8] uppercase block">SERVER STATUS</span>
                <span className="text-2xl font-mono font-bold text-[#2E7D5B] mt-1 block">99.98%</span>
              </div>
              <div className="bg-[#151D2A] border border-[#2E3A4E] p-5 rounded-xs">
                <span className="text-[9px] font-mono text-[#94A3B8] uppercase block">TOKEN COST TODAY</span>
                <span className="text-2xl font-mono font-bold text-[#C5A880] mt-1 block">$14.62</span>
              </div>
              <div className="bg-[#151D2A] border border-[#2E3A4E] p-5 rounded-xs">
                <span className="text-[9px] font-mono text-[#94A3B8] uppercase block">ACTIVE USERS</span>
                <span className="text-2xl font-mono font-bold text-[#E2E8F0] mt-1 block">152 / Node</span>
              </div>
            </div>

            <div className="bg-[#151D2A] border border-[#2E3A4E] p-6 rounded-xs space-y-4">
              <div className="flex justify-between items-center border-b border-[#2E3A4E]/60 pb-3">
                <h3 className="text-xs font-mono text-[#C5A880] uppercase tracking-wider font-bold">System Health Logs</h3>
                <span className="text-[9px] font-mono text-[#2E7D5B] font-bold">ONLINE</span>
              </div>

              <div className="space-y-2.5 font-mono text-[10px] text-[#94A3B8]">
                <div className="p-2.5 bg-[#0B111E] rounded-xs border border-[#2E3A4E] flex justify-between">
                  <span>[INFO] 10:48:12 - FastAPI Vector Embeddings Pipeline Sync complete.</span>
                  <span className="text-[#2E7D5B]">0.08s</span>
                </div>
                <div className="p-2.5 bg-[#0B111E] rounded-xs border border-[#2E3A4E] flex justify-between">
                  <span>[INFO] 10:47:04 - Vision AI classification report verification call resolved.</span>
                  <span className="text-[#2E7D5B]">0.41s</span>
                </div>
                <div className="p-2.5 bg-[#0B111E] rounded-xs border border-[#2E3A4E] flex justify-between">
                  <span>[WARN] 10:41:22 - Supabase RPC database query fallback triggered.</span>
                  <span className="text-[#C1622E]">1.12s</span>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Actions */}
          <div className="md:col-span-4 space-y-6">
            <div className="bg-[#151D2A] border border-[#2E3A4E] p-5 rounded-xs space-y-4">
              <h3 className="text-xs font-mono text-[#C5A880] uppercase tracking-wider font-bold">Quick Configurations</h3>
              <div className="space-y-2 text-[11px] font-mono">
                <button 
                  onClick={() => onNavigate("settings")}
                  className="w-full text-left p-3 bg-[#0B111E] border border-[#2E3A4E] hover:border-[#C5A880]/60 rounded-xs transition-colors flex justify-between text-[#E2E8F0]"
                >
                  <span>Manage System Keys</span>
                  <span>→</span>
                </button>
                <button 
                  onClick={() => onNavigate("settings")}
                  className="w-full text-left p-3 bg-[#0B111E] border border-[#2E3A4E] hover:border-[#C5A880]/60 rounded-xs transition-colors flex justify-between text-[#E2E8F0]"
                >
                  <span>Flush RAG Cache</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
