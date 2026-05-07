import { cn } from '@/utils'

/**
 * Monochrome badge system. Old variants (cyan/amber/slate) are
 * aliased so existing callers still work without code changes.
 */
const VARIANTS = {
  light: 'badge-light',
  outline: 'badge-outline',
  dark: 'badge-dark',
  // legacy aliases
  cyan: 'badge-light',
  amber: 'badge-outline',
  slate: 'badge-dark',
}

export function Badge({ variant = 'outline', className = '', children, ...props }) {
  return (
    <span className={cn(VARIANTS[variant] ?? VARIANTS.outline, className)} {...props}>
      {children}
    </span>
  )
}
