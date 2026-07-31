import { NextResponse } from "next/server";
import { RegisterSchema } from "@/lib/validations/auth";
import { findUserByEmail, createUserProfile } from "@/lib/auth-store";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { ZodError } from "zod";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = RegisterSchema.parse(body);
    const email = validatedData.email.toLowerCase().trim();

    let user = null;
    let fallbackUsed = false;

    // 1. Try Supabase Auth First (via Admin SDK to auto-confirm)
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const adminClient = createAdminClient();
        const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
          email,
          password: validatedData.password,
          email_confirm: true,
          user_metadata: {
            full_name: validatedData.full_name,
            role: validatedData.role,
          }
        });

        if (authError) {
          if (authError.message.includes("exists") || authError.status === 400) {
            return NextResponse.json(
              { error: "An account with this email address already exists. Please sign in instead." },
              { status: 400 }
            );
          }
          throw authError;
        }

        if (authData.user) {
          // Explicitly create/upsert the profile row to guarantee existence
          try {
            await adminClient.from("profiles").upsert({
              id: authData.user.id,
              email: authData.user.email || email,
              full_name: validatedData.full_name,
              role: validatedData.role,
              onboarding_complete: false,
            });
          } catch (profileErr) {
            console.warn("[Register Explicit Profile Upsert Failed]", profileErr);
          }

          user = {
            id: authData.user.id,
            email: authData.user.email || email,
            full_name: validatedData.full_name,
            role: validatedData.role,
            onboarding_complete: false,
            created_at: authData.user.created_at,
          };

          // Sign the user in immediately to set the session cookies
          try {
            const supabase = await createClient();
            await supabase.auth.signInWithPassword({
              email,
              password: validatedData.password,
            });
          } catch (signInErr) {
            console.warn("[Register Auto-Login Failed]", signInErr);
          }
        }
      } catch (err) {
        console.warn("[Supabase Register Attempt Failed, falling back]", err);
        fallbackUsed = true;
      }
    } else {
      fallbackUsed = true;
    }

    // 2. Fallback to Local Persistent Store
    if (fallbackUsed || !user) {
      // Check duplicate email in local store
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

      user = {
        id: newProfile.id,
        email: newProfile.email,
        full_name: newProfile.full_name,
        role: newProfile.role,
        onboarding_complete: newProfile.onboarding_complete,
        created_at: newProfile.created_at,
      };
    }

    const response = NextResponse.json(
      {
        status: "success",
        data: { user },
        message: "Account created successfully.",
      },
      { status: 201 }
    );

    response.cookies.set("actionlens_demo_user", "true", { path: "/", maxAge: 86400 });
    response.cookies.set("actionlens_user_id", user.id, { path: "/", maxAge: 86400 });

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

