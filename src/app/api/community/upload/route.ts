import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const reportId = formData.get("report_id") as string | null;
    const category = (formData.get("category") as string | null) ?? "hazard";
    const description = (formData.get("description") as string | null) ?? "";

    if (!file) {
      return NextResponse.json({ error: "No image file provided." }, { status: 400 });
    }

    const supabase = createAdminClient();

    // ── Generate unique filename ──
    const fileExt = file.name.split(".").pop() ?? "jpg";
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `reports/${fileName}`;

    // ── Convert File to Buffer ──
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // ── Upload to Supabase Storage ──
    const { error: uploadError } = await supabase.storage
      .from("report-attachments")
      .upload(filePath, buffer, {
        contentType: file.type || "image/jpeg",
        upsert: true,
      });

    if (uploadError) {
      console.error("[Storage Upload Error]", uploadError);
      return NextResponse.json({ error: `Storage upload failed: ${uploadError.message}` }, { status: 500 });
    }

    // ── Get Public URL ──
    const { data: { publicUrl } } = supabase.storage
      .from("report-attachments")
      .getPublicUrl(filePath);

    // ── Trigger GPT-4o Vision analysis if service is running ──
    let visionAnalysis = null;
    try {
      const fastapiUrl = process.env.FASTAPI_MICROSERVICE_URL ?? "http://localhost:8000";
      const visionRes = await fetch(`${fastapiUrl}/verify-report-vision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_url: publicUrl,
          category,
          description: description || "Hazard report attachment analysis",
        }),
        signal: AbortSignal.timeout(15000),
      });

      if (visionRes.ok) {
        visionAnalysis = await visionRes.json();
      }
    } catch (vErr) {
      console.warn("[Vision API Notice] Vision microservice offline or timed out, skipping auto-verify.", vErr);
    }

    // ── If report_id provided, update community_reports table ──
    if (reportId) {
      const updateData: any = {
        media_urls: [publicUrl],
      };

      if (visionAnalysis) {
        updateData.ai_verified = visionAnalysis.verified;
        updateData.ai_confidence = visionAnalysis.confidence;
        updateData.ai_analysis = {
          summary: visionAnalysis.ai_summary,
          objects_detected: visionAnalysis.objects_detected,
          severity_assessment: visionAnalysis.severity_assessment,
          recommended_action: visionAnalysis.recommended_action,
        };
        updateData.status = visionAnalysis.verified ? "verified" : "pending";
      }

      await supabase
        .from("community_reports")
        .update(updateData)
        .eq("id", reportId);
    }

    return NextResponse.json({
      success: true,
      public_url: publicUrl,
      file_path: filePath,
      vision_analysis: visionAnalysis,
    });
  } catch (err: any) {
    console.error("[Upload Route Error]", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
