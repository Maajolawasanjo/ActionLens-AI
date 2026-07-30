import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const schema = z.object({
  role:     z.string().min(1),
  region:   z.string().min(1),
  country:  z.string().default("Kenya"),
  risk_type: z.string().min(1),
  risk_level: z.string().default("high"),
  risk_payload: z.record(z.string(), z.any()).optional(),
  max_recommendations: z.number().int().min(1).max(10).default(3),
});

const FASTAPI_URL = process.env.FASTAPI_MICROSERVICE_URL ?? "http://localhost:8000";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
    }

    // ── Call FastAPI microservice ──
    const fastapiRes = await fetch(`${FASTAPI_URL}/generate-recommendations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
      // 20 second timeout
      signal: AbortSignal.timeout(20000),
    });

    if (!fastapiRes.ok) {
      const err = await fastapiRes.json().catch(() => ({}));
      throw new Error(err.detail ?? `FastAPI error ${fastapiRes.status}`);
    }

    const aiResult = await fastapiRes.json();

    // ── Persist generated recommendations to Supabase ──
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, region")
      .eq("id", user.id)
      .single();

    if (aiResult.recommendations?.length) {
      const toInsert = aiResult.recommendations.map((rec: any) => ({
        user_id:          user.id,
        role:             profile?.role ?? parsed.data.role,
        region:           parsed.data.region,
        risk_type:        parsed.data.risk_type as any,
        action:           rec.action,
        priority:         rec.priority as any,
        time_horizon:     rec.time_horizon as any,
        confidence_score: rec.confidence_score,
        reasoning:        rec.reasoning,
        expected_impact:  rec.expected_impact,
        evidence:         rec.evidence ?? [],
        status:           "active",
        expires_at:       new Date(Date.now() + 86400000 * 3).toISOString(),
      }));

      await supabase.from("recommendations").insert(toInsert);
    }

    return NextResponse.json({ success: true, ...aiResult });
  } catch (err: any) {
    console.error("[AI Recommendations Error]", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
