import { useState } from 'react'
import { cn } from '@/utils'

/**
 * Image that fades in once loaded; falls back to a neutral block on error.
 *
 * Defaults:
 *   loading="lazy"   — most images are below the fold
 *   decoding="async" — let the browser decode off the main thread
 *
 * For above-the-fold images (hero avatar, etc.) pass `loading="eager"`
 * and `fetchpriority="high"` to prioritize their fetch.
 */
export function SmartImage({
  src,
  alt = '',
  className = '',
  containerClassName = '',
  loading = 'lazy',
  decoding = 'async',
  ...rest
}) {
  const [loaded, setLoaded] = useState(false)
  const [errored, setErrored] = useState(false)

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
          src={src}
          alt={alt}
          loading={loading}
          decoding={decoding}
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          className={cn(
            'h-full w-full object-cover transition-opacity duration-500',
            loaded ? 'opacity-100' : 'opacity-0',
            className
          )}
          {...rest}
        />
      )}
      {(errored || !src) && (
        <div className="absolute inset-0 flex items-center justify-center text-xs uppercase tracking-widest text-slate-600">
          {alt || 'image'}
        </div>
      )}
    </div>
  )
}
