import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { RegisterSchema } from "@/lib/validations/auth";
import { ZodError } from "zod";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = RegisterSchema.parse(body);

    const supabase = await createClient();

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
      options: {
        data: {
          full_name: validatedData.full_name,
          role: validatedData.role,
        },
      },
    });

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: "Failed to create user account." },
        { status: 500 }
      );
    }

    // Fetch the auto-created profile record
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    if (profileError) {
      // Return base metadata if profile selection is still executing trigger
      return NextResponse.json(
        {
          status: "success",
          data: {
            user: {
              id: authData.user.id,
              email: authData.user.email,
              full_name: validatedData.full_name,
              role: validatedData.role,
              onboarding_complete: false,
            },
          },
          message: "Account created successfully.",
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      {
        status: "success",
        data: { user: profile },
        message: "Account created successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation Error", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred during registration." },
      { status: 500 }
    );
  }
}
