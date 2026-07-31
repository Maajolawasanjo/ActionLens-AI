import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();

    const response = NextResponse.json(
      {
        status: "success",
        message: "Logged out successfully.",
      },
      { status: 200 }
    );

    // Clear local persistent session cookies
    response.cookies.set("actionlens_demo_user", "", { path: "/", maxAge: 0 });
    response.cookies.set("actionlens_user_id", "", { path: "/", maxAge: 0 });

    return response;
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred during logout." },
      { status: 500 }
    );
  }
}
