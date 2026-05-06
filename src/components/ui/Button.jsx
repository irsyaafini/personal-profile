import { motion } from 'framer-motion'

/**
 * @typedef {'primary'|'secondary'|'ghost'|'danger'} ButtonVariant
 * @typedef {'sm'|'md'|'lg'} ButtonSize
 */

const variantClasses = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  danger: 'bg-red-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-700 transition-colors',
}

const sizeClasses = {
  sm: 'text-sm px-4 py-2',
  md: '',
  lg: 'text-lg px-8 py-4',
}

/**
 * Reusable Button component
 * @param {{
 *   children: React.ReactNode,
 *   variant?: ButtonVariant,
 *   size?: ButtonSize,
 *   isLoading?: boolean,
 *   disabled?: boolean,
 *   onClick?: function,
 *   type?: 'button'|'submit'|'reset',
 *   className?: string,
 * }} props
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
}) {
  const baseClass = variantClasses[variant] ?? variantClasses.primary
  const sizeClass = sizeClasses[size] ?? ''

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      whileTap={{ scale: 0.97 }}
      className={`${baseClass} ${sizeClass} ${className} disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2`}
    >
      {isLoading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </motion.button>
  )
}
