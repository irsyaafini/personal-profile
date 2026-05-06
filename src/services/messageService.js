import { supabase } from '@/lib/supabase'

/**
 * @typedef {Object} Message
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string|null} subject
 * @property {string} message
 * @property {boolean} is_read
 * @property {string} created_at
 */

/**
 * @typedef {Object} MessagePayload
 * @property {string} name
 * @property {string} email
 * @property {string} subject
 * @property {string} message
 */

/**
 * Send a contact message (public)
 * @param {MessagePayload} payload
 * @returns {Promise<Message>}
 */
export async function sendMessage(payload) {
  const { data, error } = await supabase
    .from('messages')
    .insert([payload])
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Fetch all messages (admin only)
 * @returns {Promise<Message[]>}
 */
export async function fetchMessages() {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

/**
 * Mark message as read (admin only)
 * @param {string} id
 * @returns {Promise<Message>}
 */
export async function markMessageRead(id) {
  const { data, error } = await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Delete a message (admin only)
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function deleteMessage(id) {
  const { error } = await supabase
    .from('messages')
    .delete()
    .eq('id', id)

  if (error) throw error
}

/**
 * Fetch aggregate stats for admin dashboard
 * @returns {Promise<{research: number, publications: number, messages: number, unread: number}>}
 */
export async function fetchDashboardStats() {
  const [research, publications, messages] = await Promise.all([
    supabase.from('research_projects').select('id', { count: 'exact', head: true }),
    supabase.from('publications').select('id', { count: 'exact', head: true }),
    supabase.from('messages').select('id, is_read', { count: 'exact' }),
  ])

  const unread = messages.data?.filter(m => !m.is_read).length ?? 0

  return {
    research: research.count ?? 0,
    publications: publications.count ?? 0,
    messages: messages.count ?? 0,
    unread,
  }
}
