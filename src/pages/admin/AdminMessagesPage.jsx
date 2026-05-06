import { useState } from 'react'
import { useMessages, useMarkMessageRead, useDeleteMessage } from '@/hooks/useMessages'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState, ErrorState } from '@/components/ui/EmptyState'
import { formatDate } from '@/utils'

/**
 * Admin Messages management page
 */
export default function AdminMessagesPage() {
  const { data: messages, isLoading, isError, refetch } = useMessages()
  const { mutate: markRead } = useMarkMessageRead()
  const { mutate: remove, isPending: deleting } = useDeleteMessage()

  const [viewTarget, setViewTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const handleView = (msg) => {
    setViewTarget(msg)
    if (!msg.is_read) markRead(msg.id)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-display">Messages</h1>
        <p className="text-slate-500 text-sm mt-1">
          {messages?.filter(m => !m.is_read).length ?? 0} unread · {messages?.length ?? 0} total
        </p>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}
        </div>
      )}
      {isError && <ErrorState onRetry={refetch} />}

      {!isLoading && !isError && messages?.length === 0 && (
        <EmptyState title="No messages yet" description="Contact form submissions will appear here." icon="✉️" />
      )}

      {!isLoading && !isError && messages?.length > 0 && (
        <div className="space-y-3">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`card-base p-5 cursor-pointer hover:border-primary-200 transition-colors ${
                !msg.is_read ? 'border-primary-200 bg-primary-50/30' : ''
              }`}
              onClick={() => handleView(msg)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  {!msg.is_read && (
                    <span className="flex-shrink-0 w-2 h-2 bg-primary-500 rounded-full" />
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-sm text-slate-900">{msg.name}</span>
                      <span className="text-xs text-slate-400">{msg.email}</span>
                    </div>
                    {msg.subject && (
                      <p className="text-sm text-slate-700 font-medium truncate">{msg.subject}</p>
                    )}
                    <p className="text-xs text-slate-400 mt-0.5 truncate">{msg.message}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs text-slate-400 whitespace-nowrap">
                    {formatDate(msg.created_at, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteTarget(msg) }}
                    className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Message detail modal */}
      <Modal isOpen={!!viewTarget} onClose={() => setViewTarget(null)} title="Message" size="md">
        {viewTarget && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">From</p>
                <p className="font-semibold text-slate-900">{viewTarget.name}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Email</p>
                <a href={`mailto:${viewTarget.email}`} className="text-primary-600 hover:underline text-sm">
                  {viewTarget.email}
                </a>
              </div>
            </div>
            {viewTarget.subject && (
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Subject</p>
                <p className="text-slate-800 font-medium">{viewTarget.subject}</p>
              </div>
            )}
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Message</p>
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap bg-slate-50 rounded-xl p-4">
                {viewTarget.message}
              </p>
            </div>
            <p className="text-xs text-slate-400">
              Received: {formatDate(viewTarget.created_at, { dateStyle: 'long', timeStyle: 'short' })}
            </p>
            <div className="flex justify-between">
              <a href={`mailto:${viewTarget.email}?subject=Re: ${viewTarget.subject ?? ''}`}
                className="btn-secondary text-sm py-2">
                Reply via Email
              </a>
              <Button variant="ghost" onClick={() => setViewTarget(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        onConfirm={() => remove(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })}
        isLoading={deleting}
        message={`Delete message from "${deleteTarget?.name}"?`}
      />
    </div>
  )
}
