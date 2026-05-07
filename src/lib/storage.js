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
 * Compress + resize an image File on the client using Canvas before upload.
 * Returns a JPEG/WEBP Blob and target extension.
 *
 * - Skips compression for SVG / GIF (preserves animation/vectors)
 * - Maintains aspect ratio
 * - Defaults: max 1600px on the longest edge, JPEG quality 0.82
 *
 * @param {File} file
 * @param {object} [opts]
 * @param {number} [opts.maxDim=1600]   max width/height in px
 * @param {number} [opts.quality=0.82]  JPEG/WEBP quality 0-1
 * @param {'image/jpeg'|'image/webp'} [opts.mimeType='image/jpeg']
 */
export async function compressImage(file, opts = {}) {
  const { maxDim = 1600, quality = 0.82, mimeType = 'image/jpeg' } = opts

  // Pass-through for non-rasterizable images
  if (!file.type.startsWith('image/')) return { blob: file, ext: file.name.split('.').pop()?.toLowerCase() || 'bin' }
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return { blob: file, ext: file.type === 'image/svg+xml' ? 'svg' : 'gif' }
  }

  // Decode the image
  const dataUrl = await new Promise((res, rej) => {
    const r = new FileReader()
    r.onload = () => res(r.result)
    r.onerror = () => rej(new Error('Failed to read file'))
    r.readAsDataURL(file)
  })

  const img = await new Promise((res, rej) => {
    const i = new Image()
    i.onload = () => res(i)
    i.onerror = () => rej(new Error('Failed to decode image'))
    i.src = dataUrl
  })

  // Compute target size keeping aspect ratio
  let { width, height } = img
  const longest = Math.max(width, height)
  if (longest > maxDim) {
    const scale = maxDim / longest
    width = Math.round(width * scale)
    height = Math.round(height * scale)
  }

  // Skip re-encode if image is already small AND under 300KB — no benefit
  if (longest <= maxDim && file.size <= 300 * 1024 && (file.type === 'image/jpeg' || file.type === 'image/webp')) {
    return { blob: file, ext: file.type === 'image/webp' ? 'webp' : 'jpg' }
  }

  // Render & encode
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  // Draw a white background first to avoid PNG transparency turning black on JPEG
  if (mimeType === 'image/jpeg') {
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)
  }
  ctx.drawImage(img, 0, 0, width, height)

  const blob = await new Promise((res) => canvas.toBlob(res, mimeType, quality))
  if (!blob) throw new Error('Failed to encode image')

  // Fallback: if compressed is somehow larger, keep original
  if (blob.size >= file.size) {
    return { blob: file, ext: file.name.split('.').pop()?.toLowerCase() || 'jpg' }
  }

  return { blob, ext: mimeType === 'image/webp' ? 'webp' : 'jpg' }
}

/**
 * Upload a File/Blob to Supabase Storage. For raster images, the file is
 * automatically resized + JPEG-compressed before upload. Returns the
 * stored path (relative to bucket).
 *
 * @param {File} file
 * @param {object} [options]
 * @param {string} [options.folder='misc']     subfolder inside bucket
 * @param {string} [options.bucket]
 * @param {boolean} [options.compress=true]    set false to keep original bytes
 * @param {number}  [options.maxDim=1600]      max longest edge in px
 * @param {number}  [options.quality=0.82]     JPEG quality 0-1
 */
export async function uploadFile(file, options = {}) {
  if (!file) throw new Error('No file provided')

  const {
    folder = 'misc',
    bucket = STORAGE_BUCKET,
    compress = true,
    maxDim = 1600,
    quality = 0.82,
  } = options

  // Compress if it's a raster image and compression is enabled
  let bodyBlob = file
  let ext = file.name.split('.').pop()?.toLowerCase() || 'bin'
  let contentType = file.type || undefined

  if (compress && file.type?.startsWith('image/')) {
    const result = await compressImage(file, { maxDim, quality, mimeType: 'image/jpeg' })
    bodyBlob = result.blob
    ext = result.ext
    contentType = bodyBlob.type || contentType
  }

  // Generate a unique filename to avoid collisions
  const safeBase = file.name
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .toLowerCase()
    .slice(0, 40)
  const filename = `${Date.now()}-${safeBase}.${ext}`
  const path = `${folder}/${filename}`

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, bodyBlob, {
      cacheControl: '31536000', // 1 year — files are uniquely-named so safe
      upsert: false,
      contentType,
    })
  if (error) throw error

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return { path, publicUrl: data?.publicUrl ?? '' }
}

/**
 * Delete a file by storage path (relative to bucket).
 */
export async function deleteFile(path, bucket = STORAGE_BUCKET) {
  if (!path) return true
  if (path.startsWith('http://') || path.startsWith('https://')) return true

  const { error } = await supabase.storage.from(bucket).remove([path])
  if (error) {
    // eslint-disable-next-line no-console
    console.warn('[deleteFile]', error.message)
    return false
  }
  return true
}
