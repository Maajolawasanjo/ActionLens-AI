import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const schema = z.object({
  image_url:    z.string().url().optional(),
  image_base64: z.string().optional(),
  category:     z.string().min(1),
  description:  z.string().min(1),
  report_id:    z.string().uuid().optional(),
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

    if (!parsed.data.image_url && !parsed.data.image_base64) {
      return NextResponse.json({ error: "Either image_url or image_base64 is required." }, { status: 400 });
    }

    // ── Call FastAPI vision endpoint ──
    const fastapiRes = await fetch(`${FASTAPI_URL}/verify-report-vision`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image_url:    parsed.data.image_url,
        image_base64: parsed.data.image_base64,
        category:     parsed.data.category,
        description:  parsed.data.description,
      }),
      signal: AbortSignal.timeout(30000),
    });

    if (!fastapiRes.ok) {
      const err = await fastapiRes.json().catch(() => ({}));
      throw new Error(err.detail ?? `FastAPI vision error ${fastapiRes.status}`);
    }

    const visionResult = await fastapiRes.json();

    // ── Update community_reports record if report_id provided ──
    if (parsed.data.report_id) {
      await supabase
        .from("community_reports")
        .update({
          ai_verified:  visionResult.verified,
          ai_confidence: visionResult.confidence,
          ai_analysis:  {
            summary:              visionResult.ai_summary,
            objects_detected:     visionResult.objects_detected,
            severity_assessment:  visionResult.severity_assessment,
            recommended_action:   visionResult.recommended_action,
          },
          status: visionResult.verified ? "verified" : "pending",
        })
        .eq("id", parsed.data.report_id)
        .eq("user_id", user.id);
    }

    return NextResponse.json({ success: true, ...visionResult });
  } catch (err: any) {
    console.error("[Vision Verify Error]", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
