import { NextResponse } from "next/server";
import { LoginSchema } from "@/lib/validations/auth";
import { verifyUserCredentials } from "@/lib/auth-store";
import { createClient } from "@/lib/supabase/server";
import { ZodError } from "zod";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = LoginSchema.parse(body);

    let user = null;
    let fallbackUsed = false;

    // 1. Try Supabase Auth First
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      try {
        const supabase = await createClient();
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: validatedData.email,
          password: validatedData.password,
        });

        if (!authError && authData.user) {
          // Fetch user profile from database
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", authData.user.id)
            .single();

          if (profile) {
            user = {
              id: profile.id,
              email: profile.email,
              full_name: profile.full_name,
              role: profile.role,
              onboarding_complete: profile.onboarding_complete,
              created_at: profile.created_at,
            };
          }
        }
      } catch (err) {
        console.warn("[Supabase Login Attempt Failed, falling back]", err);
        fallbackUsed = true;
      }
    } else {
      fallbackUsed = true;
    }

    // 2. Fallback to Local Persistent Store
    if (fallbackUsed || !user) {
      const localUser = verifyUserCredentials(validatedData.email, validatedData.password);
      if (!localUser) {
        return NextResponse.json(
          { error: "Invalid email or password." },
          { status: 401 }
        );
      }
      user = {
        id: localUser.id,
        email: localUser.email,
        full_name: localUser.full_name,
        role: localUser.role,
        onboarding_complete: localUser.onboarding_complete,
        created_at: localUser.created_at,
      };
    }

    const response = NextResponse.json({
      status: "success",
      data: { user },
      message: "Logged in successfully.",
    });

    response.cookies.set("actionlens_demo_user", "true", { path: "/", maxAge: 86400 });
    response.cookies.set("actionlens_user_id", user.id, { path: "/", maxAge: 86400 });

    return response;
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 }
    );
  }
}

