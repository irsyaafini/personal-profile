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
import { useResearch } from '@/features/research/useResearch'
import { resolveImage } from '@/lib/storage'
import { formatDateRange } from '@/utils'

export default function ResearchDetailPage() {
  const { id } = useParams()
  const { data: item, isLoading, isError } = useResearch(id)

  if (isLoading) {
    return (
      <Container className="pt-10 pb-20">
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
      <Container className="pt-10 pb-20">
        <EmptyState
          icon={FlaskConical}
          title="Research project not found"
          description="This research project may have been removed or the link is invalid."
          action={
            <Button as={Link} to="/research" variant="cyan">
              <ArrowLeft className="h-4 w-4" />
              Back to research
            </Button>
          }
        />
      </Container>
    )
  }

  const cover = resolveImage(item.cover_path)
  const statusVariant =
    item.status === 'ongoing' ? 'amber' : item.status === 'published' ? 'cyan' : 'slate'

  return (
    <Container size="lg" className="pt-10 pb-20">
      <Link
        to="/research"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-cyan-300 transition mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to research
      </Link>

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <Badge variant={statusVariant}>
          <FlaskConical className="h-3 w-3" />
          {item.status ?? 'research'}
        </Badge>
        <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-mono">
          <Calendar className="h-3.5 w-3.5" />
          {formatDateRange(item.started_at, item.ended_at)}
        </span>
      </div>

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-slate-50 leading-tight">
        {item.title}
      </h1>

      {item.summary && (
        <p className="mt-5 text-lg text-slate-400 leading-relaxed max-w-3xl">
          {item.summary}
        </p>
      )}

      {/* Cover */}
      {cover && (
        <div className="mt-8 rounded-2xl overflow-hidden border border-dim">
          <SmartImage
            src={cover}
            alt={item.title}
            containerClassName="aspect-[16/9] w-full"
          />
        </div>
      )}

      {/* Actions */}
      {(item.repo_url || item.demo_url) && (
        <div className="mt-8 flex flex-wrap gap-3">
          {item.demo_url && (
            <Button as="a" href={item.demo_url} target="_blank" rel="noreferrer" variant="solid">
              <ExternalLink className="h-4 w-4" />
              View Demo
            </Button>
          )}
          {item.repo_url && (
            <Button as="a" href={item.repo_url} target="_blank" rel="noreferrer" variant="cyan">
              <Github className="h-4 w-4" />
              View Repository
            </Button>
          )}
        </div>
      )}

      {/* Tags */}
      {Array.isArray(item.tags) && item.tags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {item.tags.map((tag, i) => (
            <Badge key={i} variant="slate">
              #{tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Description */}
      {item.description && (
        <Card className="mt-10">
          <div className="p-6 sm:p-8">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-widest mb-4">
              Description
            </h2>
            <div className="text-base text-slate-300 leading-relaxed whitespace-pre-line">
              {item.description}
            </div>
          </div>
        </Card>
      )}
    </Container>
  )
}
