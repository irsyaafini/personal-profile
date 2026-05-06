import { supabase } from '@/lib/supabase'
import { STORAGE_BUCKET } from '@/constants'

/**
 * @typedef {Object} Profile
 * @property {string} id
 * @property {string} name
 * @property {string} title
 * @property {string} subtitle
 * @property {string} bio
 * @property {string|null} photo_url
 * @property {string} email
 * @property {string} location
 * @property {string|null} linkedin_url
 * @property {string|null} orcid_id
 * @property {number} years_experience
 */

/**
 * Fetch the single profile record
 * @returns {Promise<Profile>}
 */
export async function fetchProfile() {
  const { data, error } = await supabase
    .from('profile')
    .select('*')
    .single()

  if (error) throw error
  return data
}

/**
 * Update profile data
 * @param {string} id
 * @param {Partial<Profile>} updates
 * @returns {Promise<Profile>}
 */
export async function updateProfile(id, updates) {
  const { data, error } = await supabase
    .from('profile')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Upload profile photo to storage
 * @param {File} file
 * @returns {Promise<string>} public URL
 */
export async function uploadProfilePhoto(file) {
  const fileExt = file.name.split('.').pop()
  const fileName = `profile/avatar.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(fileName, file, { upsert: true })

  if (uploadError) throw uploadError

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(fileName)
  return data.publicUrl
}
