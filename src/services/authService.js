import { supabase } from '@/lib/supabase'

/**
 * @typedef {Object} AuthCredentials
 * @property {string} email
 * @property {string} password
 */

/**
 * Sign in with email and password
 * @param {AuthCredentials} credentials
 * @returns {Promise<{user: import('@supabase/supabase-js').User|null, error: Error|null}>}
 */
export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { user: data?.user ?? null, error }
}

/**
 * Sign out current user
 * @returns {Promise<{error: Error|null}>}
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

/**
 * Get current session
 * @returns {Promise<import('@supabase/supabase-js').Session|null>}
 */
export async function getSession() {
  const { data } = await supabase.auth.getSession()
  return data?.session ?? null
}

/**
 * Subscribe to auth state changes
 * @param {function} callback
 * @returns {function} unsubscribe function
 */
export function onAuthStateChange(callback) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null)
  })
  return () => subscription.unsubscribe()
}
