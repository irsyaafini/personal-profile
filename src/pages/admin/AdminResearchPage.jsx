import { useState } from 'react'
import { useResearchList, useCreateResearch, useUpdateResearch, useDeleteResearch } from '@/hooks/useResearch'
import { ResearchForm } from '@/features/research/ResearchForm'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { CardGridSkeleton } from '@/components/ui/Skeleton'
import { EmptyState, ErrorState } from '@/components/ui/EmptyState'
import { truncateText } from '@/utils'

const STATUS_COLOR = { ongoing: 'amber', completed: 'blue', published: 'green' }

/**
 * Admin CRUD page for research projects
 */
export default function AdminResearchPage() {
  const { data: projects, isLoading, isError, refetch } = useResearchList()
  const { mutate: create, isPending: creating } = useCreateResearch()
  const { mutate: update, isPending: updating } = useUpdateResearch()
  const { mutate: remove, isPending: deleting } = useDeleteResearch()

  const [createOpen, setCreateOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const handleCreate = (payload) => {
    create(payload, { onSuccess: () => setCreateOpen(false) })
  }

  const handleEdit = (payload) => {
    update({ id: editTarget.id, updates: payload }, { onSuccess: () => setEditTarget(null) })
  }

  const handleDelete = () => {
    remove(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Research Projects</h1>
          <p className="text-slate-500 text-sm mt-1">{projects?.length ?? 0} total projects</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>+ Add Project</Button>
      </div>

      {/* Content */}
      {isLoading && <CardGridSkeleton count={3} />}
      {isError && <ErrorState onRetry={refetch} />}

      {!isLoading && !isError && projects?.length === 0 && (
        <EmptyState title="No research projects" description="Add your first research project." icon="🔬"
          action={<Button onClick={() => setCreateOpen(true)}>+ Add Project</Button>}
        />
      )}

      {!isLoading && !isError && projects?.length > 0 && (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {projects.map(project => (
            <div key={project.id} className="card-base p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-slate-900 text-sm leading-snug flex-1">
                  {project.title}
                </h3>
                <Badge color={STATUS_COLOR[project.status]}>{project.status}</Badge>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed flex-1">
                {truncateText(project.description, 100)}
              </p>
              <div className="flex flex-wrap gap-1">
                {project.tags?.slice(0, 3).map(tag => (
                  <span key={tag} className="badge bg-slate-100 text-slate-500 text-xs">{tag}</span>
                ))}
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-50">
                <span className="text-xs text-slate-400">{project.year}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditTarget(project)}
                    className="text-xs text-primary-600 hover:text-primary-800 font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteTarget(project)}
                    className="text-xs text-red-500 hover:text-red-700 font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create modal */}
      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Add Research Project" size="xl">
        <ResearchForm onSubmit={handleCreate} onCancel={() => setCreateOpen(false)} isLoading={creating} />
      </Modal>

      {/* Edit modal */}
      <Modal isOpen={!!editTarget} onClose={() => setEditTarget(null)} title="Edit Research Project" size="xl">
        <ResearchForm initial={editTarget} onSubmit={handleEdit} onCancel={() => setEditTarget(null)} isLoading={updating} />
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isLoading={deleting}
        message={`Delete "${deleteTarget?.title}"? This action cannot be undone.`}
      />
    </div>
  )
}
