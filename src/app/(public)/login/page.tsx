"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password: password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invalid email or password.");
      }

      if (data?.data?.user?.role) {
        localStorage.setItem("actionlens_user_role", data.data.user.role);
      }
      document.cookie = `actionlens_demo_user=true; path=/; max-age=86400`;

      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#0B111E] text-[#E2E8F0] p-6 selection:bg-gold/20 selection:text-gold">
      
      {/* Brand Header */}
      <div className="mb-8 text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xs bg-gold/10 border border-gold/40 flex items-center justify-center">
            <Shield className="h-4.5 w-4.5 text-gold" />
          </div>
          <span className="font-editorial text-2xl font-bold tracking-tight text-text-primary">
            ActionLens <span className="text-gold font-sans text-xs tracking-widest uppercase">AI</span>
          </span>
        </Link>
        <p className="text-xs font-mono text-text-secondary uppercase tracking-widest">
          IGAD Early Warning Command
        </p>
      </div>

      <div className="w-full max-w-md editorial-card p-8 sm:p-10 rounded-xs space-y-6">
        <div className="text-center space-y-1.5 border-b border-border/80 pb-6">
          <h1 className="font-editorial text-3xl font-normal text-text-primary tracking-tight">
            Sign In to ActionLens
          </h1>
          <p className="text-xs text-text-secondary font-sans leading-relaxed">
            Enter your credentials to access your stakeholder command view
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-mono text-text-secondary uppercase tracking-widest">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-surface-alt/40 border border-border text-text-primary placeholder:text-text-placeholder text-xs font-sans focus:outline-none focus:border-gold transition-colors rounded-xs"
              placeholder="official@ndma.go.ke"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="block text-[11px] font-mono text-text-secondary uppercase tracking-widest">Password</label>
              <Link href="/forgot-password" className="text-[11px] font-mono text-gold hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-11 bg-surface-alt/40 border border-border text-text-primary placeholder:text-text-placeholder text-xs font-sans focus:outline-none focus:border-gold transition-colors rounded-xs"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowPassword(!showPassword);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-gold transition-colors cursor-pointer z-20 p-1"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

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
              <span>{loading ? "Authenticating..." : "Sign In to Dashboard"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>

        <p className="text-center text-xs text-text-secondary font-sans border-t border-border/80 pt-4">
          Need an account?{' '}
          <Link href="/register" className="text-gold hover:underline font-medium">
            Initialize credentials
          </Link>
        </p>
      </div>

    </div>
  );
}
