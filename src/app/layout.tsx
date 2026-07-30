import type { Metadata, Viewport } from "next";
import { Syne, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/providers/auth-provider";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ActionLens AI — Early Warning & Decision Resilience",
    template: "%s | ActionLens AI",
  },
  description:
    "IGAD Early Warning Decision Platform transforming climate risk data into role-tailored actionable intelligence for governments, NGOs, emergency responders, health leads, farmers, and communities.",
  keywords: [
    "IGAD Early Warning",
    "disaster response",
    "climate intelligence",
    "ICPAC early action",
    "flood risk",
    "drought monitoring",
  ],
  authors: [{ name: "ActionLens AI" }],
  creator: "ActionLens AI",
};

export const viewport: Viewport = {
  themeColor: "#0B111E",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${syne.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-background text-text-primary min-h-screen selection:bg-gold/20 selection:text-gold">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
