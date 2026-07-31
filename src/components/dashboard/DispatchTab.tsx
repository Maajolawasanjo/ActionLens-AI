"use client";

import { useState } from "react";
import { Truck, Users, Radio, Navigation, Send, Plus } from "lucide-react";

export default function DispatchTab() {
  const [teams, setTeams] = useState([
    { id: "TEAM-A", name: "Red Cross Med Triage A", status: "Available", vehicle: "Ambulance Range 4", members: 4, region: "Garissa Central" },
    { id: "TEAM-B", name: "Police Search & Rescue C", status: "Deployed", vehicle: "4x4 Land Cruiser 8", members: 6, region: "Tana River Corridor" },
    { id: "TEAM-C", name: "WFP Supply Distribution B", status: "Available", vehicle: "Cargo Flatbed 12", members: 3, region: "Wajir County" },
    { id: "TEAM-D", name: "IGAD Evacuation Air Unit 1", status: "Maintenance", vehicle: "Bell 412 Helicopter", members: 5, region: "Garissa Airport" },
  ]);

  const [deploymentLog, setDeploymentLog] = useState([
    { id: "LOG-01", team: "TEAM-B", destination: "Tana River Basin Levee", eta: "15 mins", time: "11:05 UTC", status: "En Route" },
  ]);

  const [newDestination, setNewDestination] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("TEAM-A");

  const handleDeploy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDestination.trim()) return;

    const targetTeam = teams.find(t => t.id === selectedTeam);
    if (!targetTeam || targetTeam.status !== "Available") return;

    // Update team status
    setTeams(prev => prev.map(t => t.id === selectedTeam ? { ...t, status: "Deployed" } : t));

    // Append to logs
    const newLog = {
      id: `LOG-0${deploymentLog.length + 1}`,
      team: selectedTeam,
      destination: newDestination.trim(),
      eta: "30 mins",
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }) + " UTC",
      status: "En Route",
    };

    setDeploymentLog(prev => [newLog, ...prev]);
    setNewDestination("");
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <span className="text-[10px] font-mono text-[#C5A880] uppercase tracking-widest block font-bold">
          Tactical Mobilization
        </span>
        <h2 className="font-editorial text-xl sm:text-2xl text-[#E2E8F0] mt-1">
          Responder Dispatch Console
        </h2>
        <p className="text-xs text-[#94A3B8] font-sans">
          Deploy rescue operations, coordinate vehicle ETAs, and record field dispatch radio logs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Available Teams */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-[#151D2A] border border-[#2E3A4E] p-5 sm:p-6 rounded-xs space-y-4">
            <h3 className="text-xs font-mono text-[#C5A880] uppercase tracking-wider font-bold flex items-center gap-1.5 border-b border-[#2E3A4E]/60 pb-3">
              <Users className="h-4 w-4" /> Available Response Units
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {teams.map((team) => (
                <div key={team.id} className="bg-[#0B111E] border border-[#2E3A4E]/40 p-4 rounded-xs flex flex-col justify-between space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="text-xs font-mono font-bold text-[#E2E8F0] block">{team.name}</span>
                      <span className="text-[9px] font-mono text-[#94A3B8] uppercase block mt-0.5">{team.id} • {team.vehicle}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-xs text-[9px] font-mono font-bold uppercase ${
                      team.status === "Available" ? "bg-[#2E7D5B]/20 text-[#10B981]" :
                      team.status === "Deployed" ? "bg-[#3B82F6]/20 text-[#3B82F6]" :
                      "bg-[#8C2F2F]/20 text-[#EF4444]"
                    }`}>
                      {team.status}
                    </span>
                  </div>

                  <div className="flex justify-between text-[10px] text-[#94A3B8] font-sans pt-2 border-t border-[#2E3A4E]/20">
                    <span>Members: {team.members}</span>
                    <span>Region: {team.region}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Deployments Log */}
          <div className="bg-[#151D2A] border border-[#2E3A4E] p-5 sm:p-6 rounded-xs space-y-4">
            <h3 className="text-xs font-mono text-[#C5A880] uppercase tracking-wider font-bold flex items-center gap-1.5 border-b border-[#2E3A4E]/60 pb-3">
              <Navigation className="h-4 w-4" /> Active Deployments Ledger
            </h3>

            <div className="space-y-2">
              {deploymentLog.map((log) => {
                const teamDetail = teams.find(t => t.id === log.team);
                return (
                  <div key={log.id} className="flex justify-between items-center p-3 bg-[#0B111E] border border-[#2E3A4E]/40 rounded-xs">
                    <div className="flex items-center gap-3">
                      <Truck className="h-5 w-5 text-[#C5A880] shrink-0" />
                      <div>
                        <span className="text-xs font-medium text-[#E2E8F0]">{teamDetail?.name || log.team}</span>
                        <span className="text-[9px] font-mono text-[#94A3B8] uppercase block mt-0.5">Destination: {log.destination} • {log.time}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono text-[#C5A880] font-bold block">ETA: {log.eta}</span>
                      <span className="text-[9px] font-mono text-[#3B82F6] uppercase block mt-0.5">{log.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dispatch Trigger Panel */}
        <div className="lg:col-span-4 bg-[#151D2A] border border-[#2E3A4E] p-5 sm:p-6 rounded-xs space-y-4">
          <h3 className="text-xs font-mono text-[#C5A880] uppercase tracking-wider font-bold flex items-center gap-1.5 border-b border-[#2E3A4E]/60 pb-3">
            <Radio className="h-4 w-4 text-[#C5A880]" /> Dispatch Dispatcher
          </h3>

          <form onSubmit={handleDeploy} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono text-[#94A3B8] uppercase tracking-wider">Select Available Unit</label>
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="w-full px-3 py-2 bg-[#0B111E] border border-[#2E3A4E] text-[#E2E8F0] text-xs font-sans focus:outline-none focus:border-[#C5A880] rounded-xs"
              >
                {teams.filter(t => t.status === "Available").map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.id})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono text-[#94A3B8] uppercase tracking-wider">Evacuation Destination / GPS</label>
              <input
                type="text"
                value={newDestination}
                onChange={(e) => setNewDestination(e.target.value)}
                placeholder="Coordinates or site location..."
                className="w-full px-3 py-2 bg-[#0B111E] border border-[#2E3A4E] text-[#E2E8F0] text-xs font-sans focus:outline-none focus:border-[#C5A880] rounded-xs placeholder:text-[#64748B]"
              />
            </div>

            <button
              type="submit"
              disabled={teams.filter(t => t.status === "Available").length === 0}
              className="w-full bg-[#C5A880] hover:bg-[#D4B992] text-[#0B111E] text-xs font-mono font-bold uppercase tracking-wider py-3 rounded-xs transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              <span>Broadcast Dispatch Order</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
