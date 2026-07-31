"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Layers, MapPin, Hospital, Users, Compass, ShieldAlert, Cpu, CheckCircle } from "lucide-react";
import { DEMO_HOSPITALS, DEMO_EMERGENCY_SHELTERS, DEMO_COMMUNITY_REPORTS } from "@/lib/demoSeedData";

// Dynamically import MapComponent to prevent SSR issues
const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-[#151D2A] border border-[#2E3A4E] rounded-xs flex items-center justify-center">
      <span className="text-xs font-mono text-[#94A3B8] animate-pulse">
        Initializing Spatial Telemetry Grid...
      </span>
    </div>
  ),
});

interface MapTabProps {
  role: string;
}

export default function MapTab({ role }: MapTabProps) {
  // Layer toggles
  const [showFloods, setShowFloods] = useState(true);
  const [showWildfires, setShowWildfires] = useState(true);
  const [showHospitals, setShowHospitals] = useState(true);
  const [showShelters, setShowShelters] = useState(true);
  const [showReports, setShowReports] = useState(true);

  // Selected incident details for drawer
  const [selectedItem, setSelectedItem] = useState<any>({
    id: "garsen_flood",
    title: "Tana River Flood Warning",
    type: "Hazard Zone",
    severity: "critical",
    lat: -1.8845,
    lng: 40.1221,
    description: "Hydrology sensors report 8.4m river discharge, breaching low embankments and threatening local farm pastures.",
    ai_directives: {
      action: "Evacuate lowland herds & dispatch flood barriers to Main Bridge corridor.",
      reasoning: "Satellite telemetry projects another 80mm rainfall in the Upper Basin within 12h.",
      checklist: [
        "Coordinate evacuation buses for Sector B residents",
        "Deploy sandbags to Garsen levee fracture point",
        "Broadcast safety routes warning via localized SMS lists",
      ],
      confidence: 0.98,
      resources: ["Emergency Transit Vehicles", "Sandbag Cache A", "Mobile Satellite Hub"]
    }
  });

  // Construct map markers based on layer filters
  const mapMarkers: any[] = [];

  if (showFloods) {
    mapMarkers.push({
      id: "garsen_flood",
      lat: -1.8845,
      lng: 40.1221,
      title: "Tana River Flood Warning",
      severity: "critical",
      type: "Hazard Zone",
      description: "Hydrology sensors report 8.4m river discharge, breaching low embankments and threatening local farm pastures.",
      ai_directives: {
        action: "Evacuate lowland herds & dispatch flood barriers to Main Bridge corridor.",
        reasoning: "Satellite telemetry projects another 80mm rainfall in the Upper Basin within 12h.",
        checklist: ["Coordinate evacuation buses for Sector B residents", "Deploy sandbags to Garsen levee fracture point", "Broadcast safety routes warning via localized SMS lists"],
        confidence: 0.98,
        resources: ["Emergency Transit Vehicles", "Sandbag Cache A", "Mobile Satellite Hub"]
      }
    });
  }
 
  if (showWildfires) {
    mapMarkers.push({
      id: "table_mountain_fire",
      lat: -33.9249,
      lng: 18.4241,
      title: "Nairobi Forest Dryland Fire Risk",
      severity: "high",
      type: "Dryland Hotspot",
      description: "Dry brush fire accelerated by 40km/h winds approaching suburban buffer zones.",
      ai_directives: {
        action: "Prepare backup water tankers & trigger red flag warning for Cape Town suburbs.",
        reasoning: "Wind vectors project eastward spread over Table Mountain ridge within 3h.",
        checklist: ["Alert volunteer fire squads", "Cordon off mountain access routes", "Pre-stage local clinic burns units"],
        confidence: 0.94,
        resources: ["Phos-Chek Air Tanker", "Water Truck 4", "Red Cross Burn Kits"]
      }
    });
  }

  if (showHospitals) {
    DEMO_HOSPITALS.slice(0, 3).forEach((h) => {
      mapMarkers.push({
        id: h.id,
        lat: h.latitude,
        lng: h.longitude,
        title: h.name,
        severity: "low",
        type: "Hospital",
        description: `Active trauma clinic. Available beds: ${h.icu_beds_available} ICU.`,
        ai_directives: {
          action: "Pre-stage emergency triage tents & alert off-duty ER personnel.",
          reasoning: "Located adjacent to risk corridors, serving as primary receiving facility.",
          checklist: ["Verify ambulance oxygen storage", "Sync ICU availability counter with county command"],
          confidence: 0.91,
          resources: ["Oxygen concentrators", "Burn dressings"]
        }
      });
    });
  }

  if (showShelters) {
    DEMO_EMERGENCY_SHELTERS.slice(0, 3).forEach((s) => {
      mapMarkers.push({
        id: s.id,
        lat: s.latitude,
        lng: s.longitude,
        title: s.name,
        severity: "moderate",
        type: "Relief Shelter",
        description: `Capacity: ${s.capacity} | Current occupancy: ${s.occupancy} (${(s.occupancy / s.capacity * 100).toFixed(0)}%)`,
        ai_directives: {
          action: "Dispatch sanitation support kits & water purifiers to camp coordinator.",
          reasoning: "Rapid influx of evacuated families putting pressure on wastewater grid.",
          checklist: ["Set up auxiliary water filtration tankers", "Audit baby formula & meal reserves"],
          confidence: 0.95,
          resources: ["Water Filtration Unit B", "Food supplies (5 days)"]
        }
      });
    });
  }

  if (showReports) {
    DEMO_COMMUNITY_REPORTS.slice(0, 4).forEach((r) => {
      mapMarkers.push({
        id: r.id,
        lat: r.latitude,
        lng: r.longitude,
        title: `Ground Report: ${r.category.toUpperCase()}`,
        severity: r.severity,
        type: "Ground Report Verification",
        description: r.description,
        ai_directives: {
          action: `Verify field photos: ${r.objects_detected.join(", ")} identified.`,
          reasoning: `Geotagged report verified by Vision AI at ${(r.ai_confidence * 100).toFixed(0)}% confidence.`,
          checklist: ["Cross-verify with nearest telemetry camera", "Alert nearest mobile dispatch squad"],
          confidence: r.ai_confidence,
          resources: ["Vision AI verification log"]
        }
      });
    });
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <span className="text-[10px] font-mono text-[#C5A880] uppercase tracking-widest block font-bold">
          Operations Center Map
        </span>
        <h2 className="font-editorial text-xl sm:text-2xl text-[#E2E8F0] mt-1">
          Anticipatory Risk & Early Warning Map
        </h2>
        <p className="text-xs text-[#94A3B8] font-sans">
          Toggle layers to locate flood boundaries, active dryland fire hotspots, verified ground reports, and response centers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* MAP LAYER CONTROLS (Left side on big screens) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-[#151D2A] border border-[#2E3A4E] p-4 rounded-xs space-y-3">
            <h3 className="text-xs font-mono text-[#C5A880] uppercase tracking-wider font-bold flex items-center gap-2">
              <Layers className="h-4 w-4" /> Toggle Map Layers
            </h3>
            
            <div className="space-y-2.5 text-xs font-mono text-[#94A3B8]">
              <label className="flex items-center gap-2.5 py-1 hover:text-[#E2E8F0] cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={showFloods}
                  onChange={(e) => setShowFloods(e.target.checked)}
                  className="h-3.5 w-3.5 border-[#2E3A4E] text-[#C5A880] rounded-xs accent-[#C5A880]"
                />
                <span>Flood Hazard Zones (ICPAC)</span>
              </label>
              
              <label className="flex items-center gap-2.5 py-1 hover:text-[#E2E8F0] cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={showWildfires}
                  onChange={(e) => setShowWildfires(e.target.checked)}
                  className="h-3.5 w-3.5 border-[#2E3A4E] text-[#C5A880] rounded-xs accent-[#C5A880]"
                />
                <span>Active Dryland Fire Hotspots</span>
              </label>

              <label className="flex items-center gap-2.5 py-1 hover:text-[#E2E8F0] cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={showShelters}
                  onChange={(e) => setShowShelters(e.target.checked)}
                  className="h-3.5 w-3.5 border-[#2E3A4E] text-[#C5A880] rounded-xs accent-[#C5A880]"
                />
                <span>Response Centers</span>
              </label>

              <label className="flex items-center gap-2.5 py-1 hover:text-[#E2E8F0] cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={showHospitals}
                  onChange={(e) => setShowHospitals(e.target.checked)}
                  className="h-3.5 w-3.5 border-[#2E3A4E] text-[#C5A880] rounded-xs accent-[#C5A880]"
                />
                <span>Medical Facilities</span>
              </label>

              <label className="flex items-center gap-2.5 py-1 hover:text-[#E2E8F0] cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={showReports}
                  onChange={(e) => setShowReports(e.target.checked)}
                  className="h-3.5 w-3.5 border-[#2E3A4E] text-[#C5A880] rounded-xs accent-[#C5A880]"
                />
                <span>Ground Reports</span>
              </label>
            </div>
          </div>

          {/* ACTIVE MARKERS INTERACTIVE LIST */}
          <div className="bg-[#151D2A] border border-[#2E3A4E] p-4 rounded-xs space-y-3">
            <h3 className="text-xs font-mono text-[#C5A880] uppercase tracking-wider font-bold">Early Warning & Hazard Registry</h3>
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {mapMarkers.map((marker) => (
                <button
                  key={marker.id}
                  onClick={() => setSelectedItem(marker)}
                  className={`w-full text-left p-2.5 rounded-xs border text-xs font-sans transition-all flex justify-between items-center gap-2 ${
                    selectedItem?.id === marker.id
                      ? "bg-[#0B111E] border-[#C5A880] text-[#E2E8F0]"
                      : "bg-[#0B111E]/40 border-[#2E3A4E]/60 hover:border-[#2E3A4E] text-[#94A3B8]"
                  }`}
                >
                  <div className="truncate">
                    <span className="font-medium block truncate text-xs">{marker.title}</span>
                    <span className="text-[9px] font-mono uppercase text-[#64748B]">{marker.type}</span>
                  </div>
                  <span className={`h-2 w-2 rounded-full shrink-0 ${
                    marker.severity === "critical" ? "bg-[#EF4444]" : marker.severity === "high" ? "bg-[#C1622E]" : "bg-[#2E7D5B]"
                  }`} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* INTERACTIVE MAP CONTAINER */}
        <div className="lg:col-span-9 space-y-6">
          <div className="h-[400px] sm:h-[450px] border border-[#2E3A4E] rounded-xs overflow-hidden shadow-inner relative">
            <MapComponent 
              center={[-1.8845, 40.1221]} 
              zoom={5} 
              markers={mapMarkers} 
            />
          </div>

          {/* CONTEXTUAL AI DIRECTIVES PANEL */}
          {selectedItem && (
            <div className="bg-[#151D2A] border border-[#2E3A4E] p-5 rounded-xs grid grid-cols-1 md:grid-cols-12 gap-6 animate-fadeIn">
              <div className="md:col-span-7 space-y-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] font-mono font-bold bg-[#C5A880]/15 text-[#C5A880] border border-[#C5A880]/30 px-2 py-0.5 rounded-xs">
                    {selectedItem.type.toUpperCase()}
                  </span>
                  <span className="text-xs font-mono text-[#94A3B8]">
                    GPS: {selectedItem.lat.toFixed(4)}, {selectedItem.lng.toFixed(4)}
                  </span>
                </div>
                <h3 className="font-editorial text-lg sm:text-xl text-[#E2E8F0] font-semibold">{selectedItem.title}</h3>
                <p className="text-xs text-[#94A3B8] leading-relaxed font-sans">{selectedItem.description}</p>
              </div>

              {/* DIRECTIVES CHECKLIST DRAWER */}
              <div className="md:col-span-5 bg-[#0B111E] border border-[#2E3A4E] p-4 rounded-xs space-y-3.5">
                <div className="flex justify-between items-center border-b border-[#2E3A4E]/60 pb-2">
                  <span className="font-mono text-[9px] text-[#C5A880] font-bold flex items-center gap-1.5">
                    <Cpu className="h-3.5 w-3.5 text-[#C5A880]" /> AI ANTICIPATORY ACTION DIRECTIVE
                  </span>
                  <span className="font-mono text-[9px] text-[#2E7D5B] font-bold bg-[#2E7D5B]/15 px-2 py-0.5 rounded-xs">
                    {(selectedItem.ai_directives.confidence * 100).toFixed(0)}% Confidence
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="font-mono text-[8px] text-[#94A3B8] uppercase block">Recommended Anticipatory Action</span>
                  <p className="text-xs text-[#E2E8F0] font-sans font-medium">{selectedItem.ai_directives.action}</p>
                </div>

                <div className="space-y-1">
                  <span className="font-mono text-[8px] text-[#94A3B8] uppercase block">Priority Actions Checklist</span>
                  <ul className="space-y-1.5 text-[11px] font-sans text-[#94A3B8]">
                    {selectedItem.ai_directives.checklist.map((task: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="h-3.5 w-3.5 text-[#C5A880] shrink-0 mt-0.5" />
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {selectedItem.ai_directives.resources && (
                  <div className="space-y-1">
                    <span className="font-mono text-[8px] text-[#94A3B8] uppercase block">Resources Required</span>
                    <div className="flex flex-wrap gap-1.5 mt-1 text-[9px] font-mono text-[#E2E8F0]">
                      {selectedItem.ai_directives.resources.map((res: string, i: number) => (
                        <span key={i} className="bg-[#151D2A] border border-[#2E3A4E] px-2 py-0.5 rounded-xs">{res}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
