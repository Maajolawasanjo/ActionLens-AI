"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield, ArrowLeft, Mail, CheckCircle2, AlertTriangle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"form" | "sent">("form");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.trim()) return setError("Please enter your email address.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return setError("Please enter a valid email address.");

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Unable to send reset email.");
      }

      setStep("sent");
    } catch (err: any) {
      setError(err.message || "Unable to send reset link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

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
          IGAD Credential Recovery
        </p>
      </div>

      <div className="w-full max-w-md editorial-card p-8 sm:p-10 rounded-xs space-y-6">
        {step === "form" ? (
          <div className="space-y-6">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-gold hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to sign in</span>
            </Link>

            <div className="space-y-1.5 border-b border-border/80 pb-4">
              <h1 className="font-editorial text-3xl font-normal text-text-primary tracking-tight">
                Reset Password
              </h1>
              <p className="text-xs text-text-secondary font-sans leading-relaxed">
                Enter your registered organization email to receive reset instructions
              </p>
            </div>

            {error && (
              <div className="bg-severe/15 border border-severe/40 p-3.5 rounded-xs flex items-start gap-2.5 text-xs text-text-primary">
                <AlertTriangle className="h-4 w-4 text-severe shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono text-text-secondary uppercase tracking-widest">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-alt/40 border border-border text-text-primary placeholder:text-text-placeholder text-xs font-sans focus:outline-none focus:border-gold transition-colors rounded-xs"
                  placeholder="you@organization.org"
                />
              </div>

              <button 
                type="submit" 
                disabled={isLoading} 
                className="w-full text-xs font-bold uppercase tracking-widest text-background bg-gold hover:bg-gold-hover transition-all py-3.5 rounded-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
              >
                <span>{isLoading ? "Dispatching Reset Link..." : "Send Reset Instructions"}</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center space-y-6 py-4">
            <div className="h-14 w-14 rounded-xs bg-gold/10 border border-gold/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-7 w-7 text-gold" />
            </div>

            <div className="space-y-2">
              <h2 className="font-editorial text-3xl font-normal text-text-primary">
                Check Your Inbox
              </h2>
              <p className="text-xs text-text-secondary font-sans leading-relaxed">
                Password recovery link sent to <strong className="text-text-primary">{email}</strong>.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={() => setStep("form")}
                className="w-full text-xs font-mono text-text-secondary hover:text-text-primary border border-border py-2.5 rounded-xs"
              >
                Use different email
              </button>
              <Link
                href="/login"
                className="block text-xs font-mono text-gold hover:underline"
              >
                Return to Sign In
              </Link>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
