import { useState, useRef } from 'react'
import { Upload, X, Loader2 } from 'lucide-react'
import { uploadFile, resolveImage, deleteFile } from '@/lib/storage'
import { cn } from '@/utils'

function formatBytes(n) {
  if (!n) return '0 B'
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`
  return `${(n / 1024 / 1024).toFixed(1)} MB`
}

/**
 * Image uploader that auto-compresses raster images before upload.
 *
 * @param {string} value         storage path (or URL)
 * @param {(path: string) => void} onChange  receives the new path or '' on remove
 * @param {string} folder        subfolder inside the bucket (e.g., "gallery", "avatars")
 * @param {string} [label]
 */
export function ImageUpload({ value, onChange, folder = 'misc', label = 'Image', className = '' }) {
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState(null) // { stage: 'compress'|'upload', original, compressed }
  const [error, setError] = useState(null)
  const fileRef = useRef(null)

  const previewSrc = resolveImage(value)

  const handleFiles = async (files) => {
    const file = files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.')
      return
    }
    setError(null)
    setBusy(true)
    setProgress({ stage: 'compress', original: file.size })
    try {
      // Best-effort delete previous storage object
      if (value && !value.startsWith('http')) {
        await deleteFile(value)
      }
      const { path } = await uploadFile(file, { folder })
      onChange(path)
      setProgress(null)
    } catch (err) {
      setError(err.message || 'Upload failed')
      setProgress(null)
    } finally {
      setBusy(false)
    }
  }

  const handleRemove = async () => {
    if (busy) return
    setBusy(true)
    try {
      if (value && !value.startsWith('http')) {
        await deleteFile(value)
      }
      onChange('')
    } finally {
      setBusy(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    if (busy) return
    handleFiles(e.dataTransfer.files)
  }

  return (
    <div className={cn('space-y-2', className)}>
      {label && <p className="label">{label}</p>}

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className={cn(
          'relative rounded-xl border border-dashed border-white/15 bg-white/[0.02] overflow-hidden',
          previewSrc ? '' : 'aspect-[16/9] flex items-center justify-center',
        )}
      >
        {previewSrc ? (
          <div className="relative">
            <img
              src={previewSrc}
              alt=""
              className="w-full max-h-72 object-cover"
            />
            <button
              type="button"
              onClick={handleRemove}
              disabled={busy}
              className="absolute top-2 right-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/70 border border-white/20 text-white/85 hover:bg-black hover:text-white transition disabled:opacity-50"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center px-6 py-8">
            {busy ? (
              <Loader2 className="h-6 w-6 text-white/60 animate-spin mb-3" />
            ) : (
              <Upload className="h-6 w-6 text-white/50 mb-3" />
            )}
            <p className="text-sm text-white/65">
              {busy ? 'Processing & uploading…' : 'Drag & drop an image, or'}
            </p>
            {!busy && (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="mt-2 text-sm font-medium text-white underline-offset-4 hover:underline"
              >
                browse files
              </button>
            )}
            {progress && (
              <p className="mt-2 text-[11px] text-white/45">
                Compressing {formatBytes(progress.original)}…
              </p>
            )}
          </div>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {previewSrc && !busy && (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="text-xs text-white/55 hover:text-white underline-offset-4 hover:underline"
        >
          Replace image
        </button>
      )}

      {error && <p className="text-xs text-rose-400">{error}</p>}

      <p className="text-[11px] text-white/35">
        Stored path: <span className="font-mono">{value || '—'}</span>
      </p>
      <p className="text-[10px] text-white/30 leading-relaxed">
        Images are automatically resized to max 1600px and JPEG-compressed (~80% quality)
        before upload to keep your site fast.
      </p>
    </div>
  )
}
