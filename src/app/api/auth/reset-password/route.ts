import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { ZodError } from "zod";

const ResetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = ResetPasswordSchema.parse(body);

    const supabase = await createClient();

    const { error } = await supabase.auth.updateUser({
      password: validatedData.password,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        status: "success",
        message: "Password updated successfully.",
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
      { error: "Failed to update password." },
      { status: 500 }
    );
  }
}
