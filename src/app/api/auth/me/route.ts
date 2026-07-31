import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (!authError && user) {
      let { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!profile) {
        try {
          const { data: newProfile } = await supabase
            .from("profiles")
            .insert({
              id: user.id,
              email: user.email,
              full_name: user.user_metadata?.full_name || "User",
              role: user.user_metadata?.role || "government",
              onboarding_complete: false,
            })
            .select()
            .single();

          if (newProfile) {
            profile = newProfile;
          }
        } catch (insertErr) {
          console.error("[Me Explicit Profile Insert Failed]", insertErr);
        }
      }

      if (profile) {
        return NextResponse.json({
          status: "success",
          data: { user: profile },
        });
      }
    }

    // Clean up any remaining legacy cookies
    const response = NextResponse.json(
      { error: "Unauthorized session." },
      { status: 401 }
    );
    response.cookies.set("actionlens_demo_user", "", { path: "/", maxAge: 0 });
    response.cookies.set("actionlens_user_id", "", { path: "/", maxAge: 0 });
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to retrieve user session." },
      { status: 500 }
    );
  }
}
