import { useRouteError, Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

export function ErrorBoundary() {
  const error = useRouteError()
  // eslint-disable-next-line no-console
  console.error(error)

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-noise">
      <div className="max-w-md text-center">
        <p className="section-label mb-4">Something went wrong</p>
        <h1 className="text-3xl sm:text-4xl font-semibold text-slate-100">
          We hit an unexpected error
        </h1>
        <p className="mt-3 text-sm text-slate-400">
          {error?.statusText || error?.message || 'Please refresh the page or go back home.'}
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button as={Link} to="/" variant="solid">
            Go home
          </Button>
          <Button variant="ghost" onClick={() => window.location.reload()}>
            Reload
          </Button>
        </div>
      </div>
    </div>
  )
}
