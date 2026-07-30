"use client";

import { Zap } from "lucide-react";
import Link from "next/link";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-steel/5 blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-warning/5 blur-3xl -z-10 pointer-events-none" />

      <header className="sticky top-0 h-20 bg-background/80 backdrop-blur-md border-b border-border/40 flex items-center px-6 sm:px-10 shrink-0 z-30 shadow-sm">
        <Link href="/" prefetch={false} className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
          <div className="h-9 w-9 rounded-xl bg-navy flex items-center justify-center shadow-sm">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="text-navy font-extrabold text-lg tracking-tight">ActionLens AI</span>
        </Link>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center pt-8 pb-20 px-4 sm:px-6 relative z-10">
        <div className="w-full max-w-2xl bg-surface border border-border/80 rounded-3xl p-8 sm:p-10 shadow-sm">
          {children}
        </div>
      </main>
    </div>
  );
}
