import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the profile to filter recommendations by role/region
    const { data: profile, error: profileErr } = await supabase
      .from("profiles")
      .select("role, region, country")
      .eq("id", user.id)
      .single();
    if (profileErr) throw profileErr;

    const adminClient = createAdminClient();

    // Fetch recommendations matching user's role and region
    const { data: recs, error: recErr } = await adminClient
      .from("recommendations")
      .select("*")
      .eq("status", "active")
      .or(`role.eq.${profile.role},region.eq.${profile.region}`)
      .order("created_at", { ascending: false })
      .limit(20);
    if (recErr) throw recErr;

    // Fetch this user's action items for the returned recommendations
    const recIds = (recs ?? []).map((r: any) => r.id);
    let userActions: any[] = [];
    if (recIds.length > 0) {
      const { data: actions } = await supabase
        .from("user_actions")
        .select("*")
        .eq("user_id", user.id)
        .in("recommendation_id", recIds);
      userActions = actions ?? [];
    }

    // Merge action completion status onto each recommendation
    const recommendations = (recs ?? []).map((rec: any) => ({
      ...rec,
      user_actions: userActions.filter((a) => a.recommendation_id === rec.id),
    }));

    return NextResponse.json({ recommendations, profile });
  } catch (err: any) {
    console.error("[Recommendations Error]", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
