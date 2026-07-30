import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { UserRoleSchema } from "@/lib/validations/auth";
import { z, ZodError } from "zod";

const UpdateProfileSchema = z.object({
  full_name: z.string().min(2).optional(),
  role: UserRoleSchema.optional(),
  country: z.string().optional(),
  region: z.string().optional(),
  district: z.string().optional(),
  phone_number: z.string().optional(),
  interests: z.array(z.string()).optional(),
  notification_email: z.boolean().optional(),
  notification_sms: z.boolean().optional(),
  avatar_url: z.string().url().optional(),
});

export async function PUT(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized session." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = UpdateProfileSchema.parse(body);

    const { data: updatedProfile, error: updateError } = await supabase
      .from("profiles")
      .update(validatedData)
      .eq("id", user.id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        status: "success",
        data: { user: updatedProfile },
        message: "Profile updated successfully.",
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
      { error: "An unexpected error occurred while updating profile." },
      { status: 500 }
    );
  }
}
