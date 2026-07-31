import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { findUserById } from "@/lib/auth-store";

export async function GET() {
  try {
    // 1. Try Supabase Auth First
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
    } catch (e) {
      console.warn("[Supabase Auth Check Failure]", e);
    }

    // 2. Fallback to Local Persistent Auth Store
    const cookieStore = await cookies();
    const localUserId = cookieStore.get("actionlens_user_id")?.value;
    
    if (localUserId) {
      const localUser = findUserById(localUserId);
      if (localUser) {
        return NextResponse.json({
          status: "success",
          data: {
            user: {
              id: localUser.id,
              email: localUser.email,
              full_name: localUser.full_name,
              role: localUser.role,
              onboarding_complete: localUser.onboarding_complete,
              created_at: localUser.created_at,
            }
          }
        });
      }
    }

    const response = NextResponse.json(
      { error: "Unauthorized session." },
      { status: 401 }
    );
    response.cookies.set("actionlens_demo_user", "", { path: "/", maxAge: 0 });
    response.cookies.set("actionlens_user_id", "", { path: "/", maxAge: 0 });
    return response;
  } catch {
    return NextResponse.json(
      { error: "Failed to retrieve user session." },
      { status: 500 }
    );
  }
}

