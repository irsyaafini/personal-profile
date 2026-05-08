import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.warn(
    '[Supabase] VITE_SUPABASE_URL atau VITE_SUPABASE_ANON_KEY belum di-set. ' +
    'Periksa file .env kamu.'
  )
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '', {
  auth: {
    persistSession: true,       // Session disimpan di localStorage
    autoRefreshToken: true,     // Token di-refresh otomatis sebelum expire
    detectSessionInUrl: true,   // Untuk OAuth callback / magic link
  },
})
