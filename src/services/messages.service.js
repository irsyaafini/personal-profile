import { supabase } from '@/lib/supabase'

/**
 * Table: messages
 *   id, name, email, subject, message, read, created_at
 */
export const messagesService = {
  async create({ name, email, subject, message }) {
    const { data, error } = await supabase
      .from('messages')
      .insert([{ name, email, subject, message, read: false }])
      .select()
      .single()
    if (error) throw error
    return data
  },

  async list({ unreadOnly = false } = {}) {
    let query = supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })
    if (unreadOnly) query = query.eq('read', false)

    const { data, error } = await query
    if (error) throw error
    return data ?? []
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('id', id)
      .maybeSingle()
    if (error) throw error
    return data
  },

  async markRead(id, read = true) {
    const { data, error } = await supabase
      .from('messages')
      .update({ read })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async remove(id) {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', id)
    if (error) throw error
    return true
  },
}
