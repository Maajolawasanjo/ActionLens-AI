"use client";

import { useState } from "react";
import { Truck, MapPin, CheckCircle, Package, Send } from "lucide-react";

export default function AidDistributionTab() {
  const [convoys, setConvoys] = useState([
    { id: "CNV-201", type: "Food Rations", quantity: "2,500 packs", destination: "Garsen Relief Shelter A", status: "En Route", priority: "High" },
    { id: "CNV-202", type: "First Aid Kits", quantity: "450 units", destination: "Garissa Primary Safe Zone", status: "Delivered", priority: "Critical" },
    { id: "CNV-203", type: "Hygiene Packs", quantity: "1,200 packs", destination: "Wajir Border Transit Camp", status: "Pending Dispatch", priority: "Medium" },
  ]);

  const [newType, setNewType] = useState("Food Rations");
  const [newQuantity, setNewQuantity] = useState("");
  const [newDest, setNewDest] = useState("Garsen Relief Shelter A");
  const [newPriority, setNewPriority] = useState("Medium");

  const handleLaunch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuantity.trim()) return;

    const newCnv = {
      id: `CNV-20${convoys.length + 1}`,
      type: newType,
      quantity: newQuantity.trim(),
      destination: newDest,
      status: "Pending Dispatch",
      priority: newPriority,
    };

    setConvoys(prev => [newCnv, ...prev]);
    setNewQuantity("");
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <span className="text-[10px] font-mono text-[#C5A880] uppercase tracking-widest block font-bold">
          Supply Logistics
        </span>
        <h2 className="font-editorial text-xl sm:text-2xl text-[#E2E8F0] mt-1">
          Aid Distribution Center
        </h2>
        <p className="text-xs text-[#94A3B8] font-sans">
          Deploy supply convoys, coordinate ration shipments, and monitor transit routes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Convoys Ledger */}
        <div className="lg:col-span-8 bg-[#151D2A] border border-[#2E3A4E] rounded-xs overflow-hidden">
          <div className="p-4 border-b border-[#2E3A4E] flex justify-between items-center bg-[#1C2635]/40">
            <span className="text-xs font-mono text-[#C5A880] uppercase font-bold">Logistics Convoy Log</span>
            <span className="text-[9px] font-mono text-[#94A3B8]">{convoys.length} Convoys Active</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans text-[#E2E8F0]">
              <thead>
                <tr className="border-b border-[#2E3A4E]/60 text-[10px] font-mono text-[#94A3B8] uppercase">
                  <th className="p-4">Convoy ID</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Quantity</th>
                  <th className="p-4">Destination</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2E3A4E]/40 font-mono">
                {convoys.map((c) => (
                  <tr key={c.id} className="hover:bg-[#1C2635]/25 transition-colors">
                    <td className="p-4 text-[#C5A880] font-bold">{c.id}</td>
                    <td className="p-4 font-sans">{c.type}</td>
                    <td className="p-4">{c.quantity}</td>
                    <td className="p-4 font-sans flex items-center gap-1.5 mt-1.5">
                      <MapPin className="h-3.5 w-3.5 text-[#94A3B8]" />
                      <span className="truncate max-w-[120px]">{c.destination}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-xs text-[9px] font-mono font-bold uppercase ${
                        c.priority === "Critical" ? "bg-[#8C2F2F]/20 text-[#EF4444]" :
                        c.priority === "High" ? "bg-[#C1622E]/20 text-[#F97316]" :
                        "bg-[#2E7D5B]/20 text-[#10B981]"
                      }`}>
                        {c.priority}
                      </span>
                    </td>
                    <td className="p-4 text-right font-sans">
                      <span className={`inline-flex items-center gap-1.5 text-[9px] font-mono uppercase ${
                        c.status === "Delivered" ? "text-[#10B981]" : "text-[#3B82F6]"
                      }`}>
                        <Truck className="h-3.5 w-3.5" />
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Launch Convoy Form */}
        <div className="lg:col-span-4 bg-[#151D2A] border border-[#2E3A4E] p-5 sm:p-6 rounded-xs space-y-4">
          <h3 className="text-xs font-mono text-[#C5A880] uppercase tracking-wider font-bold flex items-center gap-1.5 border-b border-[#2E3A4E]/60 pb-3">
            <Package className="h-4 w-4 text-[#C5A880]" /> Dispatch Supply Convoy
          </h3>

          <form onSubmit={handleLaunch} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono text-[#94A3B8] uppercase tracking-wider">Supply Category</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                className="w-full px-3 py-2 bg-[#0B111E] border border-[#2E3A4E] text-[#E2E8F0] text-xs font-sans focus:outline-none focus:border-[#C5A880] rounded-xs"
              >
                <option value="Food Rations">Food Rations</option>
                <option value="First Aid Kits">First Aid Kits</option>
                <option value="Hygiene Packs">Hygiene Packs</option>
                <option value="Water Purifiers">Water Purifiers</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono text-[#94A3B8] uppercase tracking-wider">Quantity / Units</label>
              <input
                type="text"
                value={newQuantity}
                onChange={(e) => setNewQuantity(e.target.value)}
                placeholder="e.g. 1,500 packs"
                className="w-full px-3 py-2 bg-[#0B111E] border border-[#2E3A4E] text-[#E2E8F0] text-xs font-sans focus:outline-none focus:border-[#C5A880] rounded-xs placeholder:text-[#64748B]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono text-[#94A3B8] uppercase tracking-wider">Destination Shelter</label>
              <select
                value={newDest}
                onChange={(e) => setNewDest(e.target.value)}
                className="w-full px-3 py-2 bg-[#0B111E] border border-[#2E3A4E] text-[#E2E8F0] text-xs font-sans focus:outline-none focus:border-[#C5A880] rounded-xs"
              >
                <option value="Garsen Relief Shelter A">Garsen Relief Shelter A</option>
                <option value="Garissa Primary Safe Zone">Garissa Primary Safe Zone</option>
                <option value="Wajir Border Transit Camp">Wajir Border Transit Camp</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono text-[#94A3B8] uppercase tracking-wider">Priority Code</label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                className="w-full px-3 py-2 bg-[#0B111E] border border-[#2E3A4E] text-[#E2E8F0] text-xs font-sans focus:outline-none focus:border-[#C5A880] rounded-xs"
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-[#C5A880] hover:bg-[#D4B992] text-[#0B111E] text-xs font-mono font-bold uppercase tracking-wider py-3 rounded-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="h-4 w-4" />
              <span>Launch Supply Convoy</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
