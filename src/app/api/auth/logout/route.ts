import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const cookiesToSetLater: Array<{ name: string; value: string; options: any }> = [];

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            try {
              cookieStore.set(name, value, options);
            } catch {}
            cookiesToSetLater.push({ name, value, options });
          });
        },
      },
    });

    await supabase.auth.signOut();

    const response = NextResponse.json(
      {
        status: "success",
        message: "Logged out successfully.",
      },
      { status: 200 }
    );

    // Apply cookies that were set/removed during signOut
    cookiesToSetLater.forEach(({ name, value, options }) => {
      response.cookies.set(name, value, options);
    });

    // Clear local persistent session cookies
    response.cookies.set("actionlens_demo_user", "", { path: "/", maxAge: 0 });
    response.cookies.set("actionlens_user_id", "", { path: "/", maxAge: 0 });

    return response;
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred during logout." },
      { status: 500 }
    );
  }
}

