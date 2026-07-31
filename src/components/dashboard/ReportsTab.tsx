"use client";

import { useState } from "react";
import { FileText, Download, Sparkles, AlertCircle, Clock, RefreshCw } from "lucide-react";

export default function ReportsTab() {
  const [briefingText, setBriefingText] = useState(
    "River Tana telemetry sensors register a discharge spike to 8.4m at Garsen. Risk indexing models high hazard exposure. Evacuation logistics centers are active. NGO relief supplies have dispatched 2,500 food packs."
  );
  const [loading, setLoading] = useState(false);

  const generateAIBriefing = () => {
    setLoading(true);
    setTimeout(() => {
      setBriefingText(
        "AI SYNTHESIS REPORT (IGAD): River Tana remains in critical alert stage (8.6m). Garissa Bypass is 100% blocked by debris. Emergency teams from Red Cross Med A are en route. Consequence simulations project 4,400 people exposed if evacuation lines are delayed 24 hours. Funding approvals total $970,000 USD."
      );
      setLoading(false);
    }, 1200);
  };

  const reportsList = [
    { title: "Daily Situation Assessment - July 31", size: "240 KB", date: "Today 08:30" },
    { title: "ICPAC Hydrology Discharge Summary", size: "1.2 MB", date: "Yesterday" },
    { title: "Anticipatory Funding Logs", size: "48 KB", date: "2026-07-29" },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <span className="text-[10px] font-mono text-[#C5A880] uppercase tracking-widest block font-bold">
          Operations Briefings
        </span>
        <h2 className="font-editorial text-xl sm:text-2xl text-[#E2E8F0] mt-1">
          Situation Overview Logs
        </h2>
        <p className="text-xs text-[#94A3B8] font-sans">
          Compile operational reports, export historical CSV indices, and synthesize real-time executive summaries.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Real-time AI Briefing Generator */}
        <div className="lg:col-span-7 bg-[#151D2A] border border-[#2E3A4E] p-5 sm:p-6 rounded-xs space-y-4">
          <div className="flex justify-between items-center border-b border-[#2E3A4E]/60 pb-3">
            <h3 className="text-xs font-mono text-[#C5A880] uppercase tracking-wider font-bold flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-[#C5A880]" /> AI-Generated Situation Briefing
            </h3>
            <button
              onClick={generateAIBriefing}
              disabled={loading}
              className="text-[10px] font-mono text-[#C5A880] hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
              Re-Synthesize
            </button>
          </div>

          <div className="p-4 bg-[#0B111E] border border-[#2E3A4E]/40 rounded-xs">
            {loading ? (
              <div className="py-8 text-center space-y-2">
                <span className="h-5 w-5 rounded-full border-2 border-[#C5A880] border-t-transparent animate-spin block mx-auto" />
                <span className="text-xs font-mono text-[#94A3B8]">Querying ICPAC sensor arrays & PGVector similarity weights...</span>
              </div>
            ) : (
              <p className="text-xs text-[#E2E8F0] leading-relaxed font-sans font-medium whitespace-pre-line">
                {briefingText}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <button className="flex-1 bg-[#C5A880] hover:bg-[#D4B992] text-[#0B111E] text-xs font-mono font-bold uppercase tracking-wider py-2.5 rounded-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
              <Download className="h-4 w-4" />
              Download Briefing PDF
            </button>
            <button className="bg-[#1C2635] hover:bg-[#C5A880]/10 text-[#E2E8F0] border border-[#2E3A4E] text-xs font-mono font-bold uppercase tracking-wider py-2.5 px-4 rounded-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
              Export Log CSV
            </button>
          </div>
        </div>

        {/* Available Archives */}
        <div className="lg:col-span-5 bg-[#151D2A] border border-[#2E3A4E] p-5 sm:p-6 rounded-xs space-y-4">
          <h3 className="text-xs font-mono text-[#C5A880] uppercase tracking-wider font-bold flex items-center gap-1.5 border-b border-[#2E3A4E]/60 pb-3">
            <FileText className="h-4 w-4" /> Report Archives
          </h3>

          <div className="space-y-3">
            {reportsList.map((rep, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-[#0B111E] border border-[#2E3A4E]/40 rounded-xs">
                <div>
                  <span className="text-xs font-medium text-[#E2E8F0] block">{rep.title}</span>
                  <span className="text-[9px] font-mono text-[#94A3B8] uppercase block mt-0.5">{rep.size} • Compiled {rep.date}</span>
                </div>
                <button className="h-8 w-8 bg-[#C5A880]/15 border border-[#C5A880]/40 text-[#C5A880] hover:bg-[#C5A880] hover:text-[#0B111E] rounded-xs flex items-center justify-center transition-colors cursor-pointer">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
