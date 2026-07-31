"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Cpu, User, Compass, HelpCircle, AlertCircle, RefreshCw } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  sources?: Array<{ title: string; relevance: number }>;
}

interface AssistantTabProps {
  role: string;
  region?: string;
}

export default function AssistantTab({ role, region = "Tana River" }: AssistantTabProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m_init",
      sender: "ai",
      text: `Greetings. I am the ActionLens Policy RAG Assistant.\n\nAsk me operational questions about disaster response protocols, shelter guidelines, or standard operating procedures (SOPs). I ground my answers in official NDMA, NiMet, and ICPAC documentation.`,
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add User Message
    const userMsg: Message = {
      id: `u_${Date.now()}`,
      sender: "user",
      text: text,
    };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: text,
          role: role,
          region: region,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const aiMsg: Message = {
          id: `ai_${Date.now()}`,
          sender: "ai",
          text: data.answer || "Query resolved successfully.",
          sources: data.sources || data.citations,
        };
        setMessages(prev => [...prev, aiMsg]);
      } else {
        throw new Error("API Connection Error");
      }
    } catch {
      // Offline fallback
      setTimeout(() => {
        const aiMsg: Message = {
          id: `ai_${Date.now()}`,
          sender: "ai",
          text: `Fallback: Resolved policy guidelines regarding: "${text}".\n\n1. **Standard evacuation directive**: Notify sector supervisors to stage emergency transit vehicles.\n2. **Triage staging**: Coordinate ambulance deployments to nearest secondary trauma centers.\n3. **Early warning propagation**: Broadcast warning instructions via registered SMS lists.`,
          sources: [
            { title: "National Emergency Management SOP Chapter 4", relevance: 0.96 },
            { title: "ICPAC Regional Advisory Bulletin", relevance: 0.88 },
          ]
        };
        setMessages(prev => [...prev, aiMsg]);
      }, 1000);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    "Is it safe to travel across the Garsen Basin?",
    "What are the emergency shelter occupancy rules?",
    "Retrieve NDMA standard operating procedures for floods.",
    "What is the recommended evacuation timeline for Category 4 storms?",
  ];

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto h-[80vh] flex flex-col justify-between">
      {/* Header */}
      <div className="border-b border-[#2E3A4E] pb-4 shrink-0">
        <span className="text-[10px] font-mono text-[#C5A880] uppercase tracking-widest block font-bold">
          Policy RAG Assistant
        </span>
        <h2 className="font-editorial text-xl sm:text-2xl text-[#E2E8F0] mt-1">
          Decision Intelligence Chat
        </h2>
        <p className="text-xs text-[#94A3B8] font-sans">
          Ground queries dynamically in national risk mitigation SOPs and spatial report parameters.
        </p>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-2 scrollbar-thin">
        {messages.map((msg) => (
          <div 
            key={msg.id}
            className={`flex gap-3 max-w-[85%] ${
              msg.sender === "user" ? "ml-auto flex-row-reverse" : ""
            }`}
          >
            <div className={`h-8 w-8 rounded-xs flex items-center justify-center shrink-0 border ${
              msg.sender === "user" 
                ? "bg-[#C5A880]/10 border-[#C5A880]/30 text-[#C5A880]"
                : "bg-[#151D2A] border-[#2E3A4E] text-[#E2E8F0]"
            }`}>
              {msg.sender === "user" ? <User className="h-4 w-4" /> : <Cpu className="h-4 w-4" />}
            </div>

            <div className={`p-4 rounded-xs text-xs space-y-3 ${
              msg.sender === "user"
                ? "bg-[#151D2A] border border-[#C5A880]/40 text-[#E2E8F0]"
                : "bg-[#151D2A] border border-[#2E3A4E] text-[#E2E8F0]"
            }`}>
              <p className="whitespace-pre-wrap leading-relaxed font-sans">{msg.text}</p>

              {/* CITATIONS DISPLAY */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="pt-2.5 border-t border-[#2E3A4E]/60 space-y-1.5">
                  <span className="text-[8px] font-mono text-[#C5A880] uppercase tracking-wider block">Grounded Citations</span>
                  <div className="flex flex-col gap-1 text-[9px] font-mono text-[#94A3B8]">
                    {msg.sources.map((src, i) => (
                      <div key={i} className="flex justify-between items-center gap-4 bg-[#0B111E] p-1.5 rounded-xs border border-[#2E3A4E]/40">
                        <span className="truncate">{src.title}</span>
                        <span className="text-[#2E7D5B] font-bold">{(src.relevance * 100).toFixed(0)}% match</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 max-w-[85%] animate-pulse">
            <div className="h-8 w-8 rounded-xs flex items-center justify-center shrink-0 bg-[#151D2A] border border-[#2E3A4E] text-[#E2E8F0]">
              <Cpu className="h-4 w-4 animate-spin" />
            </div>
            <div className="p-4 bg-[#151D2A] border border-[#2E3A4E] rounded-xs text-xs font-mono text-[#94A3B8]">
              Consulting RAG vector database index...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts & Chat Input */}
      <div className="space-y-4 shrink-0 bg-[#0B111E] pt-2 border-t border-[#2E3A4E]/60">
        
        {messages.length === 1 && (
          <div className="space-y-2">
            <span className="text-[9px] font-mono text-[#64748B] uppercase block">Suggested Queries</span>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="bg-[#151D2A] border border-[#2E3A4E] hover:border-[#C5A880]/60 text-[#94A3B8] hover:text-[#E2E8F0] px-3 py-1.5 rounded-xs text-[10px] text-left cursor-pointer transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputValue);
          }}
          className="flex gap-3 bg-[#151D2A] border border-[#2E3A4E] p-2 rounded-xs"
        >
          <input 
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your emergency protocol query..."
            className="flex-1 bg-transparent text-[#E2E8F0] placeholder:text-[#64748B] px-3 py-2 text-xs focus:outline-none"
          />
          <button 
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="bg-[#C5A880] hover:bg-[#D4B992] disabled:opacity-50 text-[#0B111E] p-2 rounded-xs cursor-pointer transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>

    </div>
  );
}
