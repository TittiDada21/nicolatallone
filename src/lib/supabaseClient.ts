import { createClient, SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let client: SupabaseClient | null = null

if (url && anonKey) {
  client = createClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })
} else {
  console.warn(
    'Supabase non configurato: definisci VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY in .env.local',
  )
}

export const supabase = client
export const hasSupabase = Boolean(client)

