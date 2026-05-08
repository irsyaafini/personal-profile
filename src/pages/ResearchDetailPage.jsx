import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, FlaskConical, ExternalLink, Calendar } from 'lucide-react'
import { Github } from '@/components/ui/BrandIcons'
import { Container } from '@/components/ui/Container'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { SmartImage } from '@/components/common/SmartImage'
import { Reveal } from '@/components/common/Reveal'
import { useResearch } from '@/features/research/useResearch'
import { useTranslation } from '@/features/i18n/useTranslation'
import { resolveImage } from '@/lib/storage'
import { formatDateRange } from '@/utils'

export default function ResearchDetailPage() {
  const { id } = useParams()
  const { data: item, isLoading, isError } = useResearch(id)
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <Container className="pt-8 pb-14">
        <Skeleton className="h-6 w-32 mb-6" />
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-4 w-1/2 mb-8" />
        <Skeleton className="aspect-[16/9] mb-8" />
        <Skeleton className="h-32" />
      </Container>
    )
  }

  if (isError || !item) {
    return (
      <Container className="pt-8 pb-14">
        <EmptyState
          icon={FlaskConical}
          title={t('research.not_found_title', 'Research project not found')}
          description={t('research.not_found_desc', 'This research project may have been removed or the link is invalid.')}
          action={
            <Button as={Link} to="/research" variant="outline">
              <ArrowLeft className="h-4 w-4" />
              {t('research.back_research', 'Back to research')}
            </Button>
          }
        />
      </Container>
    )
  }

  const cover = resolveImage(item.cover_path)
  const statusVariant =
    item.status === 'ongoing' ? 'light' : item.status === 'published' ? 'outline' : 'dark'

  return (
    <Container size="lg" className="pt-8 pb-14">
      {/* Back link */}
      <Link
        to="/research"
        className="inline-flex items-center gap-1.5 text-sm text-white/45 hover:text-white transition mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('research.back_research', 'Back to research')}
      </Link>

      {/* Meta row */}
      <Reveal direction="up">
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <Badge variant={statusVariant}>
            <FlaskConical className="h-3 w-3" />
            {item.status ?? 'research'}
          </Badge>
          <span className="inline-flex items-center gap-1.5 text-xs text-white/40 font-mono">
            <Calendar className="h-3.5 w-3.5" />
            {formatDateRange(item.started_at, item.ended_at)}
          </span>
        </div>
      </Reveal>

      {/* Title */}
      <Reveal direction="up" delay={80}>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white leading-tight">
          {item.title}
        </h1>
      </Reveal>

      {/* Summary */}
      {item.summary && (
        <Reveal direction="up" delay={160}>
          <p className="mt-4 text-lg text-white/55 leading-relaxed max-w-3xl">
            {item.summary}
          </p>
        </Reveal>
      )}

      {/* Cover image */}
      {cover && (
        <Reveal direction="up" delay={240}>
          <div className="mt-6 rounded-2xl overflow-hidden border border-white/[0.08]">
            <SmartImage
              src={cover}
              alt={item.title}
              containerClassName="aspect-[16/9] w-full"
            />
          </div>
        </Reveal>
      )}

      {/* Action buttons */}
      {(item.repo_url || item.demo_url) && (
        <Reveal direction="up" delay={320}>
          <div className="mt-6 flex flex-wrap gap-3">
            {item.demo_url && (
              <Button as="a" href={item.demo_url} target="_blank" rel="noreferrer" variant="solid">
                <ExternalLink className="h-4 w-4" />
                {t('research.view_demo', 'View Demo')}
              </Button>
            )}
            {item.repo_url && (
              <Button as="a" href={item.repo_url} target="_blank" rel="noreferrer" variant="outline">
                <Github className="h-4 w-4" />
                {t('research.view_repo', 'View Repository')}
              </Button>
            )}
          </div>
        </Reveal>
      )}

      {/* Tags */}
      {Array.isArray(item.tags) && item.tags.length > 0 && (
        <Reveal direction="up" delay={380}>
          <div className="mt-6 flex flex-wrap gap-2">
            {item.tags.map((tag, i) => (
              <Badge key={i} variant="dark">
                #{tag}
              </Badge>
            ))}
          </div>
        </Reveal>
      )}

      {/* Description card */}
      {item.description && (
        <Reveal direction="up">
          <Card className="mt-7">
            <div className="p-6 sm:p-8">
              <h2 className="text-[11px] font-semibold text-white/55 uppercase tracking-[0.22em] mb-5">
                {t('research.description_heading', 'Description')}
              </h2>
              <div className="text-base text-white/70 leading-relaxed whitespace-pre-line">
                {item.description}
              </div>
            </div>
          </Card>
        </Reveal>
      )}
    </Container>
  )
}
