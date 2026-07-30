import { createClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase admin client using the SUPABASE_SERVICE_ROLE_KEY.
 * WARNING: This client bypasses Row-Level Security (RLS) policies.
 * ONLY use this client in secure server-side API handlers or internal services.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables."
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
