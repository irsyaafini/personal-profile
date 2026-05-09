import { memo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, FlaskConical } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { SmartImage } from '@/components/common/SmartImage'
import { Reveal, RevealGroup } from '@/components/common/Reveal'
import { useResearchList } from '@/features/research/useResearch'
import { useTranslation } from '@/features/i18n/useTranslation'
import { resolveImage } from '@/lib/storage'
import { formatDate } from '@/utils'

const ResearchCard = memo(function ResearchCard({ item, t }) {
  const cover = resolveImage(item.cover_path)

  return (
    <Card className="group overflow-hidden flex flex-col">
      <Link to={`/research/${item.id}`} className="block relative overflow-hidden">
        <SmartImage
          src={cover}
          alt={item.title}
          containerClassName="aspect-[16/10] w-full"
          className="group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" aria-hidden />
      </Link>

      <div className="p-6 sm:p-7 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant={item.status === 'ongoing' ? 'light' : 'outline'}>
            <FlaskConical className="h-3 w-3" aria-hidden />
            {item.status ?? 'research'}
          </Badge>
          {item.started_at && (
            <span className="text-[10px] text-white/40 font-mono tracking-wider">
              {formatDate(item.started_at, { year: 'numeric', month: 'short' })}
            </span>
          )}
        </div>

        <Link to={`/research/${item.id}`} className="block">
          <h3 className="text-base sm:text-lg font-semibold text-white leading-snug group-hover:text-white/80 transition tracking-tight">
            {item.title}
          </h3>
        </Link>

        {item.summary && (
          <p className="mt-2.5 text-sm text-white/55 leading-relaxed line-clamp-3">
            {item.summary}
          </p>
        )}

        <div className="mt-auto pt-5 flex items-center justify-end">
          <Link
            to={`/research/${item.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-white/60 hover:text-white transition"
            aria-label={`View ${item.title}`}
          >
            {t('portfolio.view', 'View')}
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
      </div>
    </Card>
  )
})

const SKELETON_ITEMS = Array.from({ length: 3 })

export function PortfolioSection() {
  const { t } = useTranslation()
  const { data: research, isLoading: loadingResearch } = useResearchList({ limit: 6 })

  return (
    <section id="portfolio" className="section-gap">
      <Container>
        <Reveal direction="up">
          <SectionHeader
            eyebrow={t('portfolio.eyebrow', 'Work & Research')}
            title={t('sections.portfolio', 'Research & Portfolio')}
            description={t(
              'portfolio.description',
              'A selection of recent research projects. Click through for full context, methodology, and findings.'
            )}
          />
        </Reveal>

        <div className="mt-8 sm:mt-10">
          <Reveal direction="up" delay={120}>
            <div className="flex items-end justify-between mb-5">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60 flex items-center gap-2.5">
                <FlaskConical className="h-3.5 w-3.5" aria-hidden />
                {t('portfolio.research_projects', 'Research Projects')}
              </h3>
              <Button as={Link} to="/research" variant="ghost" className="text-[11px] uppercase tracking-[0.18em]">
                {t('common.view_all', 'View all')}
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </Button>
            </div>
          </Reveal>

          {loadingResearch ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {SKELETON_ITEMS.map((_, i) => (
                <Card key={i} aria-hidden>
                  <Skeleton className="aspect-[16/10]" />
                  <div className="p-6 space-y-3">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-12" />
                  </div>
                </Card>
              ))}
            </div>
          ) : !research?.length ? (
            <Reveal direction="up" delay={200}>
              <Card>
                <div className="p-10 text-center text-sm text-white/40">
                  {t('portfolio.no_research', 'No research projects yet.')}
                </div>
              </Card>
            </Reveal>
          ) : (
            <RevealGroup
              stagger={100}
              baseDelay={200}
              direction="up"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {research.slice(0, 6).map((r) => (
                <ResearchCard key={r.id} item={r} t={t} />
              ))}
            </RevealGroup>
          )}
        </div>
      </Container>
    </section>
  )
}
