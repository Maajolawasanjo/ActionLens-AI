"use client";

import { useState } from "react";
import { Landmark, Users, CheckCircle, AlertTriangle, ShieldCheck } from "lucide-react";

export default function SheltersTab() {
  const [shelters, setShelters] = useState([
    { id: "SH-101", name: "Garsen Relief Shelter A", occupancy: 420, capacity: 500, status: "Active", water: "Operational", power: "Backup Generator" },
    { id: "SH-102", name: "Garissa Primary Safe Zone", occupancy: 280, capacity: 300, status: "Near Capacity", water: "Low Supply", power: "Main Grid" },
    { id: "SH-103", name: "Wajir Border Transit Camp", occupancy: 120, capacity: 400, status: "Active", water: "Operational", power: "Solar Array" },
  ]);

  const updateOccupancy = (id: string, delta: number) => {
    setShelters(prev => prev.map(sh => {
      if (sh.id === id) {
        const newOccupancy = Math.max(0, Math.min(sh.capacity, sh.occupancy + delta));
        const status = newOccupancy >= sh.capacity * 0.9 ? "Near Capacity" : "Active";
        return { ...sh, occupancy: newOccupancy, status };
      }
      return sh;
    }));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <span className="text-[10px] font-mono text-[#C5A880] uppercase tracking-widest block font-bold">
          Humanitarian Shelter Grid
        </span>
        <h2 className="font-editorial text-xl sm:text-2xl text-[#E2E8F0] mt-1">
          Shelter Directory & Capacity
        </h2>
        <p className="text-xs text-[#94A3B8] font-sans">
          Audit regional shelter occupancies, allocate extra beds, and verify vital utility checks (Water/Power).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {shelters.map((sh) => {
          const occupancyPercent = Math.round((sh.occupancy / sh.capacity) * 100);
          return (
            <div key={sh.id} className="bg-[#151D2A] border border-[#2E3A4E] p-5 rounded-xs space-y-4">
              <div className="flex justify-between items-start gap-2 border-b border-[#2E3A4E]/60 pb-3">
                <div>
                  <h3 className="text-xs font-mono font-bold text-[#E2E8F0]">{sh.name}</h3>
                  <span className="text-[9px] font-mono text-[#94A3B8] uppercase block mt-0.5">{sh.id}</span>
                </div>
                <span className={`px-2 py-0.5 rounded-xs text-[9px] font-mono font-bold uppercase ${
                  sh.status === "Near Capacity" ? "bg-[#8C2F2F]/20 text-[#EF4444]" : "bg-[#2E7D5B]/20 text-[#10B981]"
                }`}>
                  {sh.status}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#94A3B8]">Occupancy: {sh.occupancy} / {sh.capacity}</span>
                  <span className="text-[#C5A880]">{occupancyPercent}%</span>
                </div>
                <div className="w-full bg-[#0B111E] h-1.5 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-300 ${
                    occupancyPercent >= 90 ? "bg-[#EF4444]" : "bg-[#C5A880]"
                  }`} style={{ width: `${occupancyPercent}%` }} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-[#94A3B8] bg-[#0B111E] p-2.5 rounded-xs border border-[#2E3A4E]/40">
                <div>
                  <span className="block uppercase text-[8px] text-[#64748B]">Water:</span>
                  <span className="text-[#E2E8F0]">{sh.water}</span>
                </div>
                <div>
                  <span className="block uppercase text-[8px] text-[#64748B]">Power:</span>
                  <span className="text-[#E2E8F0]">{sh.power}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => updateOccupancy(sh.id, -10)}
                  className="flex-1 bg-[#1C2635] hover:bg-[#C5A880] hover:text-[#0B111E] border border-[#2E3A4E] text-[10px] font-mono font-bold uppercase py-1.5 rounded-xs transition-colors cursor-pointer"
                >
                  -10 Guests
                </button>
                <button
                  onClick={() => updateOccupancy(sh.id, 10)}
                  className="flex-1 bg-[#1C2635] hover:bg-[#C5A880] hover:text-[#0B111E] border border-[#2E3A4E] text-[10px] font-mono font-bold uppercase py-1.5 rounded-xs transition-colors cursor-pointer"
                >
                  +10 Guests
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
