import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Erstellt einen serverseitigen Supabase-Client mit Service Role Key
 * Nur in API-Routen und Server-Komponenten verwenden!
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('SUPABASE_URL oder SUPABASE_SERVICE_ROLE_KEY nicht gesetzt');
  }

  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}
