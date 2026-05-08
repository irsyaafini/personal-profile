import { useState, useRef, useEffect, memo } from 'react'
import { cn } from '@/utils'

/**
 * SmartImage — gambar yang fade-in setelah dimuat, dengan dukungan:
 *
 * OPTIMASI yang diterapkan:
 * 1. loading="lazy" default — browser-native lazy load untuk gambar below-the-fold
 * 2. decoding="async" — decode gambar off main thread
 * 3. fetchpriority prop — beri prioritas tinggi untuk gambar above-the-fold (hero avatar)
 * 4. Fallback error state yang rapi
 * 5. memo() — cegah re-render saat parent render ulang dengan props sama
 *
 * Untuk gambar hero/above-the-fold, gunakan:
 *   <SmartImage loading="eager" fetchPriority="high" />
 */
const SmartImage = memo(function SmartImage({
  src,
  alt = '',
  className = '',
  containerClassName = '',
  loading = 'lazy',
  decoding = 'async',
  fetchPriority,        // 'high' | 'low' | 'auto' — untuk hero images pakai 'high'
  sizes,                // srcset sizes string, mis: "(max-width: 640px) 100vw, 50vw"
  ...rest
}) {
  const [loaded, setLoaded]   = useState(false)
  const [errored, setErrored] = useState(false)
  const imgRef = useRef(null)

  // OPTIMASI: Tangani kasus gambar sudah ada di browser cache —
  // event onLoad tidak selalu trigger untuk cached images.
  useEffect(() => {
    const img = imgRef.current
    if (img && img.complete && img.naturalWidth > 0) {
      setLoaded(true)
    }
  }, [src])

  const handleLoad = () => setLoaded(true)
  const handleError = () => setErrored(true)

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        'bg-gradient-to-br from-white/[0.04] to-white/[0.01]',
        containerClassName
      )}
    >
      {!errored && src && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading={loading}
          decoding={decoding}
          fetchPriority={fetchPriority}
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
        <div className="absolute inset-0 flex items-center justify-center text-xs uppercase tracking-widest text-slate-600 select-none">
          {alt || 'image'}
        </div>
      )}
    </div>
  )
})

export { SmartImage }
export default SmartImage
