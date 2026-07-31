"use client";

import { useState } from "react";
import { Users, UserCheck, Shield, Clipboard, Check } from "lucide-react";

export default function VolunteersTab() {
  const [volunteers, setVolunteers] = useState([
    { id: "VOL-701", name: "Fatima Ali", skill: "Medical Triage", status: "Active", phone: "+254 711 223344", hours: 24 },
    { id: "VOL-702", name: "Omar Hassan", skill: "Logistics Driver", status: "Active", phone: "+254 722 556677", hours: 40 },
    { id: "VOL-703", name: "Grace Mwangi", skill: "Search & Rescue", status: "On Call", phone: "+254 733 889900", hours: 12 },
    { id: "VOL-704", name: "Jibril Ibrahim", skill: "Supply Management", status: "Pending", phone: "+254 744 112233", hours: 0 },
  ]);

  const approveVolunteer = (id: string) => {
    setVolunteers(prev => prev.map(v => v.id === id ? { ...v, status: "Active" } : v));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <span className="text-[10px] font-mono text-[#C5A880] uppercase tracking-widest block font-bold">
          Humanitarian Roster
        </span>
        <h2 className="font-editorial text-xl sm:text-2xl text-[#E2E8F0] mt-1">
          Volunteer Roster Coordination
        </h2>
        <p className="text-xs text-[#94A3B8] font-sans">
          Manage local volunteer registrations, review rescue qualifications, and authorize dispatch alerts.
        </p>
      </div>

      <div className="bg-[#151D2A] border border-[#2E3A4E] rounded-xs overflow-hidden">
        <div className="p-4 border-b border-[#2E3A4E] flex justify-between items-center bg-[#1C2635]/40">
          <span className="text-xs font-mono text-[#C5A880] uppercase font-bold">Registered Volunteer Grid</span>
          <span className="text-[9px] font-mono text-[#94A3B8]">{volunteers.length} Personnel Logs</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans text-[#E2E8F0] border-collapse">
            <thead>
              <tr className="border-b border-[#2E3A4E]/60 text-[10px] font-mono text-[#94A3B8] uppercase">
                <th className="p-4">VOL ID</th>
                <th className="p-4">Full Name</th>
                <th className="p-4">Core Skill</th>
                <th className="p-4">Phone Number</th>
                <th className="p-4">Logged Hours</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2E3A4E]/40 font-mono">
              {volunteers.map((v) => (
                <tr key={v.id} className="hover:bg-[#1C2635]/25 transition-colors">
                  <td className="p-4 text-[#C5A880] font-bold">{v.id}</td>
                  <td className="p-4 font-sans font-medium text-[#E2E8F0]">{v.name}</td>
                  <td className="p-4 font-sans">{v.skill}</td>
                  <td className="p-4">{v.phone}</td>
                  <td className="p-4">{v.hours} hrs</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-xs text-[9px] font-mono font-bold uppercase ${
                      v.status === "Active" ? "bg-[#2E7D5B]/20 text-[#10B981]" :
                      v.status === "On Call" ? "bg-[#3B82F6]/20 text-[#3B82F6]" :
                      "bg-[#F59E0B]/20 text-[#F59E0B]"
                    }`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="p-4 text-right font-sans">
                    {v.status === "Pending" ? (
                      <button
                        onClick={() => approveVolunteer(v.id)}
                        className="bg-[#2E7D5B]/20 hover:bg-[#2E7D5B] text-[#10B981] hover:text-[#E2E8F0] border border-[#2E7D5B]/40 px-2 py-0.5 rounded-xs transition-colors cursor-pointer text-[9px] uppercase"
                      >
                        Approve
                      </button>
                    ) : (
                      <span className="text-[#64748B] text-[10px] flex items-center gap-1 justify-end font-mono">
                        <Check className="h-3.5 w-3.5 text-[#10B981]" /> Verified
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
