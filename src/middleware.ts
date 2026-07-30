import { updateSession } from "@/lib/supabase/middleware";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);

  // ── Security Headers ──────────────────────────────────────────────
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  const csp = [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
    `font-src 'self' https://fonts.gstatic.com`,
    `img-src 'self' blob: data: https://*.supabase.co https://*.supabase.storage https://picsum.photos https://images.unsplash.com https://*.unsplash.com https://raw.githubusercontent.com https://*.tile.openstreetmap.org https://tile.openstreetmap.org https://*.basemaps.cartocdn.com https://cdnjs.cloudflare.com`,
    `connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.openai.com`,
    `media-src 'self' blob: https://*.supabase.co`,
    `frame-ancestors 'none'`,
    `form-action 'self'`,
    `base-uri 'self'`,
    `upgrade-insecure-requests`,
  ].join("; ");

  const headers = response.headers;
  headers.set("Content-Security-Policy", csp);
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");
  headers.set("X-XSS-Protection", "1; mode=block");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(self), payment=()");
  headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (svg, png, jpg, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
