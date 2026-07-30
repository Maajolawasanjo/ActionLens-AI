"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Eye, EyeOff, ArrowRight, AlertCircle, Check 
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
  const [role, setRole] = useState("government");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Field-specific inline errors
  const [fieldErrors, setFieldErrors] = useState<{
    fullName?: string;
    email?: string;
    role?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  // Real-time Field Change Handlers
  const handleFullNameChange = (val: string) => {
    setFullName(val);
    if (fieldErrors.fullName && val.trim().length >= 2) {
      setFieldErrors((prev) => ({ ...prev, fullName: undefined }));
    }
  };

  const handleEmailChange = (val: string) => {
    setEmail(val);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (fieldErrors.email && emailRegex.test(val.trim())) {
      setFieldErrors((prev) => ({ ...prev, email: undefined }));
    }
  };

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    const errors: { password?: string; confirmPassword?: string } = {};

    if (val.length < 8) {
      errors.password = "Password must be at least 8 characters long.";
    } else if (!/\d/.test(val)) {
      errors.password = "Password must contain at least one number (0-9).";
    } else {
      errors.password = undefined;
    }

    if (confirmPassword && val !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    } else if (confirmPassword && val === confirmPassword) {
      errors.confirmPassword = undefined;
    }

    setFieldErrors((prev) => ({ ...prev, ...errors }));
  };

  const handleConfirmPasswordChange = (val: string) => {
    setConfirmPassword(val);
    if (password && val !== password) {
      setFieldErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match." }));
    } else {
      setFieldErrors((prev) => ({ ...prev, confirmPassword: undefined }));
    }
  };

  const validateForm = () => {
    const errors: typeof fieldErrors = {};
    const sanitizedName = fullName.trim();
    const sanitizedEmail = email.trim().toLowerCase();

    if (!sanitizedName) {
      errors.fullName = "Full name is required.";
    } else if (sanitizedName.length < 2) {
      errors.fullName = "Full name must be at least 2 characters.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!sanitizedEmail) {
      errors.email = "Email address is required.";
    } else if (!emailRegex.test(sanitizedEmail)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters long.";
    } else if (!/\d/.test(password)) {
      errors.password = "Password must contain at least one number (0-9).";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
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
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName.trim(),
          email: email.trim().toLowerCase(),
          password: password,
          role: role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFieldErrors({ general: data.error || "Registration failed. Please check your details." });
        return;
      }

      localStorage.setItem("actionlens_user_role", role);
      document.cookie = `actionlens_demo_user=true; path=/; max-age=86400`;

      // Redirect immediately to onboarding flow
      try {
        router.push("/onboarding");
      } catch {
        window.location.href = "/onboarding";
      }
    } catch (err: any) {
      setFieldErrors({ general: err.message || "An unexpected error occurred." });
    } finally {
      setLoading(false);
    }
  };

  // Password Live Metrics
  const isMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const isMatch = confirmPassword.length > 0 && password === confirmPassword;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#0B111E] text-[#E2E8F0] p-4 sm:p-6 selection:bg-[#C5A880]/20 selection:text-[#C5A880]">
      
      {/* Brand Header */}
      <div className="mb-6 text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xs bg-[#C5A880]/15 border border-[#C5A880]/40 flex items-center justify-center">
            <img src="/app-icon.png" alt="AL" className="h-4.5 w-4.5 object-contain" />
          </div>
          <span className="font-editorial text-2xl font-bold tracking-tight text-[#E2E8F0]">
            ActionLens <span className="text-[#C5A880] font-sans text-xs tracking-widest uppercase">AI</span>
          </span>
        </Link>
        <p className="text-xs font-mono text-[#94A3B8] uppercase tracking-widest">
          IGAD Decision Intelligence Platform
        </p>
      </div>

      <Link href="/" className="mb-4 inline-flex items-center gap-1.5 text-xs font-mono text-[#94A3B8] hover:text-[#E2E8F0] transition-colors cursor-pointer">
        ← Back to Home
      </Link>

      <div className="w-full max-w-md editorial-card p-6 sm:p-10 rounded-xs space-y-6 bg-[#151D2A] border border-[#2E3A4E]">
        <div className="text-center space-y-1.5 border-b border-[#2E3A4E] pb-6">
          <h1 className="font-editorial text-2xl sm:text-3xl font-normal text-[#E2E8F0] tracking-tight leading-tight">
            Create Account
          </h1>
          <p className="text-xs text-[#94A3B8] font-sans leading-relaxed">
            Initialize your role-based early warning command credentials
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-mono text-[#94A3B8] uppercase tracking-widest">Full Name</label>
            <input 
              type="text" 
              value={fullName}
              maxLength={100}
              onChange={(e) => handleFullNameChange(e.target.value)}
              className={`w-full px-4 py-3 bg-[#0B111E] border ${fieldErrors.fullName ? 'border-[#8C2F2F]' : 'border-[#2E3A4E]'} text-[#E2E8F0] placeholder:text-[#64748B] text-xs font-sans focus:outline-none focus:border-[#C5A880] transition-colors rounded-xs`}
              placeholder="e.g. Director Jane Doe"
            />
            {fieldErrors.fullName && (
              <p className="text-[10px] text-[#8C2F2F] font-mono">{fieldErrors.fullName}</p>
            )}
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-mono text-[#94A3B8] uppercase tracking-widest">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              className={`w-full px-4 py-3 bg-[#0B111E] border ${fieldErrors.email ? 'border-[#8C2F2F]' : 'border-[#2E3A4E]'} text-[#E2E8F0] placeholder:text-[#64748B] text-xs font-sans focus:outline-none focus:border-[#C5A880] transition-colors rounded-xs`}
              placeholder="name@icpac.int"
            />
            {fieldErrors.email && (
              <p className="text-[10px] text-[#8C2F2F] font-mono">{fieldErrors.email}</p>
            )}
          </div>

          {/* Stakeholder Role Dropdown */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-mono text-[#94A3B8] uppercase tracking-widest">Stakeholder Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={`w-full px-4 py-3 bg-[#0B111E] border ${fieldErrors.role ? 'border-[#8C2F2F]' : 'border-[#2E3A4E]'} text-[#E2E8F0] text-xs font-sans focus:outline-none focus:border-[#C5A880] transition-colors rounded-xs`}
            >
              {ROLE_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.name}
                </option>
              ))}
            </select>
            {fieldErrors.role && (
              <p className="text-[10px] text-[#8C2F2F] font-mono">{fieldErrors.role}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-mono text-[#94A3B8] uppercase tracking-widest">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                className={`w-full px-4 py-3 pr-11 bg-[#0B111E] border ${fieldErrors.password ? 'border-[#8C2F2F]' : 'border-[#2E3A4E]'} text-[#E2E8F0] placeholder:text-[#64748B] text-xs font-sans focus:outline-none focus:border-[#C5A880] transition-colors rounded-xs`}
                placeholder="At least 8 characters & 1 number"
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

            {/* Real-time Password Strength Check Indicators */}
            <div className="flex items-center gap-3 pt-1 text-[10px] font-mono">
              <span className={`inline-flex items-center gap-1 ${isMinLength ? 'text-[#C5A880]' : 'text-[#64748B]'}`}>
                {isMinLength ? <Check className="h-3 w-3" /> : "•"} 8+ Chars
              </span>
              <span className={`inline-flex items-center gap-1 ${hasNumber ? 'text-[#C5A880]' : 'text-[#64748B]'}`}>
                {hasNumber ? <Check className="h-3 w-3" /> : "•"} Has Number
              </span>
            </div>

            {fieldErrors.password && (
              <p className="text-[10px] text-[#8C2F2F] font-mono">{fieldErrors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-mono text-[#94A3B8] uppercase tracking-widest">Confirm Password</label>
            <div className="relative">
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                value={confirmPassword}
                onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                className={`w-full px-4 py-3 pr-11 bg-[#0B111E] border ${fieldErrors.confirmPassword ? 'border-[#8C2F2F]' : 'border-[#2E3A4E]'} text-[#E2E8F0] placeholder:text-[#64748B] text-xs font-sans focus:outline-none focus:border-[#C5A880] transition-colors rounded-xs`}
                placeholder="Confirm password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#C5A880] transition-colors cursor-pointer z-20 p-1"
                aria-label="Toggle confirm password visibility"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {confirmPassword.length > 0 && (
              <p className={`text-[10px] font-mono ${isMatch ? 'text-[#C5A880]' : 'text-[#8C2F2F]'}`}>
                {isMatch ? "✓ Passwords match" : "✗ Passwords do not match"}
              </p>
            )}

            {fieldErrors.confirmPassword && !isMatch && (
              <p className="text-[10px] text-[#8C2F2F] font-mono">{fieldErrors.confirmPassword}</p>
            )}
          </div>

          {/* General Error Message */}
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
              <span>{loading ? "Creating Account..." : "Create Account & Continue"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>

        <p className="text-center text-xs text-[#94A3B8] font-sans border-t border-[#2E3A4E] pt-4">
          Already registered?{' '}
          <Link href="/login" className="text-[#C5A880] hover:underline font-medium">
            Sign in here
          </Link>
        </p>
      </div>

    </div>
  );
}
