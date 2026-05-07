import { supabase } from '@/lib/supabase'

/**
 * Table: gallery
 *   id, title, caption, image_path, taken_at, location, tags (text[]),
 *   sort_order, created_at
 */
export const galleryService = {
  async list({ limit = null } = {}) {
    let query = supabase
      .from('gallery')
      .select('*')
      .order('sort_order', { ascending: true, nullsFirst: false })
      .order('taken_at', { ascending: false })

    if (limit) query = query.limit(limit)

    const { data, error } = await query
    if (error) throw error
    return data ?? []
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .eq('id', id)
      .maybeSingle()
    if (error) throw error
    return data
  },

  async create(payload) {
    const { data, error } = await supabase
      .from('gallery')
      .insert([payload])
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(id, payload) {
    const { data, error } = await supabase
      .from('gallery')
      .update(payload)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async remove(id) {
    const { error } = await supabase
      .from('gallery')
      .delete()
      .eq('id', id)
    if (error) throw error
    return true
  },
}
