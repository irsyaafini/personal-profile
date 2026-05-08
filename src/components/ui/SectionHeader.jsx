import { cn } from '@/utils'

/**
 * Elegant section heading: small uppercase eyebrow with a leading rule,
 * a bold display title, and an optional muted description.
 */
/**
 * SPACING FIX:
 * - eyebrow mb: mb-5 → mb-3
 * - title size: lg:text-[3.5rem] → lg:text-[3rem] (lebih compact)
 * - description mt: mt-5 → mt-3
 */
export function SectionHeader({ eyebrow, title, description, align = 'left', className = '' }) {
  const alignClass = align === 'center' ? 'text-center mx-auto' : ''
  return (
    <div className={cn('max-w-3xl', alignClass, className)}>
      {eyebrow && <p className="section-label mb-3">{eyebrow}</p>}
      <h2 className="text-3xl sm:text-4xl md:text-[2.75rem] lg:text-[3rem] font-semibold tracking-[-0.025em] leading-[1.08] text-white">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-base text-white/55 leading-relaxed font-light">
          {description}
        </p>
      )}
    </div>
  )
}
