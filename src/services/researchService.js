import { supabase } from '@/lib/supabase'

/**
 * @typedef {Object} ResearchProject
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} dataset_info
 * @property {string} findings
 * @property {Array<Object>} visualization_data
 * @property {string[]} tags
 * @property {'ongoing'|'completed'|'published'} status
 * @property {number} year
 * @property {string|null} image_url
 * @property {string} created_at
 */

/**
 * Fetch all research projects ordered by year desc
 * @returns {Promise<ResearchProject[]>}
 */
export async function fetchResearch() {
  const { data, error } = await supabase
    .from('research_projects')
    .select('*')
    .order('year', { ascending: false })

  if (error) throw error
  return data
}

/**
 * Fetch single research project by id
 * @param {string} id
 * @returns {Promise<ResearchProject>}
 */
export async function fetchResearchById(id) {
  const { data, error } = await supabase
    .from('research_projects')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

/**
 * Create a new research project
 * @param {Omit<ResearchProject, 'id'|'created_at'>} payload
 * @returns {Promise<ResearchProject>}
 */
export async function createResearch(payload) {
  const { data, error } = await supabase
    .from('research_projects')
    .insert([payload])
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Update an existing research project
 * @param {string} id
 * @param {Partial<ResearchProject>} updates
 * @returns {Promise<ResearchProject>}
 */
export async function updateResearch(id, updates) {
  const { data, error } = await supabase
    .from('research_projects')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Delete a research project by id
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function deleteResearch(id) {
  const { error } = await supabase
    .from('research_projects')
    .delete()
    .eq('id', id)

  if (error) throw error
}
