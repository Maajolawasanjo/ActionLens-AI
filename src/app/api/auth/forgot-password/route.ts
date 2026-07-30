import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { ZodError } from "zod";

const ForgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = ForgotPasswordSchema.parse(body);

    const supabase = await createClient();
    const origin = new URL(request.url).origin;

    const { error } = await supabase.auth.resetPasswordForEmail(
      validatedData.email,
      {
        redirectTo: `${origin}/reset-password`,
      }
    );

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        status: "success",
        message: "Password reset instructions have been sent to your email.",
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
      { error: "Failed to process password reset request." },
      { status: 500 }
    );
  }
}
