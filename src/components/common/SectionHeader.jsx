import { motion } from 'framer-motion'

/**
 * Reusable section header with animated underline accent
 * @param {{
 *   eyebrow?: string,
 *   title: string,
 *   subtitle?: string,
 *   align?: 'left'|'center',
 *   className?: string
 * }} props
 */
export function SectionHeader({ eyebrow, title, subtitle, align = 'center', className = '' }) {
  const alignClass = align === 'center' ? 'text-center items-center' : 'text-left items-start'

  return (
    <motion.div
      className={`flex flex-col gap-3 ${alignClass} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {eyebrow && (
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 uppercase tracking-widest">
          <span className="w-6 h-0.5 bg-primary-400 rounded" />
          {eyebrow}
          <span className="w-6 h-0.5 bg-primary-400 rounded" />
        </span>
      )}
      <h2 className="text-3xl lg:text-4xl font-display font-bold text-slate-900 text-balance">
        {title}
      </h2>
      {subtitle && (
        <p className="text-slate-500 text-lg max-w-2xl text-balance leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
