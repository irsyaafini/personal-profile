/**
 * Empty state display component
 * @param {{
 *   title: string,
 *   description?: string,
 *   icon?: React.ReactNode,
 *   action?: React.ReactNode
 * }} props
 */
export function EmptyState({ title, description, icon, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {icon && (
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-3xl mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-slate-700 mb-2">{title}</h3>
      {description && <p className="text-slate-400 text-sm max-w-sm mb-6">{description}</p>}
      {action}
    </div>
  )
}

/**
 * Error state component
 */
export function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center text-3xl mb-4">
        ⚠️
      </div>
      <h3 className="text-lg font-semibold text-slate-700 mb-2">Failed to load</h3>
      <p className="text-slate-400 text-sm mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-secondary text-sm"
        >
          Try again
        </button>
      )}
    </div>
  )
}
