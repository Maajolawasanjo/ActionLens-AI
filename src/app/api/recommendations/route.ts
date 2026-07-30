import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    let profile: any = null;
    let userId: string | null = null;

    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        userId = user.id;
        const { data: p } = await supabase
          .from("profiles")
          .select("role, region, country, full_name")
          .eq("id", user.id)
          .single();
        profile = p;
      }
    } catch {
      // Demo session / unauthenticated request fallback
    }

    const adminClient = createAdminClient();

    // Query active recommendations from live database
    let query = adminClient
      .from("recommendations")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (profile?.role) {
      query = query.or(`role.eq.${profile.role},role.eq.government`);
    }

    const { data: recs, error: recErr } = await query.limit(20);
    if (recErr) {
      console.error("[Recommendations DB Error]", recErr.message);
    }

    const recommendationsList = recs && recs.length > 0 ? recs : [];

    // Fetch user_actions if logged in
    let userActions: any[] = [];
    if (userId && recommendationsList.length > 0) {
      try {
        const supabase = await createClient();
        const { data: actions } = await supabase
          .from("user_actions")
          .select("*")
          .eq("user_id", userId);
        userActions = actions ?? [];
      } catch {
        // user_actions empty or non-existent
      }
    }

    const recommendations = recommendationsList.map((rec: any) => ({
      ...rec,
      user_actions: userActions.filter((a) => a.recommendation_id === rec.id),
    }));

    return NextResponse.json({
      recommendations,
      profile: profile ?? { role: "government", region: "Tana River", country: "Kenya" },
    });
  } catch (err: any) {
    console.error("[Recommendations Route Error]", err.message);
    return NextResponse.json(
      {
        recommendations: [],
        profile: { role: "government", region: "Tana River", country: "Kenya" },
      },
      { status: 200 }
    );
  }
}
