export function AdminPageHeader({ title, description, actions }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 pb-6 border-b border-white/[0.06] mb-8">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-white">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 text-sm text-white/55 max-w-2xl">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}
