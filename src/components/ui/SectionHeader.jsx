import { cn } from '@/utils'

/**
 * Elegant section heading: small uppercase eyebrow with a leading rule,
 * a bold display title, and an optional muted description.
 */
export function SectionHeader({ eyebrow, title, description, align = 'left', className = '' }) {
  const alignClass = align === 'center' ? 'text-center mx-auto' : ''
  return (
    <div className={cn('max-w-3xl', alignClass, className)}>
      {eyebrow && <p className="section-label mb-5">{eyebrow}</p>}
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-semibold tracking-[-0.025em] leading-[1.05] text-white">
        {title}
      </h2>
      {description && (
        <p className="mt-5 text-base sm:text-lg text-white/55 leading-relaxed font-light">
          {description}
        </p>
      )}
    </div>
  )
}
