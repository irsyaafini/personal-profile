import { useState } from 'react'
import { cn } from '@/utils'

/**
 * Image that fades in once loaded; falls back to a neutral block on error.
 */
export function SmartImage({ src, alt = '', className = '', containerClassName = '', ...rest }) {
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
          loading="lazy"
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
