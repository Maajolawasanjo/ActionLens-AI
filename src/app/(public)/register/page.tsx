"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Shield, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2 
} from "lucide-react";

const ROLE_OPTIONS = [
  { id: "government", name: "Government Official" },
  { id: "ngo", name: "NGO Humanitarian Lead" },
  { id: "responder", name: "First Responder" },
  { id: "farmer", name: "Agro-Agent / Farmer" },
  { id: "health_worker", name: "Public Health Worker" },
  { id: "citizen", name: "Citizen / Resident" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState("government");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password || !confirmPassword || !role) {
      setError("Please complete all required fields.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          email: email.trim().toLowerCase(),
          password: password,
          role: role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed. Please check your details.");
      }

      localStorage.setItem("actionlens_user_role", role);
      document.cookie = `actionlens_demo_user=true; path=/; max-age=86400`;

      router.push("/onboarding");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during account creation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#0B111E] text-[#E2E8F0] p-6 selection:bg-gold/20 selection:text-gold animate-fade-in">
      
      {/* Brand Header */}
      <div className="mb-6 text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xs bg-gold/15 border border-gold/40 flex items-center justify-center">
            <img src="/app-icon.png" alt="AL" className="h-4.5 w-4.5 object-contain" />
          </div>
          <span className="font-editorial text-2xl font-bold tracking-tight text-text-primary">
            ActionLens <span className="text-gold font-sans text-xs tracking-widest uppercase">AI</span>
          </span>
        </Link>
        <p className="text-xs font-mono text-text-secondary uppercase tracking-widest">
          IGAD Decision Intelligence Platform
        </p>
      </div>

      {/* Back to Home Button */}
      <Link href="/" className="mb-4 inline-flex items-center gap-1.5 text-xs font-mono text-[#94A3B8] hover:text-[#E2E8F0] transition-colors cursor-pointer">
        ← Back to Home
      </Link>

      <div className="w-full max-w-md editorial-card p-8 sm:p-10 rounded-xs space-y-6">
        <div className="text-center space-y-1.5 border-b border-border/80 pb-6">
          <h1 className="font-editorial text-3xl font-normal text-text-primary tracking-tight">
            Create Account
          </h1>
          <p className="text-xs text-text-secondary font-sans leading-relaxed">
            Initialize your role-based early warning command credentials
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-mono text-text-secondary uppercase tracking-widest">Full Name</label>
            <input 
              type="text" 
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 bg-surface-alt/40 border border-border text-text-primary placeholder:text-text-placeholder text-xs font-sans focus:outline-none focus:border-gold transition-colors rounded-xs"
              placeholder="e.g. Director Jane Doe"
            />
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-mono text-text-secondary uppercase tracking-widest">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-surface-alt/40 border border-border text-text-primary placeholder:text-text-placeholder text-xs font-sans focus:outline-none focus:border-gold transition-colors rounded-xs"
              placeholder="name@icpac.int"
            />
          </div>

          {/* Stakeholder Role Dropdown */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-mono text-text-secondary uppercase tracking-widest">Stakeholder Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 bg-[#151D2A] border border-border text-text-primary text-xs font-sans focus:outline-none focus:border-gold transition-colors rounded-xs"
            >
              {ROLE_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.name}
                </option>
              ))}
            </select>
            <p className="text-[10px] text-text-secondary font-sans leading-normal">
              You will refine this and configure your regional focus in the next onboarding step.
            </p>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-mono text-text-secondary uppercase tracking-widest">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-11 bg-surface-alt/40 border border-border text-text-primary placeholder:text-text-placeholder text-xs font-sans focus:outline-none focus:border-gold transition-colors rounded-xs"
                placeholder="At least 8 characters"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setShowPassword(!showPassword);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-gold transition-colors cursor-pointer z-20 p-1"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-mono text-text-secondary uppercase tracking-widest">Confirm Password</label>
            <div className="relative">
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 pr-11 bg-surface-alt/40 border border-border text-text-primary placeholder:text-text-placeholder text-xs font-sans focus:outline-none focus:border-gold transition-colors rounded-xs"
                placeholder="Confirm password"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setShowConfirmPassword(!showConfirmPassword);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-gold transition-colors cursor-pointer z-20 p-1"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-severe/15 border border-severe/40 p-3.5 rounded-xs flex items-start gap-2.5 text-xs text-text-primary">
              <AlertCircle className="h-4 w-4 text-severe shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-2">
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full text-xs font-bold uppercase tracking-widest text-background bg-gold hover:bg-gold-hover transition-all py-3.5 rounded-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
            >
              <span>{loading ? "Creating Account..." : "Create Account & Continue"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>

        <p className="text-center text-xs text-text-secondary font-sans border-t border-border/80 pt-4">
          Already registered?{' '}
          <Link href="/login" className="text-gold hover:underline font-medium">
            Sign in here
          </Link>
        </p>
      </div>

    </div>
  );
}
