import { useState } from 'react'
import { cn, getInitials } from '@/utils'

export function Avatar({ src, name = '', size = 'md', className = '' }) {
  const [errored, setErrored] = useState(false)
  const sizeMap = {
    sm: 'h-10 w-10 text-xs',
    md: 'h-14 w-14 text-sm',
    lg: 'h-24 w-24 text-lg',
    xl: 'h-32 w-32 text-2xl',
    '2xl': 'h-40 w-40 sm:h-48 sm:w-48 text-3xl',
  }
  const dim = sizeMap[size] ?? sizeMap.md

  const showImg = src && !errored
  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center rounded-full overflow-hidden',
        'bg-gradient-to-br from-white/10 to-white/[0.02]',
        'border border-white/10',
        dim,
        className
      )}
    >
      {showImg ? (
        <img
          src={src}
          alt={name}
          loading="lazy"
          onError={() => setErrored(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="font-semibold text-white/70">{getInitials(name)}</span>
      )}
    </div>
  )
}
