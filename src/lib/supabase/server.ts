import { createClient, SupabaseClient } from "@supabase/supabase-js";

export function isSupabaseConfigured() {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
/** सार्वजनिक (RLS से सीमित) क्लाइंट */
export function publicClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { auth: { persistSession: false } });
}
/** केवल सर्वर: service-role key. इसे कभी ब्राउज़र कोड में import न करें। */
export function adminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}
