import { supabase } from '@/lib/supabase'

/**
 * Table: skills
 *   id, name, category, level (1-5), sort_order
 */
export const skillsService = {
  async list() {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('category', { ascending: true })
      .order('sort_order', { ascending: true, nullsFirst: false })
      .order('name', { ascending: true })

    if (error) throw error
    return data ?? []
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('id', id)
      .maybeSingle()
    if (error) throw error
    return data
  },

  async create(payload) {
    const { data, error } = await supabase
      .from('skills')
      .insert([payload])
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(id, payload) {
    const { data, error } = await supabase
      .from('skills')
      .update(payload)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async remove(id) {
    const { error } = await supabase
      .from('skills')
      .delete()
      .eq('id', id)
    if (error) throw error
    return true
  },
}
