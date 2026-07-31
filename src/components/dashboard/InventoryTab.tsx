"use client";

import { useState } from "react";
import { Database, AlertTriangle, CheckCircle, Package } from "lucide-react";

export default function InventoryTab() {
  const [items, setItems] = useState([
    { id: "INV-001", name: "High-Calorie Food Packs", stock: 8500, minStock: 2000, unit: "Packs", expiry: "2027-12" },
    { id: "INV-002", name: "Clean Water Containers", stock: 1200, minStock: 3000, unit: "Liters", expiry: "2026-10" },
    { id: "INV-003", name: "Medical Trauma Kits", stock: 450, minStock: 200, unit: "Kits", expiry: "2026-09" },
    { id: "INV-004", name: "Wool Survival Blankets", stock: 380, minStock: 1000, unit: "Blankets", expiry: "N/A" },
    { id: "INV-005", name: "Diesel Fuel Barrels", stock: 65, minStock: 50, unit: "Barrels", expiry: "N/A" },
  ]);

  const restockItem = (id: string, amount: number) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, stock: item.stock + amount } : item));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <span className="text-[10px] font-mono text-[#C5A880] uppercase tracking-widest block font-bold">
          Emergency Supplies
        </span>
        <h2 className="font-editorial text-xl sm:text-2xl text-[#E2E8F0] mt-1">
          Warehouse Inventory Registry
        </h2>
        <p className="text-xs text-[#94A3B8] font-sans">
          Audit logistics store stocks, monitor supply thresholds, and coordinate restock requests.
        </p>
      </div>

      <div className="bg-[#151D2A] border border-[#2E3A4E] rounded-xs overflow-hidden">
        <div className="p-4 border-b border-[#2E3A4E] flex justify-between items-center bg-[#1C2635]/40">
          <span className="text-xs font-mono text-[#C5A880] uppercase font-bold">Warehouse Supply Ledger</span>
          <span className="text-[9px] font-mono text-[#94A3B8]">Stock Monitoring Node</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans text-[#E2E8F0] border-collapse">
            <thead>
              <tr className="border-b border-[#2E3A4E]/60 text-[10px] font-mono text-[#94A3B8] uppercase">
                <th className="p-4">SKU</th>
                <th className="p-4">Item Name</th>
                <th className="p-4">Available Stock</th>
                <th className="p-4">Critical Threshold</th>
                <th className="p-4">Expiration Code</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2E3A4E]/40 font-mono">
              {items.map((item) => {
                const isCritical = item.stock < item.minStock;
                return (
                  <tr key={item.id} className="hover:bg-[#1C2635]/25 transition-colors">
                    <td className="p-4 text-[#C5A880] font-bold">{item.id}</td>
                    <td className="p-4 font-sans font-medium text-[#E2E8F0]">{item.name}</td>
                    <td className="p-4 font-bold">{item.stock.toLocaleString()} {item.unit}</td>
                    <td className="p-4 text-[#94A3B8]">{item.minStock.toLocaleString()} {item.unit}</td>
                    <td className="p-4">{item.expiry}</td>
                    <td className="p-4">
                      {isCritical ? (
                        <span className="text-[#EF4444] font-bold flex items-center gap-1">
                          <AlertTriangle className="h-4 w-4" /> LOW STOCK
                        </span>
                      ) : (
                        <span className="text-[#10B981] font-bold flex items-center gap-1">
                          <CheckCircle className="h-4 w-4" /> SECURE
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right font-sans">
                      <button
                        onClick={() => restockItem(item.id, 500)}
                        className="bg-[#C5A880]/15 hover:bg-[#C5A880] hover:text-[#0B111E] text-[#C5A880] border border-[#C5A880]/40 px-2.5 py-1 rounded-xs transition-colors cursor-pointer text-[10px] font-mono"
                      >
                        +500 Restock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
