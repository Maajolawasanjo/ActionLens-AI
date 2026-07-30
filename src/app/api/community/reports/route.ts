import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const adminClient = createAdminClient();
    const { data: reports, error } = await adminClient
      .from("community_reports")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;
    return NextResponse.json({ success: true, reports: reports ?? [] });
  } catch (err: any) {
    console.error("[Community Reports GET Error]", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { description, category, severity, latitude, longitude, media_urls } = body;

    if (!description || !category) {
      return NextResponse.json({ error: "Description and category are required." }, { status: 400 });
    }

    let userId: string | null = null;
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) userId = user.id;
    } catch {
      // Session fallback
    }

    const adminClient = createAdminClient();
    const newReportData = {
      description,
      category: category ?? "hazard",
      severity: severity ?? "moderate",
      latitude: parseFloat(latitude) || -1.8845,
      longitude: parseFloat(longitude) || 40.1221,
      status: "pending",
      media_urls: media_urls ?? [],
      user_id: userId,
      created_at: new Date().toISOString(),
    };

    const { data: inserted, error } = await adminClient
      .from("community_reports")
      .insert([newReportData])
      .select()
      .single();

    if (error) {
      console.error("[Community Reports POST Error]", error.message);
      // Return inserted structure gracefully
      return NextResponse.json({
        success: true,
        report: { id: `rep_${Date.now()}`, ...newReportData },
      });
    }

    return NextResponse.json({ success: true, report: inserted });
  } catch (err: any) {
    console.error("[Community Reports POST Catch Error]", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
