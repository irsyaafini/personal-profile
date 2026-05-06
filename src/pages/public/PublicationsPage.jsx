import { useState } from 'react'
import { motion } from 'framer-motion'
import { usePublications } from '@/hooks/usePublications'
import { SectionHeader } from '@/components/common/SectionHeader'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { PublicationSkeleton } from '@/components/ui/Skeleton'
import { EmptyState, ErrorState } from '@/components/ui/EmptyState'
import { getPublicationTypeLabel } from '@/utils'

const TYPE_COLOR = {
  journal: 'blue',
  conference: 'green',
  book_chapter: 'amber',
  report: 'slate',
}

/**
 * Single publication list item
 */
function PublicationItem({ pub, index }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
    >
      <Card className="hover:border-primary-200 transition-colors">
        <div className="flex gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold text-sm font-mono">
            {pub.year}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-2 items-start mb-2">
              <Badge color={TYPE_COLOR[pub.publication_type] ?? 'slate'}>
                {getPublicationTypeLabel(pub.publication_type)}
              </Badge>
              {pub.citation_count > 0 && (
                <span className="badge bg-amber-50 text-amber-600 border border-amber-100">
                  {pub.citation_count} citations
                </span>
              )}
            </div>

            <h3 className="font-semibold text-slate-900 mb-1 leading-snug">{pub.title}</h3>
            <p className="text-sm text-slate-500 mb-0.5">{pub.authors}</p>
            <p className="text-sm font-medium text-primary-600 italic">{pub.journal}</p>

            {pub.abstract && (
              <div className="mt-3">
                <button
                  onClick={() => setExpanded(v => !v)}
                  className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {expanded ? '▲ Hide abstract' : '▼ Show abstract'}
                </button>
                {expanded && (
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed bg-slate-50 rounded-xl p-4">
                    {pub.abstract}
                  </p>
                )}
              </div>
            )}

            {pub.link && (
              <a
                href={pub.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-3 text-sm text-primary-600 hover:text-primary-800 font-medium transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View Publication
                {pub.doi && <span className="text-slate-400 font-normal">· DOI: {pub.doi}</span>}
              </a>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

/**
 * Publications page — grouped list
 */
export default function PublicationsPage() {
  const { data: publications, isLoading, isError, refetch } = usePublications()
  const [filter, setFilter] = useState('all')

  const types = ['all', 'journal', 'conference', 'book_chapter', 'report']
  const filtered = filter === 'all' ? publications : publications?.filter(p => p.publication_type === filter)

  return (
    <div className="pt-16">
      <section className="section-padding">
        <div className="container-section">
          <SectionHeader
            label="Publications"
            title="Research Publications"
            subtitle="Peer-reviewed articles, conference proceedings, and technical reports."
          />

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {types.map(type => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  filter === type
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-primary-200'
                }`}
              >
                {type === 'all' ? 'All' : getPublicationTypeLabel(type)}
              </button>
            ))}
          </div>

          {isLoading && (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => <PublicationSkeleton key={i} />)}
            </div>
          )}
          {isError && <ErrorState onRetry={refetch} />}

          {!isLoading && !isError && filtered?.length === 0 && (
            <EmptyState title="No publications found" icon="📄" />
          )}

          {!isLoading && !isError && filtered?.length > 0 && (
            <div className="space-y-4 max-w-3xl mx-auto">
              {filtered.map((pub, i) => (
                <PublicationItem key={pub.id} pub={pub} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
