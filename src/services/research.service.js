import { supabase } from '@/lib/supabase'

/**
 * Table: research
 *   id, title, summary, description, status (ongoing|completed|published),
 *   tags (text[]), cover_path, repo_url, demo_url, started_at, ended_at, created_at
 */
export const researchService = {
  async list({ limit = null, status = null } = {}) {
    let query = supabase
      .from('research')
      .select('*')
      .order('started_at', { ascending: false })

    if (status) query = query.eq('status', status)
    if (limit) query = query.limit(limit)

    const { data, error } = await query
    if (error) throw error
    return data ?? []
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('research')
      .select('*')
      .eq('id', id)
      .maybeSingle()
    if (error) throw error
    return data
  },

  async create(payload) {
    const { data, error } = await supabase
      .from('research')
      .insert([payload])
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(id, payload) {
    const { data, error } = await supabase
      .from('research')
      .update(payload)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async remove(id) {
    const { error } = await supabase
      .from('research')
      .delete()
      .eq('id', id)
    if (error) throw error
    return true
  },
}
