import { NextResponse } from "next/server";
import { RegisterSchema } from "@/lib/validations/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { ZodError } from "zod";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = RegisterSchema.parse(body);
    const email = validatedData.email.toLowerCase().trim();

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

    if (!authData.user) {
      throw new Error("Failed to create user account.");
    }

    // Explicitly create/upsert the profile row to guarantee database existence
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

    const user = {
      id: authData.user.id,
      email: authData.user.email || email,
      full_name: validatedData.full_name,
      role: validatedData.role,
      onboarding_complete: false,
      created_at: authData.user.created_at,
    };

    // Sign the user in immediately to populate session cookies in cookieStore
    const supabase = await createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: validatedData.password,
    });

    if (signInError) {
      throw signInError;
    }

    // Return response and copy Supabase session cookies from Next.js cookie store
    const response = NextResponse.json(
      {
        status: "success",
        data: { user },
        message: "Account created successfully.",
      },
      { status: 201 }
    );

    const cookieStore = await cookies();
    for (const cookie of cookieStore.getAll()) {
      response.cookies.set(cookie.name, cookie.value, {
        path: "/",
        ...cookie.options,
      });
    }

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
      { error: error.message || "Registration failed. Please check your details." },
      { status: 400 }
    );
  }
}
