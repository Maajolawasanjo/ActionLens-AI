"use client";

import { useState } from "react";
import { Settings, Shield, Edit3, Plus, Database, AlertCircle, Play, CheckCircle, Users, BarChart3, Clock, Lock, Power } from "lucide-react";
import { DEMO_RESOURCE_DOCUMENTS } from "@/lib/demoSeedData";

interface AdminTabProps {
  role: string;
}

export default function AdminTab({ role }: AdminTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<string>("overview");

  // Prompts registry states
  const [prompts, setPrompts] = useState([
    { id: "p1", name: "Vision Verification System Prompt", model: "gpt-4o", text: "You are ActionLens Vision AI — a disaster image verification specialist. Analyse submitted community hazard images to verify authenticity..." },
    { id: "p2", name: "RAG Assistant Policy Prompt", model: "gpt-4o", text: "You are ActionLens RAG Assistant. Ground your responses strictly in the provided NDMA and ICPAC policies. Cite sources accurately..." },
    { id: "p3", name: "Consequence Simulator Calculation Prompt", model: "gpt-4o-mini", text: "Given historical weather records and delay curves, compute projected casualties and losses in JSON format..." },
  ]);

  // Documents registry states
  const [docs, setDocs] = useState(DEMO_RESOURCE_DOCUMENTS);

  // Prompt edit states
  const [editingPromptId, setEditingPromptId] = useState<string | null>(null);
  const [editingPromptText, setEditingPromptText] = useState("");

  const [logs, setLogs] = useState([
    { time: "10:52:14", event: "Admin modified prompt 'Vision Verification System Prompt'", user: "Admin #1" },
    { time: "10:48:12", event: "FastAPI Vector Embeddings Pipeline Sync complete", user: "System" },
    { time: "10:45:01", event: "Flushed RAG context cache", user: "Admin #1" },
    { time: "10:14:22", event: "Supabase table backups initialized", user: "System" },
  ]);

  const [usersList, setUsersList] = useState([
    { email: "maajolawasanjo@gmail.com", role: "government", status: "Active", created: "2026-07-30" },
    { email: "aisha.nur@redcross.org", role: "responder", status: "Active", created: "2026-07-29" },
    { email: "johndoe@citizen.org", role: "citizen", status: "Active", created: "2026-07-29" },
    { email: "jibril.ibrahim@wfp.org", role: "ngo", status: "Active", created: "2026-07-28" },
  ]);

  const [settings, setSettings] = useState({
    openaiKey: "sk-proj-••••••••••••••••",
    rateLimit: 100,
    maintenanceMode: false,
  });

  const [notification, setNotification] = useState<string | null>(null);

  const handleEditPrompt = (id: string, text: string) => {
    setEditingPromptId(id);
    setEditingPromptText(text);
  };

  const handleSavePrompt = (id: string) => {
    setPrompts(prompts.map(p => p.id === id ? { ...p, text: editingPromptText } : p));
    setEditingPromptId(null);
    setLogs([{ time: new Date().toLocaleTimeString(), event: `Modified prompt template '${prompts.find(p => p.id === id)?.name}'`, user: "Admin #1" }, ...logs]);
    setNotification("Prompt updated successfully.");
    setTimeout(() => setNotification(null), 3000);
  };

  const toggleUserStatus = (email: string) => {
    setUsersList(prev => prev.map(u => u.email === email ? { ...u, status: u.status === "Active" ? "Suspended" : "Active" } : u));
    setLogs([{ time: new Date().toLocaleTimeString(), event: `Toggled status for user ${email}`, user: "Admin #1" }, ...logs]);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-[#2E3A4E] pb-5">
        <div>
          <span className="text-[10px] font-mono text-[#C5A880] uppercase tracking-widest block font-bold">
            Administrator Core Portal
          </span>
          <h2 className="font-editorial text-xl sm:text-2xl text-[#E2E8F0] mt-1">
            System Control & Configuration
          </h2>
          <p className="text-xs text-[#94A3B8] font-sans">
            Oversee model parameters, prompt templates, RAG document registries, and operational token metrics.
          </p>
        </div>
        <span className="text-[9px] font-mono font-bold bg-[#EF4444]/20 text-[#EF4444] py-1 px-3 border border-[#EF4444]/30 rounded-xs uppercase">
          SECURE MODE
        </span>
      </div>

      {notification && (
        <div className="bg-[#2E7D5B]/15 border border-[#2E7D5B]/40 p-3 rounded-xs text-xs text-[#E2E8F0] font-mono">
          ✓ {notification}
        </div>
      )}

      {/* Sub tabs navigation */}
      <div className="flex flex-wrap gap-2 border-b border-[#2E3A4E]/60 pb-3 text-xs font-mono">
        {[
          { id: "overview", label: "Overview" },
          { id: "users", label: "Users" },
          { id: "prompts", label: "Prompts" },
          { id: "rag", label: "RAG Docs" },
          { id: "logs", label: "Logs" },
          { id: "settings", label: "Settings" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`px-3 py-1.5 rounded-xs transition-colors cursor-pointer border ${
              activeSubTab === tab.id
                ? "bg-[#151D2A] text-[#C5A880] border-[#C5A880]/60 font-bold"
                : "border-transparent text-[#94A3B8] hover:text-[#E2E8F0]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sub tab contents */}
      {activeSubTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#151D2A] border border-[#2E3A4E] p-4 rounded-xs">
              <span className="text-[9px] font-mono text-[#94A3B8] uppercase block">Today's AI Tokens</span>
              <span className="text-xl font-mono font-bold text-[#E2E8F0] block mt-1">428,500</span>
            </div>
            <div className="bg-[#151D2A] border border-[#2E3A4E] p-4 rounded-xs">
              <span className="text-[9px] font-mono text-[#94A3B8] uppercase block">AI Pipeline Cost</span>
              <span className="text-xl font-mono font-bold text-[#C5A880] block mt-1">$8.57 USD</span>
            </div>
            <div className="bg-[#151D2A] border border-[#2E3A4E] p-4 rounded-xs">
              <span className="text-[9px] font-mono text-[#94A3B8] uppercase block">Cache Hit Rate</span>
              <span className="text-xl font-mono font-bold text-[#10B981] block mt-1">94.2%</span>
            </div>
          </div>

          <div className="bg-[#151D2A] border border-[#2E3A4E] p-5 rounded-xs space-y-3">
            <h3 className="text-xs font-mono text-[#C5A880] uppercase tracking-wider font-bold">RAG Accuracy Metrics</h3>
            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3 bg-[#0B111E] rounded-xs border border-[#2E3A4E]/40">
                <span className="block text-[#94A3B8] text-[9px] uppercase">Similarity Threshold:</span>
                <span className="text-xl text-[#E2E8F0] font-bold">0.82 cosine</span>
              </div>
              <div className="p-3 bg-[#0B111E] rounded-xs border border-[#2E3A4E]/40">
                <span className="block text-[#94A3B8] text-[9px] uppercase">Embedding Failures:</span>
                <span className="text-xl text-[#EF4444] font-bold">0</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === "users" && (
        <div className="bg-[#151D2A] border border-[#2E3A4E] rounded-xs overflow-hidden">
          <table className="w-full text-left text-xs font-sans text-[#E2E8F0]">
            <thead>
              <tr className="border-b border-[#2E3A4E]/60 text-[10px] font-mono text-[#94A3B8] uppercase bg-[#1C2635]/40">
                <th className="p-4">User Email</th>
                <th className="p-4">Default Role</th>
                <th className="p-4">Date Registered</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2E3A4E]/40 font-mono">
              {usersList.map((u) => (
                <tr key={u.email} className="hover:bg-[#1C2635]/25 transition-colors">
                  <td className="p-4 font-sans font-medium text-[#E2E8F0]">{u.email}</td>
                  <td className="p-4 uppercase">{u.role}</td>
                  <td className="p-4">{u.created}</td>
                  <td className="p-4">
                    <span className={u.status === "Active" ? "text-[#10B981]" : "text-[#EF4444]"}>
                      {u.status}
                    </span>
                  </td>
                  <td className="p-4 text-right font-sans">
                    <button
                      onClick={() => toggleUserStatus(u.email)}
                      className="bg-[#1C2635] hover:bg-[#C5A880] hover:text-[#0B111E] px-2.5 py-1 rounded-xs transition-colors cursor-pointer text-[10px] font-mono"
                    >
                      {u.status === "Active" ? "Suspend" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeSubTab === "prompts" && (
        <div className="space-y-4">
          {prompts.map((p) => (
            <div key={p.id} className="bg-[#151D2A] border border-[#2E3A4E] p-4 rounded-xs space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xs font-mono font-bold text-[#E2E8F0]">{p.name}</span>
                  <span className="text-[8px] font-mono text-[#94A3B8] uppercase block mt-0.5">Model: {p.model}</span>
                </div>
                {editingPromptId !== p.id ? (
                  <button 
                    onClick={() => handleEditPrompt(p.id, p.text)}
                    className="bg-[#2E3A4E] hover:bg-[#C5A880] text-[#E2E8F0] hover:text-[#0B111E] text-[9px] font-mono font-bold uppercase tracking-wider py-1.5 px-3 rounded-xs transition-colors cursor-pointer"
                  >
                    Edit
                  </button>
                ) : (
                  <button 
                    onClick={() => handleSavePrompt(p.id)}
                    className="bg-[#2E7D5B] hover:bg-[#2E7D5B]/80 text-[#E2E8F0] text-[9px] font-mono font-bold uppercase tracking-wider py-1.5 px-3 rounded-xs transition-colors cursor-pointer"
                  >
                    Save
                  </button>
                )}
              </div>

              {editingPromptId === p.id ? (
                <textarea 
                  value={editingPromptText}
                  onChange={(e) => setEditingPromptText(e.target.value)}
                  rows={4}
                  className="w-full bg-[#151D2A] border border-[#C5A880] text-[#E2E8F0] px-3 py-2 text-xs font-mono rounded-xs focus:outline-none resize-none"
                />
              ) : (
                <p className="text-[11px] text-[#94A3B8] font-mono bg-[#0B111E] p-2.5 rounded-xs border border-[#2E3A4E]/30 truncate">
                  {p.text}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {activeSubTab === "rag" && (
        <div className="bg-[#151D2A] border border-[#2E3A4E] p-5 rounded-xs space-y-4">
          <div className="flex justify-between items-center border-b border-[#2E3A4E]/60 pb-3">
            <h3 className="text-xs font-mono text-[#C5A880] uppercase tracking-wider font-bold flex items-center gap-1.5">
              <Database className="h-4 w-4" /> RAG Policy Documents
            </h3>
            <button 
              onClick={() => alert("Upload document file to compute vector embeddings.")}
              className="bg-[#C5A880] hover:bg-[#D4B992] text-[#0B111E] text-[9px] font-mono font-bold uppercase tracking-wider py-1 px-3 rounded-xs flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Plus className="h-3 w-3" /> Add SOP Doc
            </button>
          </div>

          <div className="space-y-2.5">
            {docs.map((doc, idx) => (
              <div key={idx} className="bg-[#0B111E] border border-[#2E3A4E] p-3.5 rounded-xs flex justify-between items-center gap-4 text-xs">
                <div>
                  <span className="font-mono font-bold text-[#E2E8F0] block">{doc.title}</span>
                  <span className="text-[9px] font-mono text-[#94A3B8]">
                    Format: {doc.file_format} | Tokens: 4,200 | Chunking: 512 Overlap
                  </span>
                </div>
                <span className="text-[8px] font-mono font-bold bg-[#2E7D5B]/20 text-[#2E7D5B] border border-[#2E7D5B]/30 px-2 py-0.5 rounded-xs uppercase">
                  Indexed
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === "logs" && (
        <div className="bg-[#151D2A] border border-[#2E3A4E] p-5 rounded-xs space-y-4">
          <h3 className="text-xs font-mono text-[#C5A880] uppercase tracking-wider font-bold">Admin Activity Logs</h3>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {logs.map((l, i) => (
              <div key={i} className="text-[10px] font-mono text-[#94A3B8] border-b border-[#2E3A4E]/40 pb-2">
                <div className="flex justify-between items-center text-[8px]">
                  <span className="text-[#C5A880] font-bold">{l.time}</span>
                  <span className="text-[#64748B]">{l.user}</span>
                </div>
                <p className="text-[#E2E8F0] mt-1 leading-snug">{l.event}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === "settings" && (
        <div className="bg-[#151D2A] border border-[#2E3A4E] p-5 rounded-xs space-y-4">
          <h3 className="text-xs font-mono text-[#C5A880] uppercase tracking-wider font-bold">Platform Settings & Flags</h3>
          
          <div className="space-y-4 text-xs font-mono">
            <div className="space-y-1">
              <span className="block text-[#94A3B8] text-[9px] uppercase">OpenAI API Key Parameter:</span>
              <input
                type="text"
                value={settings.openaiKey}
                onChange={(e) => setSettings({ ...settings, openaiKey: e.target.value })}
                className="w-full bg-[#0B111E] border border-[#2E3A4E] text-[#E2E8F0] px-3 py-2 text-xs font-mono rounded-xs focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <span className="block text-[#94A3B8] text-[9px] uppercase">IP Client Rate Limit (req/min):</span>
              <input
                type="number"
                value={settings.rateLimit}
                onChange={(e) => setSettings({ ...settings, rateLimit: parseInt(e.target.value) || 0 })}
                className="w-full bg-[#0B111E] border border-[#2E3A4E] text-[#E2E8F0] px-3 py-2 text-xs font-mono rounded-xs focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-[#0B111E] border border-[#2E3A4E]/40 rounded-xs">
              <div>
                <span className="text-xs font-bold text-[#E2E8F0] block">Maintenance Mode Bypass</span>
                <span className="text-[9px] text-[#94A3B8] uppercase block mt-0.5">Toggle maintenance system banner</span>
              </div>
              <button
                onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                className={`h-8 w-16 border rounded-full p-1 transition-colors flex items-center cursor-pointer ${
                  settings.maintenanceMode ? "bg-[#EF4444] border-[#EF4444] justify-end" : "bg-[#1C2635] border-[#2E3A4E] justify-start"
                }`}
              >
                <span className="h-6 w-6 bg-[#E2E8F0] rounded-full shadow-xs block" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
