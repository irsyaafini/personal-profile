import { motion } from 'framer-motion'

/**
 * Base card component with optional hover animation
 * @param {{
 *   children: React.ReactNode,
 *   className?: string,
 *   hover?: boolean,
 *   onClick?: function,
 *   padding?: boolean
 * }} props
 */
export function Card({ children, className = '', hover = false, onClick, padding = true }) {
  const base = `card-base ${padding ? 'p-6' : ''} ${className}`

  if (hover) {
    return (
      <motion.div
        className={`${base} cursor-pointer`}
        onClick={onClick}
        whileHover={{ y: -4, boxShadow: '0 12px 40px -8px rgba(2, 132, 199, 0.15)' }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    )
  }

  return <div className={base}>{children}</div>
}
