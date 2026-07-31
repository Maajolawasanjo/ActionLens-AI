"use client";

import { useState } from "react";
import { AlertTriangle, ShieldAlert, CloudRain, Radio, MessageSquare, Bell, Calendar } from "lucide-react";
import { DEMO_ACTIVE_ALERTS } from "@/lib/demoSeedData";

interface AlertsTabProps {
  role: string;
}

export default function AlertsTab({ role }: AlertsTabProps) {
  const [filterType, setFilterType] = useState<"all" | "government" | "weather" | "ai">("all");

  // Simulated SMS Broadcast log
  const [smsLogs] = useState([
    { phone: "+254 712 *** 889", status: "delivered", time: "10 mins ago", msg: "ActionLens Alert: Garsen Basin river levels breaching 8.4m limit. Seek high ground." },
    { phone: "+254 722 *** 451", status: "delivered", time: "12 mins ago", msg: "ActionLens Alert: Garsen Basin river levels breaching 8.4m limit. Seek high ground." },
    { phone: "+254 701 *** 092", status: "delivered", time: "15 mins ago", msg: "ActionLens Alert: Garsen Basin river levels breaching 8.4m limit. Seek high ground." },
    { phone: "+254 754 *** 331", status: "delivered", time: "18 mins ago", msg: "ActionLens Alert: Table Mountain wildfire red flag watch active." },
    { phone: "+254 792 *** 229", status: "delivered", time: "22 mins ago", msg: "ActionLens Alert: Table Mountain wildfire red flag watch active." },
  ]);

  const filteredAlerts = DEMO_ACTIVE_ALERTS.filter(alert => {
    if (filterType === "all") return true;
    if (filterType === "government") return alert.issued_by.toLowerCase().includes("agency") || alert.issued_by.toLowerCase().includes("ministry") || alert.issued_by.toLowerCase().includes("department");
    if (filterType === "weather") return alert.type === "flood" || alert.type === "cyclone" || alert.type === "heatwave" || alert.type === "wildfire";
    if (filterType === "ai") return alert.severity === "critical" && (alert.type === "flood" || alert.type === "earthquake");
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <span className="text-[10px] font-mono text-[#C5A880] uppercase tracking-widest block font-bold">
          Emergency Communications Core
        </span>
        <h2 className="font-editorial text-xl sm:text-2xl text-[#E2E8F0] mt-1">
          Active Threat Advisories
        </h2>
        <p className="text-xs text-[#94A3B8] font-sans">
          Review warnings, forecast notices, and simulated SMS dispatch confirmation logs.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ACTIVE ALERTS LIST */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex flex-wrap gap-2 justify-between items-center bg-[#151D2A] border border-[#2E3A4E] p-3.5 rounded-xs">
            <span className="text-[10px] font-mono text-[#C5A880] uppercase tracking-wider font-bold">Filter Categories</span>
            <div className="flex gap-2">
              {[
                { id: "all", label: "All Alerts" },
                { id: "government", label: "Official Gov" },
                { id: "weather", label: "Meteorological" },
                { id: "ai", label: "AI Predicted" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterType(tab.id as any)}
                  className={`px-3 py-1 font-mono text-[9px] uppercase font-bold tracking-wider rounded-xs transition-colors cursor-pointer border ${
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

          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <div key={alert.id} className="bg-[#151D2A] border border-[#2E3A4E] p-5 rounded-xs space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-[#94A3B8] uppercase block">
                      Source: {alert.issued_by} • Issued {alert.issued_time}
                    </span>
                    <h3 className="font-editorial text-base text-[#E2E8F0] font-medium leading-snug">{alert.title}</h3>
                  </div>
                  <span className={`text-[8px] font-mono font-bold py-0.5 px-2 rounded-xs uppercase shrink-0 ${
                    alert.severity === "critical" ? "bg-[#8C2F2F]/20 text-[#EF4444]" : alert.severity === "high" ? "bg-[#C1622E]/20 text-[#E07A5F]" : "bg-[#2E7D5B]/20 text-[#3A86C8]"
                  }`}>
                    {alert.severity}
                  </span>
                </div>

                <p className="text-xs text-[#94A3B8] font-sans leading-relaxed">
                  <strong>Recommended Directive:</strong> {alert.recommended_action}
                </p>

                <div className="grid grid-cols-3 gap-4 pt-3 border-t border-[#2E3A4E]/40 text-[10px] font-mono text-[#94A3B8]">
                  <div>
                    <span className="text-[8px] text-[#64748B] uppercase block">Risk Rating</span>
                    <span className="text-[#E2E8F0] mt-0.5 block">{alert.risk_level}</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-[#64748B] uppercase block">Affected Population</span>
                    <span className="text-[#E2E8F0] mt-0.5 block">{alert.affected_population.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-[#64748B] uppercase block">Expires In</span>
                    <span className="text-[#E2E8F0] mt-0.5 block">{alert.expires_in}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SMS BROADCAST LOGS */}
        <div className="lg:col-span-4 bg-[#151D2A] border border-[#2E3A4E] p-5 rounded-xs space-y-4">
          <div className="border-b border-[#2E3A4E]/60 pb-3">
            <h3 className="text-xs font-mono text-[#C5A880] uppercase tracking-wider font-bold flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4 text-[#C5A880]" /> SMS Dispatch Logs
            </h3>
          </div>

          <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-1">
            {smsLogs.map((log, idx) => (
              <div key={idx} className="bg-[#0B111E] border border-[#2E3A4E] p-3 rounded-xs space-y-2 text-[10px] font-mono">
                <div className="flex justify-between items-center text-[9px]">
                  <span className="text-[#C5A880] font-bold">{log.phone}</span>
                  <span className="text-[#2E7D5B] bg-[#2E7D5B]/10 px-1.5 py-0.5 rounded-xs font-semibold">DELIVERED</span>
                </div>
                <p className="text-[#94A3B8] font-sans leading-relaxed">{log.msg}</p>
                <span className="text-[8px] text-[#64748B] block text-right">Sent {log.time}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-[#2E3A4E]/40 text-center">
            <span className="text-[9px] font-mono text-[#64748B] block">
              Automated Twilio routing enabled for registered cell nodes.
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
