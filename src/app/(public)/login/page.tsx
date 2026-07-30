"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (fieldErrors.email && val.trim()) {
      setFieldErrors((prev) => ({ ...prev, email: undefined }));
    }
  };

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    if (fieldErrors.password && val) {
      setFieldErrors((prev) => ({ ...prev, password: undefined }));
    }
  };

  const validateForm = () => {
    const errors: typeof fieldErrors = {};
    const sanitizedEmail = email.trim().toLowerCase();

    if (!sanitizedEmail) {
      errors.email = "Email address is required.";
    }
    if (!password) {
      errors.password = "Password is required.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setFieldErrors({});
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
        setFieldErrors({ general: data.error || "Invalid email or password." });
        return;
      }

      if (data?.data?.user?.role) {
        localStorage.setItem("actionlens_user_role", data.data.user.role);
      }
      document.cookie = `actionlens_demo_user=true; path=/; max-age=86400`;

      const targetPath = data?.data?.user?.onboarding_complete === false ? "/onboarding" : "/dashboard";

      try {
        router.push(targetPath);
      } catch {
        window.location.href = targetPath;
      }
    } catch {
      setFieldErrors({ general: "Invalid email or password." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#0B111E] text-[#E2E8F0] p-4 sm:p-6 selection:bg-[#C5A880]/20 selection:text-[#C5A880]">
      
      {/* Brand Header */}
      <div className="mb-8 text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xs bg-[#C5A880]/15 border border-[#C5A880]/40 flex items-center justify-center">
            <img src="/app-icon.png" alt="AL" className="h-4.5 w-4.5 object-contain" />
          </div>
          <span className="font-editorial text-2xl font-bold tracking-tight text-[#E2E8F0]">
            ActionLens <span className="text-[#C5A880] font-sans text-xs tracking-widest uppercase">AI</span>
          </span>
        </Link>
        <p className="text-xs font-mono text-[#94A3B8] uppercase tracking-widest">
          IGAD Early Warning Command
        </p>
      </div>

      <Link href="/" className="mb-4 inline-flex items-center gap-1.5 text-xs font-mono text-[#94A3B8] hover:text-[#E2E8F0] transition-colors cursor-pointer">
        ← Back to Home
      </Link>

      <div className="w-full max-w-md editorial-card p-6 sm:p-10 rounded-xs space-y-6 bg-[#151D2A] border border-[#2E3A4E]">
        <div className="text-center space-y-1.5 border-b border-[#2E3A4E] pb-6">
          <h1 className="font-editorial text-2xl sm:text-3xl font-normal text-[#E2E8F0] tracking-tight leading-tight">
            Sign In to ActionLens
          </h1>
          <p className="text-xs text-[#94A3B8] font-sans leading-relaxed">
            Enter your credentials to access your stakeholder command view
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-mono text-[#94A3B8] uppercase tracking-widest">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              className={`w-full px-4 py-3 bg-[#0B111E] border ${fieldErrors.email ? 'border-[#8C2F2F]' : 'border-[#2E3A4E]'} text-[#E2E8F0] placeholder:text-[#64748B] text-xs font-sans focus:outline-none focus:border-[#C5A880] transition-colors rounded-xs`}
              placeholder="official@ndma.go.ke"
            />
            {fieldErrors.email && (
              <p className="text-[10px] text-[#8C2F2F] font-mono">{fieldErrors.email}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="block text-[11px] font-mono text-[#94A3B8] uppercase tracking-widest">Password</label>
              <Link href="/forgot-password" className="text-[11px] font-mono text-[#C5A880] hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                className={`w-full px-4 py-3 pr-11 bg-[#0B111E] border ${fieldErrors.password ? 'border-[#8C2F2F]' : 'border-[#2E3A4E]'} text-[#E2E8F0] placeholder:text-[#64748B] text-xs font-sans focus:outline-none focus:border-[#C5A880] transition-colors rounded-xs`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#C5A880] transition-colors cursor-pointer z-20 p-1"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="text-[10px] text-[#8C2F2F] font-mono">{fieldErrors.password}</p>
            )}
          </div>

          {fieldErrors.general && (
            <div className="bg-[#8C2F2F]/15 border border-[#8C2F2F]/40 p-3.5 rounded-xs flex items-start gap-2.5 text-xs text-[#E2E8F0]">
              <AlertCircle className="h-4 w-4 text-[#8C2F2F] shrink-0 mt-0.5" />
              <span>{fieldErrors.general}</span>
            </div>
          )}

          <div className="pt-2">
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full text-xs font-bold uppercase tracking-widest text-[#0B111E] bg-[#C5A880] hover:bg-[#D4B992] transition-all py-3.5 rounded-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
            >
              <span>{loading ? "Authenticating..." : "Sign In to Dashboard"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>

        <p className="text-center text-xs text-[#94A3B8] font-sans border-t border-[#2E3A4E] pt-4">
          Need an account?{' '}
          <Link href="/register" className="text-[#C5A880] hover:underline font-medium">
            Initialize credentials
          </Link>
        </p>
      </div>

    </div>
  );
}
