import { supabase } from '@/lib/supabase'

/**
 * @typedef {Object} Publication
 * @property {string} id
 * @property {string} title
 * @property {string} authors
 * @property {string} journal
 * @property {number} year
 * @property {string|null} volume
 * @property {string|null} issue
 * @property {string|null} pages
 * @property {string|null} doi
 * @property {string|null} link
 * @property {string|null} abstract
 * @property {number} citation_count
 * @property {'journal'|'conference'|'book_chapter'|'report'} publication_type
 * @property {string} created_at
 */

/**
 * Fetch all publications ordered by year desc
 * @returns {Promise<Publication[]>}
 */
export async function fetchPublications() {
  const { data, error } = await supabase
    .from('publications')
    .select('*')
    .order('year', { ascending: false })

  if (error) throw error
  return data
}

/**
 * Create a new publication
 * @param {Omit<Publication, 'id'|'created_at'>} payload
 * @returns {Promise<Publication>}
 */
export async function createPublication(payload) {
  const { data, error } = await supabase
    .from('publications')
    .insert([payload])
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Update an existing publication
 * @param {string} id
 * @param {Partial<Publication>} updates
 * @returns {Promise<Publication>}
 */
export async function updatePublication(id, updates) {
  const { data, error } = await supabase
    .from('publications')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Delete a publication by id
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function deletePublication(id) {
  const { error } = await supabase
    .from('publications')
    .delete()
    .eq('id', id)

  if (error) throw error
}
