import { create } from 'zustand'
import { supabase } from '@/lib/supabase'

/**
 * Auth Store — wraps Supabase Auth.
 *
 * OPTIMASI & Keamanan:
 * 1. Role-check: hanya user dengan app_metadata.role === 'admin' yang diizinkan.
 *    Set via Supabase Dashboard > Authentication > Users > Raw app_meta_data: { "role": "admin" }
 *
 * 2. Listener cleanup yang benar — mencegah memory leak.
 *
 * 3. Double-init guard via _initialized flag (lebih sederhana dari _unsubscribe check).
 *
 * 4. OPTIMASI: `loading` state dimulai dari `true` dan hanya berubah ke `false`
 *    setelah getSession() selesai — mencegah flash content yang salah.
 *
 * 5. OPTIMASI: signIn tidak menyimpan state parsial jika role check gagal —
 *    langsung signOut lalu throw.
 */
export const useAuthStore = create((set, get) => ({
  session:      null,
  user:         null,
  isAdmin:      false,
  loading:      true,
  _initialized: false,
  _subscription: null,

  init: async () => {
    // Cegah double-init (StrictMode, HMR, dll)
    if (get()._initialized) return
    set({ _initialized: true })

    try {
      const { data: { session } } = await supabase.auth.getSession()
      set({
        session:  session ?? null,
        user:     session?.user ?? null,
        isAdmin:  _checkAdmin(session?.user),
        loading:  false,
      })
    } catch {
      // Gagal ambil session — anggap unauthenticated
      set({ loading: false })
    }

    // Subscribe ke perubahan auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      set({
        session,
        user:    session?.user ?? null,
        isAdmin: _checkAdmin(session?.user),
      })
    })

    set({ _subscription: subscription })
  },

  signIn: async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error

    // Role check — jika bukan admin, logout segera dan lempar error deskriptif
    if (!_checkAdmin(data.user)) {
      await supabase.auth.signOut()
      throw new Error('Akun ini tidak memiliki akses admin.')
    }

    set({ session: data.session, user: data.user, isAdmin: true })
    return data
  },

  signOut: async () => {
    // OPTIMASI: Unsubscribe listener sebelum signOut agar tidak ada spurious state update
    const sub = get()._subscription
    if (sub) sub.unsubscribe()

    await supabase.auth.signOut()
    set({ session: null, user: null, isAdmin: false, _initialized: false, _subscription: null })
  },
}))

/** Cek apakah user punya role 'admin' di app_metadata */
function _checkAdmin(user) {
  if (!user) return false
  return user.app_metadata?.role === 'admin'
}
