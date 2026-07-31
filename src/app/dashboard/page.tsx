"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Home, Map, AlertTriangle, MessageSquare, Cpu, 
  Database, BarChart3, User, Settings, 
  Menu, X, Radio, Clock, Truck, Landmark, FileText, Users, Shield
} from "lucide-react";

// Import modular dashboard tabs
import HomeTab from "@/components/dashboard/HomeTab";
import MapTab from "@/components/dashboard/MapTab";
import AlertsTab from "@/components/dashboard/AlertsTab";
import CommunityTab from "@/components/dashboard/CommunityTab";
import AssistantTab from "@/components/dashboard/AssistantTab";
import ResourcesTab from "@/components/dashboard/ResourcesTab";
import AnalyticsTab from "@/components/dashboard/AnalyticsTab";
import AdminTab from "@/components/dashboard/AdminTab";
import ProfileTab from "@/components/dashboard/ProfileTab";

// Role-specific tabs
import PreparednessTab from "@/components/dashboard/PreparednessTab";
import ActiveIncidentsTab from "@/components/dashboard/ActiveIncidentsTab";
import DispatchTab from "@/components/dashboard/DispatchTab";
import FundingTab from "@/components/dashboard/FundingTab";
import ReportsTab from "@/components/dashboard/ReportsTab";
import SheltersTab from "@/components/dashboard/SheltersTab";
import AidDistributionTab from "@/components/dashboard/AidDistributionTab";
import VolunteersTab from "@/components/dashboard/VolunteersTab";
import InventoryTab from "@/components/dashboard/InventoryTab";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [selectedPersona, setSelectedPersona] = useState<string>("government");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRealtimeActive, setIsRealtimeActive] = useState(false);
  const [userName, setUserName] = useState("Officer");
  const [loading, setLoading] = useState(true);

  // Fetch logged in profile details
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          window.location.href = "/login";
          return;
        }
        const data = await res.json();
        const user = data?.data?.user;
        if (user) {
          setUserName(user.full_name || "User");
          if (user.role) {
            setSelectedPersona(user.role);
          }
          setLoading(false);
        } else {
          window.location.href = "/login";
        }
      } catch (err) {
        console.warn("[Profile Load Notice]", err);
        window.location.href = "/login";
      }
    }
    loadProfile();
    setIsRealtimeActive(true);
  }, []);


  // Reset active tab to home overview whenever persona/role is loaded or resolved
  useEffect(() => {
    setActiveTab("home");
  }, [selectedPersona]);

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      localStorage.removeItem("actionlens_user_role");
      document.cookie = "actionlens_demo_user=; path=/; max-age=0";
      window.location.href = "/login";
    } catch (err) {
      console.error("[Logout Error]", err);
      window.location.href = "/login";
    }
  };

  // Define sidebar menu items based on active role
  const menuItems = (() => {
    switch (selectedPersona) {
      case "citizen":
        return [
          { id: "home", label: "Overview Home", icon: Home },
          { id: "community", label: "Community Reports", icon: MessageSquare },
          { id: "map", label: "Emergency Map", icon: Map },
          { id: "alerts", label: "Alerts Timeline", icon: AlertTriangle },
          { id: "preparedness", label: "Preparedness Kit", icon: Shield },
          { id: "assistant", label: "AI Safety Assistant", icon: Cpu },
          { id: "resources", label: "Nearby Resources", icon: Database },
          { id: "profile", label: "Profile & Settings", icon: User },
        ];
      case "responder":
        return [
          { id: "home", label: "Operations Home", icon: Home },
          { id: "incidents", label: "Active Incidents", icon: Clock },
          { id: "dispatch", label: "Dispatch Center", icon: Truck },
          { id: "map", label: "Operations Map", icon: Map },
          { id: "resources", label: "Tactical Resources", icon: Database },
          { id: "alerts", label: "Alerts & Outbox", icon: AlertTriangle },
          { id: "analytics", label: "Response Analytics", icon: BarChart3 },
          { id: "assistant", label: "AI Tactical Assistant", icon: Cpu },
        ];
      case "government":
        return [
          { id: "home", label: "Executive Home", icon: Home },
          { id: "map", label: "National Map", icon: Map },
          { id: "analytics", label: "Impact Simulator", icon: BarChart3 },
          { id: "funding", label: "Mitigation Budget", icon: Landmark },
          { id: "reports", label: "Executive Briefings", icon: FileText },
          { id: "assistant", label: "AI Policy Assistant", icon: Cpu },
        ];
      case "ngo":
        return [
          { id: "home", label: "NGO Overview", icon: Home },
          { id: "shelters", label: "Shelter Capacity", icon: Landmark },
          { id: "aid", label: "Aid Distribution", icon: Truck },
          { id: "volunteers", label: "Volunteer Roster", icon: Users },
          { id: "map", label: "Logistics Map", icon: Map },
          { id: "inventory", label: "Warehouse Supplies", icon: Database },
          { id: "reports", label: "Humanitarian Logs", icon: FileText },
          { id: "assistant", label: "AI Relief Assistant", icon: Cpu },
        ];
      case "admin":
      default:
        return [
          { id: "home", label: "Control Overview", icon: Home },
          { id: "admin", label: "Platform Settings", icon: Settings },
          { id: "map", label: "Telemetry Map", icon: Map },
          { id: "assistant", label: "AI Sandbox", icon: Cpu },
          { id: "profile", label: "Admin Profile", icon: User },
        ];
    }
  })();

  // Handle active navigation content render
  const renderTabContent = () => {
    switch (activeTab) {
      case "home":
        return <HomeTab role={selectedPersona} userName={userName} onNavigate={setActiveTab} />;
      case "map":
        return <MapTab role={selectedPersona} />;
      case "alerts":
        return <AlertsTab role={selectedPersona} />;
      case "community":
        return <CommunityTab role={selectedPersona} />;
      case "assistant":
        return <AssistantTab role={selectedPersona} />;
      case "resources":
        return <ResourcesTab role={selectedPersona} />;
      case "analytics":
        return <AnalyticsTab role={selectedPersona} />;
      case "profile":
        return <ProfileTab role={selectedPersona} userName={userName} />;
      case "admin":
        return <AdminTab role={selectedPersona} />;
      case "preparedness":
        return <PreparednessTab />;
      case "incidents":
        return <ActiveIncidentsTab />;
      case "dispatch":
        return <DispatchTab />;
      case "funding":
        return <FundingTab />;
      case "reports":
        return <ReportsTab />;
      case "shelters":
        return <SheltersTab />;
      case "aid":
        return <AidDistributionTab />;
      case "volunteers":
        return <VolunteersTab />;
      case "inventory":
        return <InventoryTab />;
      default:
        return <HomeTab role={selectedPersona} userName={userName} onNavigate={setActiveTab} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B111E] flex flex-col items-center justify-center text-xs font-mono text-[#94A3B8] gap-3">
        <span className="h-6 w-6 rounded-full border-2 border-[#C5A880] border-t-transparent animate-spin" />
        <span>Authenticating secure node session...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B111E] text-[#E2E8F0] font-sans flex flex-col">
      {/* ── TOP HEADER / NAV BAR ── */}
      <header className="sticky top-0 z-40 bg-[#0B111E]/95 backdrop-blur-md border-b border-[#2E3A4E] py-4 px-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="md:hidden text-[#94A3B8] hover:text-[#E2E8F0] p-1 cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          
          <Link href="/" className="flex items-center gap-2.5 group">
            <img src="/app-icon.png" alt="ActionLens" className="h-5 w-5 object-contain" />
            <span className="font-editorial text-lg tracking-tight font-medium group-hover:text-[#C5A880] transition-colors">
              Action<span className="text-[#C5A880]">Lens</span>
            </span>
          </Link>

          {/* Sync Status Badge */}
          <div className="hidden sm:flex items-center gap-1.5 bg-[#151D2A] border border-[#2E3A4E] py-1 px-2.5 rounded-full text-[9px] font-mono text-[#94A3B8]">
            <Radio className={`h-2.5 w-2.5 text-[#2E7D5B] ${isRealtimeActive ? "animate-pulse" : ""}`} />
            <span>REALTIME GRID SYNC</span>
          </div>
        </div>

        {/* Stakeholder Role Badge Indicator */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-[#151D2A] border border-[#2E3A4E] py-1.5 px-3 rounded-xs shrink-0">
            <span className="text-[9px] font-mono text-[#94A3B8] uppercase hidden md:inline">Stakeholder Node:</span>
            <span className="text-[#C5A880] text-xs font-mono font-bold uppercase">
              {selectedPersona === "citizen" && "Public Citizen"}
              {selectedPersona === "responder" && "First Responder"}
              {selectedPersona === "government" && "Government Leader"}
              {selectedPersona === "ngo" && "Humanitarian Org"}
              {selectedPersona === "admin" && "System Admin"}
            </span>
          </div>

          <button 
            onClick={handleSignOut}
            className="border border-[#8C2F2F]/40 hover:border-[#8C2F2F] text-[#94A3B8] hover:text-[#EF4444] text-[10px] font-mono font-bold uppercase tracking-wider py-2 px-3 rounded-xs transition-colors cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* ── CORE GRID LAYOUT ── */}
      <div className="flex-1 flex relative">
        
        {/* SIDEBAR NAVIGATION (Desktop) */}
        <aside className="hidden md:flex flex-col w-64 bg-[#0B111E] border-r border-[#2E3A4E] py-6 px-4 shrink-0 justify-between">
          <div className="space-y-6">
            <span className="text-[9px] font-mono text-[#64748B] uppercase tracking-widest block px-3">
              Core Applications
            </span>
            <nav className="space-y-1.5">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xs text-xs font-sans transition-all cursor-pointer ${
                      activeTab === item.id
                        ? "bg-[#151D2A] text-[#C5A880] font-bold border-l-2 border-[#C5A880]"
                        : "hover:bg-[#151D2A]/50 text-[#94A3B8] hover:text-[#E2E8F0]"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* User profile footer block */}
          <div className="border-t border-[#2E3A4E]/60 pt-4 px-3 flex items-center gap-3">
            <div className="h-8 w-8 bg-[#151D2A] border border-[#2E3A4E] rounded-xs flex items-center justify-center text-[#C5A880] font-bold font-mono">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="truncate">
              <span className="text-xs text-[#E2E8F0] font-medium block truncate">{userName}</span>
              <span className="text-[9px] font-mono text-[#94A3B8] uppercase block truncate">{selectedPersona} node</span>
            </div>
          </div>
        </aside>

        {/* SIDEBAR NAVIGATION (Mobile Overlay) */}
        {isMobileMenuOpen && (
          <div className="absolute inset-0 bg-[#0B111E]/95 z-30 flex flex-col w-64 border-r border-[#2E3A4E] py-6 px-4 animate-slideIn">
            <div className="space-y-6">
              <div className="flex justify-between items-center px-3 border-b border-[#2E3A4E]/60 pb-3">
                <span className="text-[9px] font-mono text-[#C5A880] uppercase tracking-widest block">
                  Console Menu
                </span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-[#94A3B8] hover:text-[#E2E8F0]">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <nav className="space-y-1.5">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xs text-xs font-sans transition-all cursor-pointer ${
                        activeTab === item.id
                          ? "bg-[#151D2A] text-[#C5A880] font-bold border-l-2 border-[#C5A880]"
                          : "hover:bg-[#151D2A]/50 text-[#94A3B8] hover:text-[#E2E8F0]"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        {/* MAIN PANEL CONTENT */}
        <main className="flex-1 p-6 sm:p-8 bg-[#0B111E] overflow-y-auto">
          {renderTabContent()}
        </main>

      </div>

      {/* FOOTER */}
      <footer className="w-full border-t border-[#2E3A4E] bg-[#0B111E] py-6 shrink-0">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-[#94A3B8]">
          <div className="flex items-center gap-2">
            <img src="/app-icon.png" alt="AL" className="h-4 w-4 object-contain" />
            <span>ActionLens Disaster Intelligence Grid • IGAD Evaluator Console</span>
          </div>
          <div>
            <span>Contact: maajolawasanjo@gmail.com</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
