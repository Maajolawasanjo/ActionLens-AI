"use client";

import { useState } from "react";
import { CheckSquare, Square, Download, Shield, Sparkles, BookOpen } from "lucide-react";

export default function PreparednessTab() {
  const [kitItems, setKitItems] = useState([
    { id: 1, label: "Clean drinking water (3 liters per person/day)", checked: true },
    { id: 2, label: "Non-perishable food (rice, beans, canned food - 3 day supply)", checked: true },
    { id: 3, label: "First-aid kit with basic medicines", checked: false },
    { id: 4, label: "Flashlight and spare battery cells", checked: false },
    { id: 5, label: "Water purification tablets or bleach", checked: false },
    { id: 6, label: "Battery-powered radio receiver", checked: false },
    { id: 7, label: "Whistle to signal for search rescue help", checked: false },
  ]);

  const toggleItem = (id: number) => {
    setKitItems(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const completedCount = kitItems.filter(i => i.checked).length;
  const progressPercent = Math.round((completedCount / kitItems.length) * 100);

  const guidePdfs = [
    { title: "IGAD Flood Evacuation Protocols", size: "1.4 MB", type: "PDF" },
    { title: "Wildfire Perimeter Safety Standards", size: "940 KB", type: "PDF" },
    { title: "Emergency Water Purification Guide", size: "2.1 MB", type: "PDF" },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <span className="text-[10px] font-mono text-[#C5A880] uppercase tracking-widest block font-bold">
          Emergency Readiness
        </span>
        <h2 className="font-editorial text-xl sm:text-2xl text-[#E2E8F0] mt-1">
          Citizen Preparedness Portal
        </h2>
        <p className="text-xs text-[#94A3B8] font-sans">
          Verify checklists, build your survival kit, and export localized disaster SOPs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Survival Kit Checklist */}
        <div className="lg:col-span-7 bg-[#151D2A] border border-[#2E3A4E] p-5 sm:p-6 rounded-xs space-y-4">
          <div className="flex justify-between items-center border-b border-[#2E3A4E]/60 pb-3">
            <h3 className="text-xs font-mono text-[#C5A880] uppercase tracking-wider font-bold flex items-center gap-1.5">
              <Shield className="h-4 w-4" /> 72-Hour Survival Kit Builder
            </h3>
            <span className="text-[9px] font-mono text-[#94A3B8] uppercase">Progress: {progressPercent}%</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-[#0B111E] h-2 rounded-full overflow-hidden">
            <div className="bg-[#C5A880] h-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
          </div>

          <div className="space-y-2 pt-2">
            {kitItems.map((item) => (
              <button
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className="w-full flex items-center gap-3 p-3 bg-[#0B111E] hover:bg-[#151D2A]/80 border border-[#2E3A4E]/40 rounded-xs text-left text-xs font-sans text-[#E2E8F0] transition-colors cursor-pointer"
              >
                {item.checked ? (
                  <CheckSquare className="h-4.5 w-4.5 text-[#C5A880] shrink-0" />
                ) : (
                  <Square className="h-4.5 w-4.5 text-[#94A3B8] shrink-0" />
                )}
                <span className={item.checked ? "line-through text-[#64748B]" : ""}>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Guides & Resources */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#151D2A] border border-[#2E3A4E] p-5 sm:p-6 rounded-xs space-y-4">
            <h3 className="text-xs font-mono text-[#C5A880] uppercase tracking-wider font-bold flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" /> Emergency Directives
            </h3>
            <div className="space-y-3">
              {guidePdfs.map((guide, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-[#0B111E] border border-[#2E3A4E]/40 rounded-xs">
                  <div>
                    <span className="text-xs font-medium text-[#E2E8F0] block">{guide.title}</span>
                    <span className="text-[9px] font-mono text-[#94A3B8] uppercase block mt-0.5">{guide.size} • {guide.type}</span>
                  </div>
                  <button className="h-8 w-8 bg-[#C5A880]/15 border border-[#C5A880]/40 text-[#C5A880] hover:bg-[#C5A880] hover:text-[#0B111E] rounded-xs flex items-center justify-center transition-colors cursor-pointer">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#151D2A]/80 border border-[#2E3A4E]/60 p-5 rounded-xs space-y-3">
            <div className="flex items-center gap-2 text-[#C5A880]">
              <Sparkles className="h-4.5 w-4.5" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider">AI Recommendation</span>
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              "Based on river flood predictions in your local corridor, verify that bleach and water purification tools are securely placed in elevated locations of your residence."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
