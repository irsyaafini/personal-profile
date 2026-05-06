/**
 * @typedef {'blue'|'green'|'amber'|'red'|'slate'} BadgeColor
 */

const colorClasses = {
  blue: 'bg-primary-100 text-primary-700',
  green: 'bg-emerald-100 text-emerald-700',
  amber: 'bg-amber-100 text-amber-700',
  red: 'bg-red-100 text-red-700',
  slate: 'bg-slate-100 text-slate-600',
}

/**
 * Badge / pill component for tags and status labels
 * @param {{
 *   children: React.ReactNode,
 *   color?: BadgeColor,
 *   className?: string
 * }} props
 */
export function Badge({ children, color = 'blue', className = '' }) {
  return (
    <span className={`badge ${colorClasses[color] ?? colorClasses.blue} ${className}`}>
      {children}
    </span>
  )
}
