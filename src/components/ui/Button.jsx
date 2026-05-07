import { cn } from '@/utils'

/**
 * Monochrome button system.
 *  - solid:   white background, black text — primary CTA
 *  - outline: transparent w/ hairline border — secondary CTA
 *  - ghost:   text-only with subtle hover — tertiary
 *
 * Backwards compatibility: old variant `cyan` maps to `outline`
 * so existing pages/sections continue to render without edits.
 */
const VARIANTS = {
  solid: 'btn-solid',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
  // legacy alias — keep old call sites working
  cyan: 'btn-outline',
}

export function Button({
  as: Tag = 'button',
  variant = 'outline',
  className = '',
  children,
  ...props
}) {
  const variantClass = VARIANTS[variant] ?? VARIANTS.outline
  return (
    <Tag className={cn(variantClass, className)} {...props}>
      {children}
    </Tag>
  )
}
