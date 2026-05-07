import { cn } from '@/utils'

export function Skeleton({ className = '' }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-xl',
        'bg-gradient-to-r from-white/[0.04] via-white/[0.07] to-white/[0.04]',
        className
      )}
    />
  )
}
