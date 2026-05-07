import { supabase } from '@/lib/supabase'

/**
 * Singleton profile.
 * Table: profile
 *   id, full_name, headline, bio, avatar_url, cover_url, location,
 *   email, phone, website, birth_date, languages (text[]), interests (text[]),
 *   socials (jsonb)
 */
export const profileService = {
  async getProfile() {
    const { data, error } = await supabase
      .from('profile')
      .select('*')
      .limit(1)
      .maybeSingle()

    if (error) throw error
    return data
  },

  /**
   * Upsert the singleton profile row.
   * If `id` is provided in payload, updates that row; otherwise inserts.
   */
  async upsert(payload) {
    const { data, error } = await supabase
      .from('profile')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single()
    if (error) throw error
    return data
  },
}
