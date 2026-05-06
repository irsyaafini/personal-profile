import { useState } from 'react'
import { usePublications, useCreatePublication, useUpdatePublication, useDeletePublication } from '@/hooks/usePublications'
import { PublicationForm } from '@/features/publications/PublicationForm'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { PublicationSkeleton } from '@/components/ui/Skeleton'
import { EmptyState, ErrorState } from '@/components/ui/EmptyState'
import { getPublicationTypeLabel, truncateText } from '@/utils'

const TYPE_COLOR = { journal: 'blue', conference: 'green', book_chapter: 'amber', report: 'slate' }

/**
 * Admin CRUD page for publications
 */
export default function AdminPublicationsPage() {
  const { data: publications, isLoading, isError, refetch } = usePublications()
  const { mutate: create, isPending: creating } = useCreatePublication()
  const { mutate: update, isPending: updating } = useUpdatePublication()
  const { mutate: remove, isPending: deleting } = useDeletePublication()

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Publications</h1>
          <p className="text-slate-500 text-sm mt-1">{publications?.length ?? 0} total publications</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>+ Add Publication</Button>
      </div>

      {isLoading && (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => <PublicationSkeleton key={i} />)}
        </div>
      )}
      {isError && <ErrorState onRetry={refetch} />}

      {!isLoading && !isError && publications?.length === 0 && (
        <EmptyState title="No publications yet" icon="📄"
          action={<Button onClick={() => setCreateOpen(true)}>+ Add Publication</Button>}
        />
      )}

      {!isLoading && !isError && publications?.length > 0 && (
        <div className="space-y-3">
          {publications.map(pub => (
            <div key={pub.id} className="card-base p-5 flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold text-sm font-mono">
                {pub.year}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-2 mb-1.5">
                  <Badge color={TYPE_COLOR[pub.publication_type] ?? 'slate'}>
                    {getPublicationTypeLabel(pub.publication_type)}
                  </Badge>
                  {pub.citation_count > 0 && (
                    <span className="badge bg-amber-50 text-amber-600 text-xs">{pub.citation_count} citations</span>
                  )}
                </div>
                <p className="font-semibold text-slate-900 text-sm leading-snug mb-0.5">
                  {truncateText(pub.title, 100)}
                </p>
                <p className="text-xs text-slate-500">{pub.authors}</p>
                <p className="text-xs text-primary-600 italic">{pub.journal}</p>
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                <button onClick={() => setEditTarget(pub)} className="text-xs text-primary-600 hover:text-primary-800 font-medium">Edit</button>
                <button onClick={() => setDeleteTarget(pub)} className="text-xs text-red-500 hover:text-red-700 font-medium">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Add Publication" size="xl">
        <PublicationForm onSubmit={handleCreate} onCancel={() => setCreateOpen(false)} isLoading={creating} />
      </Modal>
      <Modal isOpen={!!editTarget} onClose={() => setEditTarget(null)} title="Edit Publication" size="xl">
        <PublicationForm initial={editTarget} onSubmit={handleEdit} onCancel={() => setEditTarget(null)} isLoading={updating} />
      </Modal>
      <ConfirmDialog
        isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete} isLoading={deleting}
        message={`Delete "${truncateText(deleteTarget?.title, 60)}"?`}
      />
    </div>
  )
}
