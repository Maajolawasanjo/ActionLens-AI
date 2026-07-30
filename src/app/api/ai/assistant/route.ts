import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const schema = z.object({
  query:  z.string().min(2),
  role:   z.string().default("government"),
  region: z.string().default("East Africa"),
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

    // ── Call FastAPI RAG endpoint ──
    const fastapiRes = await fetch(`${FASTAPI_URL}/rag-query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
      signal: AbortSignal.timeout(25000),
    });

    if (!fastapiRes.ok) {
      const err = await fastapiRes.json().catch(() => ({}));
      throw new Error(err.detail ?? `FastAPI RAG error ${fastapiRes.status}`);
    }

    const ragResult = await fastapiRes.json();
    return NextResponse.json({ success: true, ...ragResult });
  } catch (err: any) {
    console.error("[RAG Assistant Error]", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
