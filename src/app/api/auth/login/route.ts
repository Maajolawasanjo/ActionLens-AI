import { NextResponse } from "next/server";
import { LoginSchema } from "@/lib/validations/auth";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { ZodError } from "zod";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = LoginSchema.parse(body);

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

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: validatedData.email,
      password: validatedData.password,
    });

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Fetch user profile from database
    let { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    if (!profile) {
      try {
        const { data: newProfile } = await supabase
          .from("profiles")
          .insert({
            id: authData.user.id,
            email: authData.user.email || validatedData.email,
            full_name: authData.user.user_metadata?.full_name || "User",
            role: authData.user.user_metadata?.role || "government",
            onboarding_complete: false,
          })
          .select()
          .single();

        if (newProfile) {
          profile = newProfile;
        }
      } catch (insertErr) {
        console.error("[Login Explicit Profile Insert Failed]", insertErr);
      }
    }

    if (!profile) {
      return NextResponse.json(
        { error: "User profile could not be retrieved or established." },
        { status: 401 }
      );
    }

    const user = {
      id: profile.id,
      email: profile.email,
      full_name: profile.full_name,
      role: profile.role,
      onboarding_complete: profile.onboarding_complete,
      created_at: profile.created_at,
    };

    const response = NextResponse.json({
      status: "success",
      data: { user },
      message: "Logged in successfully.",
    });

    // Apply cookies that were set during authentication
    cookiesToSetLater.forEach(({ name, value, options }) => {
      response.cookies.set(name, value, options);
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 }
    );
  }
}
