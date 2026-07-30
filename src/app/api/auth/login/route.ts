import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { LoginSchema } from "@/lib/validations/auth";
import { ZodError } from "zod";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = LoginSchema.parse(body);

    const supabase = await createClient();

    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email: validatedData.email,
        password: validatedData.password,
      });

    if (authError) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: "Authentication failed." },
        { status: 401 }
      );
    }

    // Fetch user profile from PostgreSQL
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    if (profileError) {
      return NextResponse.json(
        { error: "Failed to load user profile." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        status: "success",
        data: {
          user: profile,
        },
        message: "Logged in successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation Error", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred during login." },
      { status: 500 }
    );
  }
}
