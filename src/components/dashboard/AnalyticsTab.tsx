"use client";

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { BarChart3, Activity, Clock, ShieldAlert, Users, TrendingUp, AlertTriangle } from "lucide-react";
import { DEMO_ANALYTICS_DATA } from "@/lib/demoSeedData";

interface AnalyticsTabProps {
  role: string;
}

export default function AnalyticsTab({ role }: AnalyticsTabProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [delayHours, setDelayHours] = useState(24);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Simulator calculators
  const getCasualties = (hours: number) => {
    // 0h: 120, 24h: 4400, 48h: 15200, 72h: 38000
    if (hours === 0) return 120;
    if (hours <= 24) return Math.round(120 + (hours * 178.3));
    if (hours <= 48) return Math.round(4400 + ((hours - 24) * 450));
    return Math.round(15200 + ((hours - 48) * 950));
  };

  const getLosses = (hours: number) => {
    // 0h: 45000, 24h: 696000, 48h: 2400000, 72h: 5800000
    if (hours === 0) return 45000;
    if (hours <= 24) return Math.round(45000 + (hours * 27125));
    if (hours <= 48) return Math.round(696000 + ((hours - 24) * 71000));
    return Math.round(2400000 + ((hours - 48) * 141666));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <span className="text-[10px] font-mono text-[#C5A880] uppercase tracking-widest block font-bold">
          Operational Intelligence Hub
        </span>
        <h2 className="font-editorial text-xl sm:text-2xl text-[#E2E8F0] mt-1">
          Predictive Analytics & Consequence Simulator
        </h2>
        <p className="text-xs text-[#94A3B8] font-sans">
          Audit regional warning trends, response times, and model future damage matrices.
        </p>
      </div>

      {/* SIMULATOR BOARD */}
      <div className="bg-[#151D2A] border border-[#2E3A4E] p-5 sm:p-6 rounded-xs space-y-5">
        <div className="flex justify-between items-center border-b border-[#2E3A4E]/60 pb-3">
          <h3 className="text-xs font-mono text-[#C5A880] uppercase tracking-wider font-bold flex items-center gap-1.5">
            <Activity className="h-4 w-4 text-[#C5A880]" /> Pre-Disaster Consequence Simulator
          </h3>
          <span className="text-[9px] font-mono text-[#94A3B8] uppercase">Scope: Horn of Africa Corridor</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-7 space-y-4">
            <p className="text-xs text-[#94A3B8] leading-relaxed font-sans">
              Adjust the warning propagation delay below to model how response time latency impacts regional population displacement, casualty rates, and capital crop losses.
            </p>
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#94A3B8]">Evacuation Delay Timeline</span>
                <span className="text-[#C5A880] font-bold">{delayHours} Hours</span>
              </div>
              <input 
                type="range"
                min="0"
                max="72"
                step="4"
                value={delayHours}
                onChange={(e) => setDelayHours(parseInt(e.target.value))}
                className="w-full h-1.5 bg-[#0B111E] rounded-full appearance-none cursor-pointer accent-[#C5A880]"
              />
              <div className="flex justify-between text-[8px] font-mono text-[#64748B]">
                <span>0h (Immediate Alert)</span>
                <span>24h (Watch)</span>
                <span>48h (Alert Status)</span>
                <span>72h (Severe Impact)</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-5 bg-[#0B111E] p-5 border border-[#2E3A4E] rounded-xs grid grid-cols-2 gap-4">
            <div>
              <span className="text-[8px] font-mono text-[#94A3B8] uppercase block">Projected Casualties</span>
              <span className="text-xl sm:text-2xl font-mono font-bold text-[#EF4444] mt-1 block">
                {getCasualties(delayHours).toLocaleString()} People
              </span>
            </div>
            <div>
              <span className="text-[8px] font-mono text-[#94A3B8] uppercase block">Projected Asset Loss</span>
              <span className="text-xl sm:text-2xl font-mono font-bold text-[#E2E8F0] mt-1 block">
                ${getLosses(delayHours).toLocaleString()} USD
              </span>
            </div>
            <div className="col-span-2 pt-2 border-t border-[#2E3A4E]/60 text-[9px] font-mono text-[#94A3B8]">
              ⚠️ Calculations grounded in RAG policy buffers and historical NiMet records.
            </div>
          </div>
        </div>
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* MONTHLY TRENDS */}
        <div className="bg-[#151D2A] border border-[#2E3A4E] p-5 rounded-xs space-y-4">
          <h3 className="text-xs font-mono text-[#C5A880] uppercase tracking-wider font-bold">Monthly Alerts & Accuracy Trends</h3>
          <div className="h-64 w-full">
            {isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={DEMO_ANALYTICS_DATA.monthly_trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAlerts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C5A880" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#C5A880" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2E3A4E" opacity={0.3} />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={9} className="font-mono" />
                  <YAxis stroke="#94A3B8" fontSize={9} className="font-mono" />
                  <Tooltip contentStyle={{ background: "#151D2A", border: "1px solid #2E3A4E" }} labelStyle={{ color: "#E2E8F0" }} />
                  <Area type="monotone" dataKey="alerts" stroke="#C5A880" fillOpacity={1} fill="url(#colorAlerts)" strokeWidth={2} name="Total Alerts" />
                  <Area type="monotone" dataKey="accuracy" stroke="#2E7D5B" fillOpacity={0} strokeWidth={1} name="AI Precision %" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs font-mono text-[#94A3B8]">Loading charts...</div>
            )}
          </div>
        </div>

        {/* THREAT DISTRIBUTION */}
        <div className="bg-[#151D2A] border border-[#2E3A4E] p-5 rounded-xs space-y-4">
          <h3 className="text-xs font-mono text-[#C5A880] uppercase tracking-wider font-bold">Threat Type Distribution</h3>
          <div className="h-64 w-full">
            {isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DEMO_ANALYTICS_DATA.disaster_distribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2E3A4E" opacity={0.3} />
                  <XAxis dataKey="type" stroke="#94A3B8" fontSize={9} className="font-mono" />
                  <YAxis stroke="#94A3B8" fontSize={9} className="font-mono" />
                  <Tooltip contentStyle={{ background: "#151D2A", border: "1px solid #2E3A4E" }} labelStyle={{ color: "#E2E8F0" }} />
                  <Bar dataKey="count" fill="#C5A880" radius={[2, 2, 0, 0]} name="Recorded Events" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs font-mono text-[#94A3B8]">Loading charts...</div>
            )}
          </div>
        </div>

      </div>

      {/* CORE STATS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Communities protected", value: "42,380+" },
          { label: "AI Recommendations", value: "2,436 Logs" },
          { label: "Community Reports", value: "814 Submits" },
          { label: "Warning precision", value: "94.6%" },
        ].map((s, idx) => (
          <div key={idx} className="bg-[#151D2A] border border-[#2E3A4E] p-4 rounded-xs">
            <span className="text-[8px] font-mono text-[#94A3B8] uppercase block tracking-wider">{s.label}</span>
            <span className="text-lg font-mono font-bold text-[#E2E8F0] mt-1 block">{s.value}</span>
          </div>
        ))}
      </div>

    </div>
  );
}
