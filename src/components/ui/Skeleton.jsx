/**
 * Skeleton loading placeholder
 * @param {{ className?: string }} props
 */
export function Skeleton({ className = '' }) {
  return (
    <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />
  )
}

/** Skeleton for a card */
export function CardSkeleton() {
  return (
    <div className="card-base p-6 space-y-4">
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>
  )
}

/** Skeleton for a publication row */
export function PublicationSkeleton() {
  return (
    <div className="card-base p-6 space-y-3">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-1/4" />
    </div>
  )
}

/** Grid of card skeletons */
export function CardGridSkeleton({ count = 3 }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}
