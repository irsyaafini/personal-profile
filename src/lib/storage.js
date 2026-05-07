import { supabase } from './supabase'
import { STORAGE_BUCKET } from '@/constants'

/**
 * Get public URL from a Supabase storage path
 */
export function getPublicUrl(path, bucket = STORAGE_BUCKET) {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data?.publicUrl ?? ''
}

/**
 * Resolve any image-like field — url, path, or null — to a usable src.
 */
export function resolveImage(pathOrUrl, bucket) {
  return getPublicUrl(pathOrUrl, bucket)
}

/**
 * Upload a File/Blob to Supabase Storage. Returns the storage path
 * (relative to bucket) suitable for storing in DB columns like
 * `avatar_url`, `image_path`, `cover_path`, `pdf_path`.
 *
 * @param {File} file
 * @param {object} options
 * @param {string} options.folder  — subfolder inside bucket (e.g., "gallery", "research", "avatars")
 * @param {string} [options.bucket]
 * @returns {Promise<{ path: string, publicUrl: string }>}
 */
export async function uploadFile(file, { folder = 'misc', bucket = STORAGE_BUCKET } = {}) {
  if (!file) throw new Error('No file provided')

  // Generate a unique filename to avoid collisions
  const ext = file.name.split('.').pop()?.toLowerCase() || 'bin'
  const safeBase = file.name
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .toLowerCase()
    .slice(0, 40)
  const filename = `${Date.now()}-${safeBase}.${ext}`
  const path = `${folder}/${filename}`

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type || undefined,
    })
  if (error) throw error

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return { path, publicUrl: data?.publicUrl ?? '' }
}

/**
 * Delete a file by storage path (relative to bucket).
 * Silent on missing file. Returns true on success.
 */
export async function deleteFile(path, bucket = STORAGE_BUCKET) {
  if (!path) return true
  // Don't try to delete external URLs
  if (path.startsWith('http://') || path.startsWith('https://')) return true

  const { error } = await supabase.storage.from(bucket).remove([path])
  if (error) {
    // eslint-disable-next-line no-console
    console.warn('[deleteFile]', error.message)
    return false
  }
  return true
}
