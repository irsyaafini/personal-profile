import { supabase } from '@/lib/supabase'

/**
 * Table: experiences
 *   id, role, organization, location, type (work|education|certification|award),
 *   start_date, end_date, description, highlights (text[]), logo_path, sort_order
 */
export const experiencesService = {
  async list({ type = null } = {}) {
    let query = supabase
      .from('experiences')
      .select('*')
      .order('start_date', { ascending: false })

    if (type) query = query.eq('type', type)

    const { data, error } = await query
    if (error) throw error
    return data ?? []
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .eq('id', id)
      .maybeSingle()
    if (error) throw error
    return data
  },

  async create(payload) {
    const { data, error } = await supabase
      .from('experiences')
      .insert([payload])
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(id, payload) {
    const { data, error } = await supabase
      .from('experiences')
      .update(payload)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async remove(id) {
    const { error } = await supabase
      .from('experiences')
      .delete()
      .eq('id', id)
    if (error) throw error
    return true
  },
}
