import { NextResponse } from "next/server";
import { LoginSchema } from "@/lib/validations/auth";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { ZodError } from "zod";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = LoginSchema.parse(body);

    const supabase = await createClient();
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

    // Copy cookies from Next.js cookieStore to the response headers
    const cookieStore = await cookies();
    for (const cookie of cookieStore.getAll()) {
      response.cookies.set(cookie.name, cookie.value, {
        path: "/",
        ...cookie.options,
      });
    }

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 }
    );
  }
}
