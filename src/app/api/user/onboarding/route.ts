import { NextResponse } from "next/server";
import { OnboardingSchema } from "@/lib/validations/auth";
import { ZodError } from "zod";

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
