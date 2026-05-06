import { useState } from 'react'
import { motion } from 'framer-motion'
import { useResearchList } from '@/hooks/useResearch'
import { SectionHeader } from '@/components/common/SectionHeader'
import { ResearchChart } from '@/components/common/ResearchChart'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { CardGridSkeleton } from '@/components/ui/Skeleton'
import { EmptyState, ErrorState } from '@/components/ui/EmptyState'
import { getStatusColor, truncateText, formatDate } from '@/utils'

const statusColorMap = { ongoing: 'amber', completed: 'blue', published: 'green' }

/**
 * Research project card
 * @param {{ project: Object, onViewDetail: function }} props
 */
function ResearchCard({ project, onViewDetail }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <Card hover onClick={() => onViewDetail(project)} padding={false}>
        <div className="p-6">
          <div className="flex items-start justify-between gap-3 mb-3">
            <span className="text-xs font-medium text-slate-400">{project.year}</span>
            <Badge color={statusColorMap[project.status] ?? 'slate'}>
              {project.status}
            </Badge>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2 leading-snug">
            {project.title}
          </h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-4">
            {truncateText(project.description, 140)}
          </p>
          {project.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {project.tags.slice(0, 3).map(tag => (
                <span key={tag} className="badge bg-slate-100 text-slate-600 text-xs">{tag}</span>
              ))}
            </div>
          )}
        </div>
        {project.visualization_data && (
          <div className="px-6 pb-4 border-t border-slate-50 pt-4">
            <ResearchChart data={project.visualization_data} height={140} />
          </div>
        )}
        <div className="px-6 pb-5 pt-2">
          <span className="text-primary-600 text-sm font-medium hover:text-primary-700">
            View details →
          </span>
        </div>
      </Card>
    </motion.div>
  )
}

/**
 * Research detail modal content
 */
function ResearchDetail({ project }) {
  const [chartType, setChartType] = useState('line')
  if (!project) return null

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 items-center">
        <Badge color={statusColorMap[project.status] ?? 'slate'}>{project.status}</Badge>
        <span className="text-sm text-slate-400">{project.year}</span>
        {project.tags?.map(tag => (
          <span key={tag} className="badge bg-slate-100 text-slate-500 text-xs">{tag}</span>
        ))}
      </div>

      <div>
        <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Description</h4>
        <p className="text-slate-700 leading-relaxed">{project.description}</p>
      </div>

      {project.dataset_info && (
        <div>
          <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Dataset</h4>
          <p className="text-slate-600 text-sm bg-slate-50 rounded-xl p-4 font-mono">{project.dataset_info}</p>
        </div>
      )}

      {project.findings && (
        <div>
          <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Key Findings</h4>
          <p className="text-slate-700 leading-relaxed">{project.findings}</p>
        </div>
      )}

      {project.visualization_data && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Data Visualization</h4>
            <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
              {['line', 'bar'].map(t => (
                <button
                  key={t}
                  onClick={() => setChartType(t)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    chartType === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <ResearchChart data={project.visualization_data} type={chartType} height={260} />
        </div>
      )}
    </div>
  )
}

/**
 * Research page — list of research projects with detail modal
 */
export default function ResearchPage() {
  const { data: projects, isLoading, isError, refetch } = useResearchList()
  const [selected, setSelected] = useState(null)

  return (
    <div className="pt-16">
      <section className="section-padding">
        <div className="container-section">
          <SectionHeader
            label="Research"
            title="Research Projects"
            subtitle="Epidemiological studies and data analyses addressing critical public health challenges."
          />

          {isLoading && <CardGridSkeleton count={4} />}
          {isError && <ErrorState onRetry={refetch} message="Failed to load research projects." />}

          {!isLoading && !isError && projects?.length === 0 && (
            <EmptyState title="No research projects yet" icon="🔬" />
          )}

          {!isLoading && !isError && projects?.length > 0 && (
            <div className="grid md:grid-cols-2 gap-8">
              {projects.map(project => (
                <ResearchCard key={project.id} project={project} onViewDetail={setSelected} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.title}
        size="xl"
      >
        <ResearchDetail project={selected} />
      </Modal>
    </div>
  )
}
