import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'

export default function NotFoundPage() {
  return (
    <Container className="flex items-center justify-center min-h-[70vh] py-20">
      <div className="text-center max-w-md">
        <p className="section-label mb-4">Error 404</p>
        <h1 className="font-display text-6xl sm:text-7xl md:text-8xl font-bold text-gradient-warm leading-none">
          404
        </h1>
        <h2 className="mt-6 text-2xl sm:text-3xl font-semibold text-slate-100">
          Page not found
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-400">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button as={Link} to="/" variant="solid">
            <Home className="h-4 w-4" />
            Go home
          </Button>
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Go back
          </Button>
        </div>
      </div>
    </Container>
  )
}
