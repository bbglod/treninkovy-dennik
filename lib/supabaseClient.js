import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseKey)

export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl, supabaseKey)
  : null

export function getSupabaseConfigError() {
  if (!supabaseUrl) return 'Chybí NEXT_PUBLIC_SUPABASE_URL.'
  if (!supabaseKey) return 'Chybí NEXT_PUBLIC_SUPABASE_ANON_KEY.'
  return null
}