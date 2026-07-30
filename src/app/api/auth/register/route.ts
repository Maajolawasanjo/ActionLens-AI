import { NextResponse } from "next/server";
import { RegisterSchema } from "@/lib/validations/auth";
import { findUserByEmail, createUserProfile } from "@/lib/auth-store";
import { createAdminClient } from "@/lib/supabase/admin";
import { ZodError } from "zod";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = RegisterSchema.parse(body);
    const email = validatedData.email.toLowerCase().trim();

    // Check duplicate email
    const existing = findUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email address already exists. Please sign in instead." },
        { status: 400 }
      );
    }

    // Create user in local persistent store
    const newProfile = createUserProfile({
      email: email,
      password: validatedData.password,
      full_name: validatedData.full_name,
      role: validatedData.role,
    });

    // Also attempt Supabase upsert (non-blocking)
    try {
      const adminClient = createAdminClient();
      await adminClient.from("profiles").upsert({
        id: newProfile.id,
        email: newProfile.email,
        full_name: newProfile.full_name,
        role: newProfile.role,
        created_at: newProfile.created_at,
      }, { onConflict: "id" });
    } catch {}

    const response = NextResponse.json(
      {
        status: "success",
        data: {
          user: {
            id: newProfile.id,
            email: newProfile.email,
            full_name: newProfile.full_name,
            role: newProfile.role,
            onboarding_complete: newProfile.onboarding_complete,
            created_at: newProfile.created_at,
          },
        },
        message: "Account created successfully.",
      },
      { status: 201 }
    );

    response.cookies.set("actionlens_demo_user", "true", { path: "/", maxAge: 86400 });
    response.cookies.set("actionlens_user_id", newProfile.id, { path: "/", maxAge: 86400 });

    return response;
  } catch (error: any) {
    if (error instanceof ZodError) {
      const issue = error.issues[0]?.message ?? "Invalid form input";
      return NextResponse.json(
        { error: issue, details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Registration failed. Please check your details." },
      { status: 400 }
    );
  }
}
