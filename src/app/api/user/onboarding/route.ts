import { NextResponse } from "next/server";
import { OnboardingSchema } from "@/lib/validations/auth";
import { ZodError } from "zod";
import { completeUserOnboarding } from "@/lib/auth-store";
import { cookies } from "next/headers";
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
    
    // 1. Try Supabase Onboarding Update First
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      try {
        const supabase = await createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (!userError && user) {
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
            console.error("[Supabase Onboarding Update Error]", profileError);
          }
        }
      } catch (e) {
        console.warn("[Supabase Onboarding Attempt Failed]", e);
      }
    }

    // 2. Fallback to Local Persistent Auth Store
    const cookieStore = await cookies();
    const localUserId = cookieStore.get("actionlens_user_id")?.value;
    if (localUserId) {
      completeUserOnboarding(localUserId);
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
