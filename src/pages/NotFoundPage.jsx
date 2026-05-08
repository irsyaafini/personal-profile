import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { useTranslation } from '@/features/i18n/useTranslation'

/**
 * TEMA FIX:
 * 1. `text-gradient-warm` → tidak terdefinisi di index.css, diganti `text-gradient-silver`
 *    yang merupakan utilitas resmi di tema ini (silver-to-white gradient).
 * 2. `text-slate-100` → `text-white/90`  (konsisten dengan CSS var --c-text)
 * 3. `text-slate-400` → `text-white/55`  (konsisten dengan CSS var --c-text-muted)
 */
export default function NotFoundPage() {
  const { t } = useTranslation()

  return (
    <Container className="flex items-center justify-center min-h-[70vh] py-20">
      <div className="text-center max-w-md">
        <p className="section-label mb-4">{t('not_found.label', 'Error 404')}</p>
        <h1 className="font-display text-6xl sm:text-7xl md:text-8xl font-bold text-gradient-silver leading-none">
          {t('not_found.title', '404')}
        </h1>
        <h2 className="mt-6 text-2xl sm:text-3xl font-semibold text-white/90">
          {t('not_found.heading', 'Page not found')}
        </h2>
        <p className="mt-3 text-sm sm:text-base text-white/55">
          {t('not_found.description', "The page you're looking for doesn't exist or has been moved. Let's get you back on track.")}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button as={Link} to="/" variant="solid">
            <Home className="h-4 w-4" />
            {t('not_found.go_home', 'Go home')}
          </Button>
          <Button variant="ghost" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4" />
            {t('not_found.go_back', 'Go back')}
          </Button>
        </div>
      </div>
    </Container>
  )
}
