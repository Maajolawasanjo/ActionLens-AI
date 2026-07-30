import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
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

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "User profile not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        status: "success",
        data: { user: profile },
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to retrieve user session." },
      { status: 500 }
    );
  }
}
