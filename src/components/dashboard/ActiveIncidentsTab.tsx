"use client";

import { useState } from "react";
import { AlertCircle, ShieldAlert, CheckCircle, Clock, MapPin, Eye } from "lucide-react";

export default function ActiveIncidentsTab() {
  const [incidents, setIncidents] = useState([
    { id: "INC-901", type: "Flood", severity: "Critical", location: "Tana River Basin", reporter: "Aisha N.", time: "10 mins ago", status: "Pending", details: "Levee wall showing structural stress and water leakage." },
    { id: "INC-902", type: "Wildfire", severity: "High", location: "Laikipia Foothills", reporter: "David K.", time: "28 mins ago", status: "Dispatched", details: "Grasslands fire spreading towards northern settlements." },
    { id: "INC-903", type: "Blocked Road", severity: "Medium", location: "Garissa Bypass", reporter: "John M.", time: "1 hour ago", status: "Resolved", details: "Fallen acacia tree cleared from primary evacuation route." },
    { id: "INC-904", type: "Drought", severity: "High", location: "Wajir Border", reporter: "NGO Scout", time: "3 hours ago", status: "Pending", details: "Water reserves depleted in refugee camp sector 3." },
  ]);

  const [selectedInc, setSelectedInc] = useState<typeof incidents[0] | null>(null);

  const updateStatus = (id: string, newStatus: string) => {
    setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, status: newStatus } : inc));
    if (selectedInc && selectedInc.id === id) {
      setSelectedInc(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <span className="text-[10px] font-mono text-[#C5A880] uppercase tracking-widest block font-bold">
          Emergency Operations Control
        </span>
        <h2 className="font-editorial text-xl sm:text-2xl text-[#E2E8F0] mt-1">
          Active Incidents Directory
        </h2>
        <p className="text-xs text-[#94A3B8] font-sans">
          Audit incoming community alerts, toggle resolution states, and dispatch rescue teams.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Table of Incidents */}
        <div className="lg:col-span-8 bg-[#151D2A] border border-[#2E3A4E] rounded-xs overflow-hidden">
          <div className="p-4 border-b border-[#2E3A4E] flex justify-between items-center bg-[#1C2635]/40">
            <span className="text-xs font-mono text-[#C5A880] uppercase font-bold">Incident Log Registry</span>
            <span className="text-[9px] font-mono text-[#94A3B8]">{incidents.length} Events Total</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans text-[#E2E8F0] border-collapse">
              <thead>
                <tr className="border-b border-[#2E3A4E]/60 text-[10px] font-mono text-[#94A3B8] uppercase">
                  <th className="p-4">ID</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Severity</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2E3A4E]/40">
                {incidents.map((inc) => (
                  <tr key={inc.id} className="hover:bg-[#1C2635]/25 transition-colors">
                    <td className="p-4 font-mono font-bold text-[#C5A880]">{inc.id}</td>
                    <td className="p-4">{inc.type}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-xs text-[9px] font-mono font-bold uppercase ${
                        inc.severity === "Critical" ? "bg-[#8C2F2F]/20 text-[#EF4444]" :
                        inc.severity === "High" ? "bg-[#C1622E]/20 text-[#F97316]" :
                        "bg-[#2E7D5B]/20 text-[#10B981]"
                      }`}>
                        {inc.severity}
                      </span>
                    </td>
                    <td className="p-4 flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-[#94A3B8] shrink-0" />
                      <span className="truncate max-w-[120px]">{inc.location}</span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 text-[9px] font-mono uppercase ${
                        inc.status === "Pending" ? "text-[#F59E0B]" :
                        inc.status === "Dispatched" ? "text-[#3B82F6]" :
                        "text-[#10B981]"
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          inc.status === "Pending" ? "bg-[#F59E0B] animate-pulse" :
                          inc.status === "Dispatched" ? "bg-[#3B82F6] animate-pulse" :
                          "bg-[#10B981]"
                        }`} />
                        {inc.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedInc(inc)}
                        className="bg-[#1C2635] hover:bg-[#C5A880] hover:text-[#0B111E] text-[#94A3B8] px-2.5 py-1 rounded-xs transition-colors cursor-pointer text-[10px] font-mono"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Incident Drawer/Inspection */}
        <div className="lg:col-span-4 bg-[#151D2A] border border-[#2E3A4E] p-5 sm:p-6 rounded-xs space-y-4">
          <div className="border-b border-[#2E3A4E]/60 pb-3 flex justify-between items-center">
            <h3 className="text-xs font-mono text-[#C5A880] uppercase tracking-wider font-bold">
              Details Drawer
            </h3>
            {selectedInc && (
              <span className="font-mono text-[9px] text-[#94A3B8]">{selectedInc.id}</span>
            )}
          </div>

          {selectedInc ? (
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[9px] font-mono text-[#94A3B8] uppercase block">Location & Reporter</span>
                <p className="text-xs text-[#E2E8F0] font-medium flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-[#C5A880]" /> {selectedInc.location}
                </p>
                <p className="text-[10px] text-[#94A3B8] font-sans">Reported by {selectedInc.reporter} • {selectedInc.time}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-mono text-[#94A3B8] uppercase block">Description / Telemetry</span>
                <p className="text-xs text-[#E2E8F0] leading-relaxed bg-[#0B111E] p-3 rounded-xs border border-[#2E3A4E]/40 font-sans">
                  {selectedInc.details}
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-[9px] font-mono text-[#94A3B8] uppercase block">Operations Action</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateStatus(selectedInc.id, "Dispatched")}
                    disabled={selectedInc.status === "Dispatched"}
                    className="flex-1 bg-[#C5A880]/15 hover:bg-[#C5A880] hover:text-[#0B111E] text-[#C5A880] border border-[#C5A880]/40 py-2 rounded-xs text-[10px] font-mono font-bold uppercase transition-colors cursor-pointer disabled:opacity-40"
                  >
                    Dispatch
                  </button>
                  <button
                    onClick={() => updateStatus(selectedInc.id, "Resolved")}
                    disabled={selectedInc.status === "Resolved"}
                    className="flex-1 bg-[#2E7D5B]/15 hover:bg-[#2E7D5B] hover:text-[#E2E8F0] text-[#2E7D5B] border border-[#2E7D5B]/40 py-2 rounded-xs text-[10px] font-mono font-bold uppercase transition-colors cursor-pointer disabled:opacity-40"
                  >
                    Resolve
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center space-y-2">
              <span className="text-xs text-[#64748B] block font-mono">Select an incident to audit operations</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
