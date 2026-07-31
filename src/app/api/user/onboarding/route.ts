import { NextResponse } from "next/server";
import { OnboardingSchema } from "@/lib/validations/auth";
import { ZodError } from "zod";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  return handleOnboarding(request);
}

export async function PATCH(request: Request) {
  return handleOnboarding(request);
}

async function handleOnboarding(request: Request) {
  try {
    const body = await request.json();
    const validatedData = OnboardingSchema.safeParse(body);
    
    if (!validatedData.success) {
      return NextResponse.json(
        { error: "Validation Error", details: validatedData.error.issues },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized session. Please log in." },
        { status: 401 }
      );
    }

    // Update the database profile to complete onboarding
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        onboarding_complete: true,
        country: body.country || "Kenya",
        region: body.region || "Tana River",
        role: body.role || "government",
      })
      .eq("id", user.id);

    if (profileError) {
      throw profileError;
    }

    return NextResponse.json(
      {
        status: "success",
        data: {
          onboarding_complete: true,
          country: body.country || "Kenya",
          region: body.region || "Tana River",
        },
        message: "Onboarding completed successfully.",
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred during onboarding." },
      { status: 500 }
    );
  }
}
