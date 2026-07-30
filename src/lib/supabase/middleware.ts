import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Updates the user's Supabase auth session in Next.js middleware.
 * Ensures cookies are refreshed and validates user authentication state.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // IMPORTANT: Do not run code between createServerClient and getUser.
  // A simple mistake could make it very hard to debug issues with users being randomly logged out.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // 1. Protected App Routes
  const isAppRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/recommendations") ||
    pathname.startsWith("/map") ||
    pathname.startsWith("/alerts") ||
    pathname.startsWith("/community") ||
    pathname.startsWith("/assistant") ||
    pathname.startsWith("/resources") ||
    pathname.startsWith("/analytics") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/profile");

  const isOnboardingRoute = pathname.startsWith("/onboarding");
  const isAuthRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password");

  // 2. Authentication Enforcement
  const isDemoUser = request.cookies.get("actionlens_demo_user")?.value === "true";
  const isAuthenticated = !!user || isDemoUser;

  // Protect app routes: require authentication
  if (!isAuthenticated && (isAppRoute || isOnboardingRoute)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Redirect authenticated user away from auth pages to dashboard
  if (isAuthenticated && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;

}
