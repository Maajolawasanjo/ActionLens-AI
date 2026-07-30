import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { OnboardingSchema } from "@/lib/validations/auth";
import { ZodError } from "zod";

export async function PATCH(request: Request) {
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
    const validatedData = OnboardingSchema.parse(body);

    const updatePayload: Record<string, any> = {
      country: validatedData.country,
      region: validatedData.region,
      district: validatedData.district || null,
      phone_number: validatedData.phone_number || null,
      interests: validatedData.interests,
      notification_email: validatedData.notification_email,
      notification_sms: validatedData.notification_sms,
      onboarding_complete: true,
    };

    if (validatedData.role) {
      updatePayload.role = validatedData.role;
    }

    const { data: updatedProfile, error: updateError } = await supabase
      .from("profiles")
      .update(updatePayload)
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
        message: "Onboarding completed successfully.",
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
      { error: "An unexpected error occurred during onboarding." },
      { status: 500 }
    );
  }
}
