"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Building2, Globe, Shield, HeartPulse, Sprout, User,
  ArrowRight, ArrowLeft, MapPin, Bell, CheckCircle2,
  CloudRain, Flame, Wind
} from "lucide-react";
import { cn } from "@/utils/cn";

type Step = "welcome" | "role" | "location" | "interests" | "complete";

const roles = [
  { id: "government", label: "Government Official", icon: Building2, desc: "Policy, crisis directives & disaster management" },
  { id: "ngo", label: "NGO / Humanitarian Lead", icon: Globe, desc: "Relief logistics & community shelter support" },
  { id: "responder", label: "Emergency Responder", icon: Shield, desc: "First response, field triage & rescue operations" },
  { id: "health_worker", label: "Health Worker", icon: HeartPulse, desc: "Vector surveillance, medical triage & outbreak control" },
  { id: "farmer", label: "Agro-Agent / Farmer", icon: Sprout, desc: "Crop protection, flood mitigation & food security" },
  { id: "citizen", label: "Citizen / Resident", icon: User, desc: "Localized safety alerts & field report submission" },
];

const risks = [
  { id: "flood", label: "Flooding & Inundation", icon: CloudRain },
  { id: "drought", label: "Drought & Water Stress", icon: Flame },
  { id: "storm", label: "Severe Cyclones & Storms", icon: Wind },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("welcome");
  
  const [role, setRole] = useState("government");
  const [country, setCountry] = useState("Kenya");
  const [region, setRegion] = useState("Tana River");
  const [selectedRisks, setSelectedRisks] = useState<string[]>(["flood", "drought"]);
  const [smsAlerts, setSmsAlerts] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedRole = localStorage.getItem("actionlens_user_role");
    if (savedRole) {
      setRole(savedRole);
    }
  }, []);

  const handleComplete = async () => {
    setIsLoading(true);

    try {
      await fetch("/api/user/onboarding", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: role,
          country: country,
          region: region,
          interests: selectedRisks,
          notification_sms: smsAlerts,
          notification_email: true,
        }),
      });

      localStorage.setItem("actionlens_user_role", role);
      localStorage.setItem("actionlens_user_region", region);

      router.push("/dashboard");
    } catch {
      localStorage.setItem("actionlens_user_role", role);
      router.push("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B111E] text-[#E2E8F0] flex flex-col justify-center items-center p-4 sm:p-6 selection:bg-gold/20 selection:text-gold">
      
      {/* Brand Strip */}
      <div className="mb-6 text-center space-y-1">
        <span className="font-editorial text-2xl font-bold tracking-tight text-text-primary">
          ActionLens <span className="text-gold font-sans text-xs tracking-widest uppercase">AI</span>
        </span>
        <p className="text-[10px] font-mono text-text-secondary uppercase tracking-widest">
          Stakeholder Profile Configuration
        </p>
      </div>

      <div className="w-full max-w-xl editorial-card p-4 sm:p-10 rounded-xs space-y-6">
        
        {/* Welcome */}
        {step === "welcome" && (
          <div className="text-center space-y-6 py-4">
            <div className="h-14 w-14 rounded-xs bg-gold/10 border border-gold/40 flex items-center justify-center mx-auto">
              <Globe className="h-7 w-7 text-gold" />
            </div>

            <div className="space-y-2 border-b border-border/80 pb-6">
              <h1 className="font-editorial text-2xl sm:text-3xl font-normal text-text-primary leading-tight">
                Welcome to ActionLens AI
              </h1>
              <p className="text-xs text-text-secondary font-sans leading-relaxed">
                Configure your jurisdiction and operational focus so AI early warning recommendations match your exact decision requirements.
              </p>
            </div>

            <div className="pt-2">
              <button 
                onClick={() => setStep("role")}
                className="w-full text-xs font-bold uppercase tracking-widest text-background bg-gold hover:bg-gold-hover transition-all py-3.5 rounded-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Initialize Platform Profile</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Role Step */}
        {step === "role" && (
          <div className="space-y-6">
            <div className="space-y-1 border-b border-border/80 pb-4">
              <span className="text-[10px] font-mono text-gold uppercase tracking-widest">Step 1 of 3</span>
              <h2 className="font-editorial text-2xl font-normal text-text-primary">Primary Stakeholder Role</h2>
              <p className="text-xs text-text-secondary font-sans">Determines the type of tactical directives generated by the AI Decision Engine.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {roles.map((r) => (
                <div
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  className={cn(
                    "p-3 rounded-xs border text-left transition-all cursor-pointer flex items-start gap-3 select-none",
                    role === r.id 
                      ? "border-gold bg-gold/10" 
                      : "border-border bg-surface-alt/20 hover:border-border-focus"
                  )}
                >
                  <div className={cn(
                    "p-1.5 rounded-xs shrink-0 mt-0.5",
                    role === r.id ? "bg-gold text-background" : "bg-surface text-text-muted border border-border"
                  )}>
                    <r.icon className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className={cn("text-xs font-bold font-sans", role === r.id ? "text-gold" : "text-text-primary")}>
                      {r.label}
                    </p>
                    <p className="text-[10px] text-text-secondary mt-0.5 line-clamp-1 font-sans">{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-4 border-t border-border/80">
              <button 
                onClick={() => setStep("welcome")}
                className="text-xs font-mono text-text-secondary hover:text-text-primary flex items-center gap-1.5"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </button>
              <button 
                onClick={() => setStep("location")}
                className="text-xs font-bold uppercase tracking-widest text-background bg-gold hover:bg-gold-hover px-5 py-2.5 rounded-xs flex items-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Location Step */}
        {step === "location" && (
          <div className="space-y-6">
            <div className="space-y-1 border-b border-border/80 pb-4">
              <span className="text-[10px] font-mono text-gold uppercase tracking-widest">Step 2 of 3</span>
              <h2 className="font-editorial text-2xl font-normal text-text-primary">Jurisdiction & Location</h2>
              <p className="text-xs text-text-secondary font-sans">We monitor environmental telemetry and GIS risk feeds for your specific region.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono text-text-secondary uppercase tracking-widest">Country</label>
                <input 
                  type="text" 
                  value={country} 
                  onChange={(e) => setCountry(e.target.value)} 
                  className="w-full px-4 py-3 bg-surface-alt/40 border border-border text-text-primary text-xs font-sans focus:outline-none focus:border-gold rounded-xs"
                  placeholder="e.g. Kenya"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono text-text-secondary uppercase tracking-widest">Region / District</label>
                <input 
                  type="text" 
                  value={region} 
                  onChange={(e) => setRegion(e.target.value)} 
                  className="w-full px-4 py-3 bg-surface-alt/40 border border-border text-text-primary text-xs font-sans focus:outline-none focus:border-gold rounded-xs"
                  placeholder="e.g. Tana River"
                />
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-border/80">
              <button 
                onClick={() => setStep("role")}
                className="text-xs font-mono text-text-secondary hover:text-text-primary flex items-center gap-1.5"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </button>
              <button 
                onClick={() => setStep("interests")}
                disabled={!country || !region}
                className="text-xs font-bold uppercase tracking-widest text-background bg-gold hover:bg-gold-hover px-5 py-2.5 rounded-xs flex items-center gap-2 disabled:opacity-50"
              >
                <span>Continue</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Interests Step */}
        {step === "interests" && (
          <div className="space-y-6">
            <div className="space-y-1 border-b border-border/80 pb-4">
              <span className="text-[10px] font-mono text-gold uppercase tracking-widest">Step 3 of 3</span>
              <h2 className="font-editorial text-2xl font-normal text-text-primary">Primary Hazard Focus</h2>
              <p className="text-xs text-text-secondary font-sans">Select the disaster hazards to monitor closely.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {risks.map((r) => {
                const isSelected = selectedRisks.includes(r.id);
                return (
                  <div
                    key={r.id}
                    onClick={() => {
                      if (isSelected) setSelectedRisks(selectedRisks.filter(id => id !== r.id));
                      else setSelectedRisks([...selectedRisks, r.id]);
                    }}
                    className={cn(
                      "p-4 rounded-xs border text-center cursor-pointer transition-all flex flex-col items-center gap-2 select-none",
                      isSelected ? "border-gold bg-gold/10" : "border-border bg-surface-alt/20 hover:border-border-focus"
                    )}
                  >
                    <r.icon className={cn("h-5 w-5", isSelected ? "text-gold" : "text-text-muted")} />
                    <span className={cn("text-xs font-bold font-sans", isSelected ? "text-gold" : "text-text-primary")}>
                      {r.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between pt-4 border-t border-border/80">
              <button 
                onClick={() => setStep("location")}
                className="text-xs font-mono text-text-secondary hover:text-text-primary flex items-center gap-1.5"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </button>
              <button 
                onClick={() => setStep("complete")}
                disabled={selectedRisks.length === 0}
                className="text-xs font-bold uppercase tracking-widest text-background bg-gold hover:bg-gold-hover px-5 py-2.5 rounded-xs flex items-center gap-2 disabled:opacity-50"
              >
                <span>Complete Setup</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Complete Step */}
        {step === "complete" && (
          <div className="text-center space-y-6 py-4">
            <div className="h-14 w-14 rounded-xs bg-gold/10 border border-gold/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-7 w-7 text-gold" />
            </div>

            <div className="space-y-2 border-b border-border/80 pb-6">
              <h2 className="font-editorial text-2xl sm:text-3xl font-normal text-text-primary leading-tight">
                Configuration Complete
              </h2>
              <p className="text-xs text-text-secondary font-sans leading-relaxed">
                Your early warning dashboard is configured for <strong className="text-text-primary">{region}, {country}</strong>.
              </p>
            </div>

            <button 
              onClick={handleComplete}
              disabled={isLoading}
              className="w-full text-xs font-bold uppercase tracking-widest text-background bg-gold hover:bg-gold-hover transition-all py-3.5 rounded-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
            >
              <span>{isLoading ? "Finalizing Configuration..." : "Access Stakeholder Dashboard"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
