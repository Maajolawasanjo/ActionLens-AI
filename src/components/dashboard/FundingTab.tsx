"use client";

import { useState } from "react";
import { Landmark, ArrowUpRight, CheckCircle2, AlertTriangle, Send } from "lucide-react";

export default function FundingTab() {
  const [budget, setBudget] = useState(4850000); // $4.85M
  const [allocations, setAllocations] = useState([
    { id: "TX-401", region: "Tana River Basin", amount: 650000, category: "Flood Barriers", status: "Approved", date: "2026-07-28" },
    { id: "TX-402", region: "Garissa County", amount: 320000, category: "Water Rationing", status: "Approved", date: "2026-07-29" },
    { id: "TX-403", region: "Laikipia Foothills", amount: 450000, category: "Wildfire Suppression", status: "Pending", date: "2026-07-30" },
  ]);

  const [reqAmount, setReqAmount] = useState("");
  const [reqRegion, setReqRegion] = useState("Garissa County");
  const [reqCategory, setReqCategory] = useState("Medical Triage Kit");

  const handleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(reqAmount);
    if (isNaN(amountVal) || amountVal <= 0) return;

    const newTx = {
      id: `TX-40${allocations.length + 1}`,
      region: reqRegion,
      amount: amountVal,
      category: reqCategory,
      status: "Pending",
      date: new Date().toISOString().split("T")[0],
    };

    setAllocations(prev => [newTx, ...prev]);
    setReqAmount("");
  };

  const approveTx = (id: string, amount: number) => {
    setAllocations(prev => prev.map(tx => tx.id === id ? { ...tx, status: "Approved" } : tx));
    setBudget(prev => prev - amount);
  };

  const totalAllocated = allocations.filter(tx => tx.status === "Approved").reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <span className="text-[10px] font-mono text-[#C5A880] uppercase tracking-widest block font-bold">
          Emergency Fiscal Allocation
        </span>
        <h2 className="font-editorial text-xl sm:text-2xl text-[#E2E8F0] mt-1">
          National Mitigation Funding
        </h2>
        <p className="text-xs text-[#94A3B8] font-sans">
          Coordinate emergency contingency budgets, approve grant disbursements, and audit operational ledgers.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#151D2A] border border-[#2E3A4E] p-4 rounded-xs">
          <span className="text-[9px] font-mono text-[#94A3B8] uppercase block tracking-wider">Remaining Emergency Budget</span>
          <span className="text-xl sm:text-2xl font-mono font-bold text-[#E2E8F0] mt-1 block">
            ${budget.toLocaleString()} USD
          </span>
        </div>
        <div className="bg-[#151D2A] border border-[#2E3A4E] p-4 rounded-xs">
          <span className="text-[9px] font-mono text-[#94A3B8] uppercase block tracking-wider">Total Disbursed Funds</span>
          <span className="text-xl sm:text-2xl font-mono font-bold text-[#C5A880] mt-1 block">
            ${totalAllocated.toLocaleString()} USD
          </span>
        </div>
        <div className="bg-[#151D2A] border border-[#2E3A4E] p-4 rounded-xs">
          <span className="text-[9px] font-mono text-[#94A3B8] uppercase block tracking-wider">Pending Grants Pipeline</span>
          <span className="text-xl sm:text-2xl font-mono font-bold text-[#F59E0B] mt-1 block">
            ${allocations.filter(tx => tx.status === "Pending").reduce((sum, tx) => sum + tx.amount, 0).toLocaleString()} USD
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Allocations Table */}
        <div className="lg:col-span-8 bg-[#151D2A] border border-[#2E3A4E] rounded-xs overflow-hidden">
          <div className="p-4 border-b border-[#2E3A4E] flex justify-between items-center bg-[#1C2635]/40">
            <span className="text-xs font-mono text-[#C5A880] uppercase font-bold">Mitigation Ledger</span>
            <span className="text-[9px] font-mono text-[#94A3B8]">{allocations.length} Transactions</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans text-[#E2E8F0]">
              <thead>
                <tr className="border-b border-[#2E3A4E]/60 text-[10px] font-mono text-[#94A3B8] uppercase">
                  <th className="p-4">Tx ID</th>
                  <th className="p-4">Region</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Approvals</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2E3A4E]/40 font-mono">
                {allocations.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#1C2635]/25 transition-colors">
                    <td className="p-4 text-[#C5A880] font-bold">{tx.id}</td>
                    <td className="p-4 font-sans">{tx.region}</td>
                    <td className="p-4 font-sans">{tx.category}</td>
                    <td className="p-4 font-bold">${tx.amount.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={tx.status === "Approved" ? "text-[#10B981]" : "text-[#F59E0B] animate-pulse"}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {tx.status === "Pending" ? (
                        <button
                          onClick={() => approveTx(tx.id, tx.amount)}
                          className="bg-[#2E7D5B]/20 hover:bg-[#2E7D5B] text-[#10B981] hover:text-[#E2E8F0] border border-[#2E7D5B]/40 px-2 py-0.5 rounded-xs transition-colors cursor-pointer text-[9px] uppercase"
                        >
                          Approve
                        </button>
                      ) : (
                        <span className="text-[#64748B] text-[10px]">Settled</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Grant Request Form */}
        <div className="lg:col-span-4 bg-[#151D2A] border border-[#2E3A4E] p-5 sm:p-6 rounded-xs space-y-4">
          <h3 className="text-xs font-mono text-[#C5A880] uppercase tracking-wider font-bold flex items-center gap-1.5 border-b border-[#2E3A4E]/60 pb-3">
            <Landmark className="h-4 w-4 text-[#C5A880]" /> Initiate Request
          </h3>

          <form onSubmit={handleRequest} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono text-[#94A3B8] uppercase tracking-wider">County / Region</label>
              <select
                value={reqRegion}
                onChange={(e) => setReqRegion(e.target.value)}
                className="w-full px-3 py-2 bg-[#0B111E] border border-[#2E3A4E] text-[#E2E8F0] text-xs font-sans focus:outline-none focus:border-[#C5A880] rounded-xs"
              >
                <option value="Garissa County">Garissa County</option>
                <option value="Tana River Basin">Tana River Basin</option>
                <option value="Wajir County">Wajir County</option>
                <option value="Mandera County">Mandera County</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono text-[#94A3B8] uppercase tracking-wider">Mitigation Category</label>
              <select
                value={reqCategory}
                onChange={(e) => setReqCategory(e.target.value)}
                className="w-full px-3 py-2 bg-[#0B111E] border border-[#2E3A4E] text-[#E2E8F0] text-xs font-sans focus:outline-none focus:border-[#C5A880] rounded-xs"
              >
                <option value="Medical Triage Kit">Medical Triage Kit</option>
                <option value="Emergency Evacuation Bus Line">Emergency Evacuation Bus Line</option>
                <option value="Food & Ration Supplies">Food & Ration Supplies</option>
                <option value="River Gauge Sensor Nodes">River Gauge Sensor Nodes</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono text-[#94A3B8] uppercase tracking-wider">Requested Budget Amount (USD)</label>
              <input
                type="number"
                value={reqAmount}
                onChange={(e) => setReqAmount(e.target.value)}
                placeholder="250000"
                className="w-full px-3 py-2 bg-[#0B111E] border border-[#2E3A4E] text-[#E2E8F0] text-xs font-sans focus:outline-none focus:border-[#C5A880] rounded-xs placeholder:text-[#64748B]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#C5A880] hover:bg-[#D4B992] text-[#0B111E] text-xs font-mono font-bold uppercase tracking-wider py-3 rounded-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="h-4 w-4" />
              <span>Queue Funding Request</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
