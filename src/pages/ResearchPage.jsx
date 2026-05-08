import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, FlaskConical, ArrowUpRight, ExternalLink } from 'lucide-react'
import { Github } from '@/components/ui/BrandIcons'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { SmartImage } from '@/components/common/SmartImage'
import { useResearchList } from '@/features/research/useResearch'
import { useTranslation } from '@/features/i18n/useTranslation'
import { resolveImage } from '@/lib/storage'
import { formatDate, truncateText, cn } from '@/utils'

export default function ResearchPage() {
  const { t } = useTranslation()
  const { data, isLoading } = useResearchList()
  const [filter, setFilter] = useState('all')

  const STATUSES = [
    { value: 'all', label: t('research.filter_all', 'All') },
    { value: 'ongoing', label: t('research.filter_ongoing', 'Ongoing') },
    { value: 'completed', label: t('research.filter_completed', 'Completed') },
    { value: 'published', label: t('research.filter_published', 'Published') },
  ]

  const filtered = useMemo(() => {
    if (!data) return []
    if (filter === 'all') return data
    return data.filter((r) => r.status === filter)
  }, [data, filter])

  return (
    <Container className="pt-10 pb-20">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-cyan-300 transition mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('research.back_home', 'Back to home')}
      </Link>

      <SectionHeader
        eyebrow={t('research.eyebrow', 'Research')}
        title={t('research.title', 'Research Projects')}
        description={t('research.description', 'Active investigations and completed studies — explore the methodology, code, and findings of each.')}
      />

      {/* Filter tabs */}
      <div className="mt-8 flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <button
            key={s.value}
            type="button"
            onClick={() => setFilter(s.value)}
            className={cn(
              'px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition',
              filter === s.value
                ? 'bg-cyan-400/15 border border-cyan-400/40 text-cyan-300'
                : 'border border-dim text-slate-400 hover:text-slate-100 hover:border-white/15'
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <Skeleton className="aspect-[16/10] rounded-none rounded-t-2xl" />
              <div className="p-5 space-y-3">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-12" />
              </div>
            </Card>
          ))
        ) : filtered.length === 0 ? (
          <div className="col-span-full">
            <EmptyState
              icon={FlaskConical}
              title={t('research.no_projects', 'No research projects found')}
              description={filter !== 'all'
                ? t('research.no_projects_filter', 'Try a different filter.')
                : t('research.no_projects_empty', 'No research projects added yet.')}
            />
          </div>
        ) : (
          filtered.map((item) => {
            const cover = resolveImage(item.cover_path)
            const statusVariant =
              item.status === 'ongoing' ? 'amber' : item.status === 'published' ? 'cyan' : 'slate'

            return (
              <Card key={item.id} className="group overflow-hidden flex flex-col">
                <Link to={`/research/${item.id}`} className="block">
                  <SmartImage
                    src={cover}
                    alt={item.title}
                    containerClassName="aspect-[16/10] w-full"
                    className="group-hover:scale-105 transition-transform duration-700"
                  />
                </Link>

                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant={statusVariant}>
                      <FlaskConical className="h-3 w-3" />
                      {item.status ?? 'research'}
                    </Badge>
                    {item.started_at && (
                      <span className="text-[11px] text-slate-500 font-mono">
                        {formatDate(item.started_at, { year: 'numeric', month: 'short' })}
                      </span>
                    )}
                  </div>

                  <Link to={`/research/${item.id}`} className="block">
                    <h3 className="text-base font-semibold text-slate-100 group-hover:text-cyan-300 transition leading-snug">
                      {item.title}
                    </h3>
                  </Link>

                  {item.summary && (
                    <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                      {truncateText(item.summary, 120)}
                    </p>
                  )}

                  {Array.isArray(item.tags) && item.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {item.tags.slice(0, 4).map((tag, i) => (
                        <span key={i} className="text-[11px] text-slate-500 px-2 py-0.5 rounded-md bg-white/[0.03] border border-dim">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto pt-4 flex items-center gap-3 text-slate-500">
                    {item.repo_url && (
                      <a href={item.repo_url} target="_blank" rel="noreferrer" className="hover:text-cyan-300 transition" aria-label="Repository">
                        <Github className="h-4 w-4" />
                      </a>
                    )}
                    {item.demo_url && (
                      <a href={item.demo_url} target="_blank" rel="noreferrer" className="hover:text-cyan-300 transition" aria-label="Demo">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                    <Link to={`/research/${item.id}`} className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-cyan-400 hover:text-cyan-300 transition">
                      {t('research.view_details', 'View details')}
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </Card>
            )
          })
        )}
      </div>
    </Container>
  )
}
