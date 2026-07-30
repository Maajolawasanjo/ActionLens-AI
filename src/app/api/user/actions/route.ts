import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const toggleSchema = z.object({
  task_id: z.string().uuid(),
  status:  z.enum(["pending", "completed"]),
});

export async function PATCH(req: Request) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = toggleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request body", details: parsed.error.flatten() }, { status: 400 });
    }

    const { task_id, status } = parsed.data;

    const { data, error } = await supabase
      .from("user_actions")
      .update({
        status:       status,
        completed_at: status === "completed" ? new Date().toISOString() : null,
      })
      .eq("id", task_id)
      .eq("user_id", user.id) // Enforce ownership — users can only update their own tasks
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, action: data });
  } catch (err: any) {
    console.error("[Task Toggle Error]", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Create a new action item linked to a recommendation
export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { recommendation_id, task_text } = body;

    if (!task_text?.trim()) {
      return NextResponse.json({ error: "task_text is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("user_actions")
      .insert({
        user_id:           user.id,
        recommendation_id: recommendation_id ?? null,
        task_text:         task_text.trim(),
        status:            "pending",
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, action: data }, { status: 201 });
  } catch (err: any) {
    console.error("[Task Create Error]", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
