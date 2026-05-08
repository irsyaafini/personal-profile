import { useState, useRef, useEffect, memo } from 'react'
import { cn } from '@/utils'

/**
 * SmartImage — gambar yang fade-in setelah dimuat (OPTIMIZED).
 *
 * OPTIMASI yang diterapkan:
 * 1. loading="lazy" default — browser-native lazy load untuk gambar below-the-fold
 * 2. decoding="async" — decode gambar off main thread
 * 3. fetchpriority prop — beri prioritas tinggi untuk gambar above-the-fold
 * 4. width + height — WAJIB untuk mencegah CLS. Browser akan reservasi ruang
 *    sebelum gambar dimuat. Kalau tidak ada, container pakai aspectRatio.
 * 5. Fallback error state yang rapi
 * 6. memo() — cegah re-render saat parent render ulang dengan props sama
 *
 * Untuk gambar hero/above-the-fold:
 *   <SmartImage loading="eager" fetchPriority="high" width={400} height={400} />
 *
 * Untuk gambar lain (default lazy):
 *   <SmartImage src="..." width={300} height={200} />
 *   atau pakai aspectRatio:
 *   <SmartImage src="..." containerClassName="aspect-video" />
 */
const SmartImage = memo(function SmartImage({
  src,
  alt = '',
  className = '',
  containerClassName = '',
  loading = 'lazy',
  decoding = 'async',
  fetchPriority,
  sizes,
  width,                 // ← NEW: pass-through ke <img> untuk reservasi ruang
  height,                // ← NEW: pass-through ke <img> untuk reservasi ruang
  aspectRatio,           // ← NEW: kalau width/height tidak diberi, pakai aspect-ratio
  ...rest
}) {
  const [loaded, setLoaded]   = useState(false)
  const [errored, setErrored] = useState(false)
  const imgRef = useRef(null)

  useEffect(() => {
    const img = imgRef.current
    if (img && img.complete && img.naturalWidth > 0) {
      setLoaded(true)
    }
  }, [src])

  const handleLoad = () => setLoaded(true)
  const handleError = () => setErrored(true)

  // OPTIMASI CLS: container punya aspect-ratio agar ruang ter-reservasi
  // bahkan sebelum gambar selesai diload.
  const containerStyle = aspectRatio
    ? { aspectRatio }
    : (width && height ? { aspectRatio: `${width} / ${height}` } : undefined)

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        'bg-gradient-to-br from-white/[0.04] to-white/[0.01]',
        containerClassName
      )}
      style={containerStyle}
    >
      {!errored && src && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          decoding={decoding}
          fetchpriority={fetchPriority}
          sizes={sizes}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'h-full w-full object-cover transition-opacity duration-500',
            loaded ? 'opacity-100' : 'opacity-0',
            className
          )}
          {...rest}
        />
      )}
      {(errored || !src) && (
        <div className="absolute inset-0 flex items-center justify-center text-xs uppercase tracking-widest text-white/30 select-none">
          {alt || 'image'}
        </div>
      )}
    </div>
  )
})

export { SmartImage }
export default SmartImage