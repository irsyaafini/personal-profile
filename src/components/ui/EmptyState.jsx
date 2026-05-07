import { cn } from '@/utils'

export function EmptyState({ icon: Icon, title, description, action, className = '' }) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        'rounded-2xl border border-dim bg-white/[0.02]',
        'py-12 px-6',
        className
      )}
    >
      {Icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-slate-400">
          <Icon className="h-5 w-5" />
        </div>
      )}
      <h3 className="text-base font-semibold text-slate-200">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-slate-500 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
