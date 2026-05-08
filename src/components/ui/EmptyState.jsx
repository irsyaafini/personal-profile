import { cn } from '@/utils'

/**
 * TEMA FIX (EmptyState):
 * 1. Icon container: `text-slate-400` → `text-white/50`
 * 2. Title: `text-slate-200` → `text-white/85`
 * 3. Description: `text-slate-500` → `text-white/45`
 *
 * `text-slate-xxx` adalah Tailwind built-in yang nilainya tidak selalu
 * selaras dengan --c-text-* CSS vars di tema ini.
 */
export function EmptyState({ icon: Icon, title, description, action, className = '' }) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        'rounded-2xl border border-white/[0.08] bg-white/[0.02]',
        'py-12 px-6',
        className
      )}
    >
      {Icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.05] text-white/50">
          <Icon className="h-5 w-5" />
        </div>
      )}
      <h3 className="text-base font-semibold text-white/85">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-white/45 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
