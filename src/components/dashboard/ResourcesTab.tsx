"use client";

import { useState } from "react";
import { Search, MapPin, Phone, Hospital, ShieldAlert, Users, Compass, Globe } from "lucide-react";
import { DEMO_HOSPITALS, DEMO_EMERGENCY_SHELTERS, DEMO_RESOURCE_DOCUMENTS } from "@/lib/demoSeedData";

interface ResourcesTabProps {
  role: string;
}

export default function ResourcesTab({ role }: ResourcesTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "hospital" | "shelter" | "sop">("all");

  const normalizedSearch = searchQuery.toLowerCase().trim();

  // Filter hospitals
  const hospitals = DEMO_HOSPITALS.filter(h => {
    if (filterType !== "all" && filterType !== "hospital") return false;
    return h.name.toLowerCase().includes(normalizedSearch) || h.city.toLowerCase().includes(normalizedSearch);
  });

  // Filter shelters
  const shelters = DEMO_EMERGENCY_SHELTERS.filter(s => {
    if (filterType !== "all" && filterType !== "shelter") return false;
    return s.name.toLowerCase().includes(normalizedSearch) || s.city.toLowerCase().includes(normalizedSearch);
  });

  // Filter documents
  const docs = DEMO_RESOURCE_DOCUMENTS.filter(d => {
    if (filterType !== "all" && filterType !== "sop") return false;
    return d.title.toLowerCase().includes(normalizedSearch) || d.category.toLowerCase().includes(normalizedSearch);
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <span className="text-[10px] font-mono text-[#C5A880] uppercase tracking-widest block font-bold">
          Crisis Resources Directory
        </span>
        <h2 className="font-editorial text-xl sm:text-2xl text-[#E2E8F0] mt-1">
          Hospitals, Shelters & SOPs
        </h2>
        <p className="text-xs text-[#94A3B8] font-sans">
          Search for medical availability, active shelter capacity, and emergency guides.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-[#151D2A] border border-[#2E3A4E] p-4 rounded-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8] pointer-events-none" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#0B111E] border border-[#2E3A4E] text-[#E2E8F0] placeholder:text-[#64748B] text-xs font-sans focus:outline-none focus:border-[#C5A880] rounded-xs"
            placeholder="Search resources by name or location..."
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: "Show All" },
            { id: "hospital", label: "Hospitals" },
            { id: "shelter", label: "Shelters" },
            { id: "sop", label: "SOP Docs" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id as any)}
              className={`px-3 py-1.5 font-mono text-[10px] uppercase font-bold tracking-wider rounded-xs transition-colors cursor-pointer border ${
                filterType === tab.id
                  ? "bg-[#C5A880] text-[#0B111E] border-[#C5A880]"
                  : "border-[#2E3A4E] hover:border-[#C5A880]/60 text-[#94A3B8] hover:text-[#E2E8F0]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* List Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* HOSPITALS GRID */}
        {hospitals.length > 0 && (
          <div className="space-y-4 md:col-span-2">
            <h3 className="text-xs font-mono text-[#C5A880] uppercase tracking-wider font-bold flex items-center gap-2">
              <Hospital className="h-4 w-4" /> Hospitals ({hospitals.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {hospitals.map((h) => (
                <div key={h.id} className="bg-[#151D2A] border border-[#2E3A4E] p-5 rounded-xs space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className="font-editorial text-base text-[#E2E8F0] font-medium">{h.name}</h4>
                      <p className="text-[11px] text-[#94A3B8] font-mono mt-0.5">{h.city}, {h.country}</p>
                    </div>
                    <span className="text-[9px] font-mono font-bold bg-[#2E7D5B]/20 text-[#2E7D5B] py-0.5 px-2 rounded-xs shrink-0">
                      {h.trauma_center_level}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-[11px] font-mono pt-3 border-t border-[#2E3A4E]/40">
                    <div>
                      <span className="text-[#64748B] block uppercase text-[9px]">ICU Beds Availability</span>
                      <span className="text-[#E2E8F0] font-bold">{h.icu_beds_available} / {h.icu_beds_total} Available</span>
                    </div>
                    <div>
                      <span className="text-[#64748B] block uppercase text-[9px]">Current Occupancy</span>
                      <span className="text-[#E2E8F0] font-bold">{h.current_occupancy_pct}%</span>
                    </div>
                    <div>
                      <span className="text-[#64748B] block uppercase text-[9px]">Doctors On Duty</span>
                      <span className="text-[#E2E8F0] font-bold">{h.doctors_on_duty} Active</span>
                    </div>
                    <div>
                      <span className="text-[#64748B] block uppercase text-[9px]">Ambulance fleet</span>
                      <span className="text-[#E2E8F0] font-bold">{h.ambulances_active} Online</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-mono pt-1 text-[#94A3B8]">
                    <span>📞 {h.contact}</span>
                    <span>📍 Lat: {h.latitude.toFixed(4)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SHELTERS GRID */}
        {shelters.length > 0 && (
          <div className="space-y-4 md:col-span-2 pt-4">
            <h3 className="text-xs font-mono text-[#C5A880] uppercase tracking-wider font-bold flex items-center gap-2">
              <Users className="h-4 w-4" /> Emergency Shelters ({shelters.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {shelters.map((s) => (
                <div key={s.id} className="bg-[#151D2A] border border-[#2E3A4E] p-5 rounded-xs space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className="font-editorial text-base text-[#E2E8F0] font-medium">{s.name}</h4>
                      <p className="text-[11px] text-[#94A3B8] font-mono mt-0.5">{s.city}, {s.country}</p>
                    </div>
                    <span className={`text-[9px] font-mono font-bold py-0.5 px-2 rounded-xs shrink-0 ${
                      (s.capacity - s.occupancy) < 100 ? "bg-[#8C2F2F]/20 text-[#EF4444]" : "bg-[#2E7D5B]/20 text-[#2E7D5B]"
                    }`}>
                      {s.capacity - s.occupancy < 100 ? "CRITICAL CAPACITY" : "AVAILABLE SPACE"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-[11px] font-mono pt-3 border-t border-[#2E3A4E]/40">
                    <div>
                      <span className="text-[#64748B] block uppercase text-[9px]">Total capacity</span>
                      <span className="text-[#E2E8F0] font-bold">{s.capacity} Max</span>
                    </div>
                    <div>
                      <span className="text-[#64748B] block uppercase text-[9px]">Shelter Occupancy</span>
                      <span className="text-[#E2E8F0] font-bold">{s.occupancy} Displaced</span>
                    </div>
                    <div>
                      <span className="text-[#64748B] block uppercase text-[9px]">Ration reserves</span>
                      <span className="text-[#E2E8F0] font-bold">{s.food_supplies}</span>
                    </div>
                    <div>
                      <span className="text-[#64748B] block uppercase text-[9px]">Water status</span>
                      <span className="text-[#E2E8F0] font-bold truncate">{s.water_status}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 text-[8px] font-mono">
                    <span className={`px-2 py-0.5 rounded-xs ${s.medical_staff_present ? "bg-[#2E7D5B]/15 text-[#2E7D5B]" : "bg-[#2E3A4E] text-[#94A3B8]"}`}>MEDICAL TEAM</span>
                    <span className={`px-2 py-0.5 rounded-xs ${s.generator_backup ? "bg-[#2E7D5B]/15 text-[#2E7D5B]" : "bg-[#2E3A4E] text-[#94A3B8]"}`}>GENERATOR</span>
                    <span className={`px-2 py-0.5 rounded-xs ${s.wheelchair_access ? "bg-[#2E7D5B]/15 text-[#2E7D5B]" : "bg-[#2E3A4E] text-[#94A3B8]"}`}>ACCESSIBLE</span>
                    <span className={`px-2 py-0.5 rounded-xs ${s.pet_friendly ? "bg-[#2E7D5B]/15 text-[#2E7D5B]" : "bg-[#2E3A4E] text-[#94A3B8]"}`}>PET FRIENDLY</span>
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-mono pt-1 text-[#94A3B8] border-t border-[#2E3A4E]/30">
                    <span>📞 {s.contact}</span>
                    <span>📍 Lat: {s.latitude.toFixed(4)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DOCUMENTS GRID */}
        {docs.length > 0 && (
          <div className="space-y-4 md:col-span-2 pt-4">
            <h3 className="text-xs font-mono text-[#C5A880] uppercase tracking-wider font-bold flex items-center gap-2">
              <Compass className="h-4 w-4" /> SOP Documents ({docs.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {docs.map((d) => (
                <div key={d.id} className="bg-[#151D2A] border border-[#2E3A4E] p-5 rounded-xs flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-[9px] font-mono font-bold text-[#C5A880] uppercase bg-[#C5A880]/10 px-2 py-0.5 rounded-xs">
                        {d.type.toUpperCase()}
                      </span>
                      <span className="text-[9px] font-mono text-[#94A3B8]">{d.file_format} • {d.language.toUpperCase()}</span>
                    </div>
                    <h4 className="font-editorial text-sm text-[#E2E8F0] mt-2 font-medium leading-snug">{d.title}</h4>
                    <p className="text-[11px] text-[#94A3B8] font-sans mt-1.5 leading-relaxed">{d.description}</p>
                  </div>
                  
                  <div className="flex justify-between items-center text-[9px] font-mono pt-2 border-t border-[#2E3A4E]/40 text-[#94A3B8]">
                    <span>Auth: {d.author_organization}</span>
                    <a 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        alert(`Downloading checklist: ${d.title}`);
                      }}
                      className="text-[#C5A880] hover:underline uppercase font-bold tracking-wider"
                    >
                      Download SOP
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
