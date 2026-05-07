import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Trash2, Mail, MailOpen, X, Loader2 } from 'lucide-react'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/hooks/useToast'
import { messagesService } from '@/services/messages.service'
import { QUERY_KEYS } from '@/constants'
import { formatDate } from '@/utils'
import { cn } from '@/utils'

export default function AdminMessagesPage() {
  const qc = useQueryClient()
  const { toast, show } = useToast()
  const [filter, setFilter] = useState('all') // all | unread

  const { data: items = [], isLoading } = useQuery({
    queryKey: QUERY_KEYS.MESSAGES,
    queryFn: () => messagesService.list({ unreadOnly: filter === 'unread' }),
  })

  const [openMsg, setOpenMsg] = useState(null)
  const [confirmId, setConfirmId] = useState(null)
  const [busyDelete, setBusyDelete] = useState(false)

  const invalidate = () => qc.invalidateQueries({ queryKey: QUERY_KEYS.MESSAGES })

  const handleOpen = async (m) => {
    setOpenMsg(m)
    if (!m.read) {
      try {
        await messagesService.markRead(m.id, true)
        invalidate()
      } catch (e) {
        // non-blocking
      }
    }
  }

  const handleToggleRead = async (m) => {
    try {
      await messagesService.markRead(m.id, !m.read)
      invalidate()
    } catch (err) {
      show(err.message || 'Failed', 'error')
    }
  }

  const handleDelete = async () => {
    if (!confirmId) return
    setBusyDelete(true)
    try {
      await messagesService.remove(confirmId)
      invalidate()
      show('Message deleted.')
      setConfirmId(null)
      if (openMsg?.id === confirmId) setOpenMsg(null)
    } catch (err) {
      show(err.message || 'Failed to delete', 'error')
    } finally {
      setBusyDelete(false)
    }
  }

  return (
    <>
      {toast}
      <AdminPageHeader
        title="Messages"
        description="Submissions from your contact form."
        actions={
          <div className="inline-flex rounded-full bg-[#161616] border border-white/[0.08] p-1">
            <button
              onClick={() => setFilter('all')}
              className={cn(
                'px-3.5 py-1.5 rounded-full text-xs font-medium transition',
                filter === 'all' ? 'bg-white text-black' : 'text-white/65 hover:text-white'
              )}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={cn(
                'px-3.5 py-1.5 rounded-full text-xs font-medium transition',
                filter === 'unread' ? 'bg-white text-black' : 'text-white/65 hover:text-white'
              )}
            >
              Unread
            </button>
          </div>
        }
      />

      {isLoading ? (
        <p className="text-white/50 text-sm">Loading…</p>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.06] bg-[#161616] p-12 text-center">
          <Mail className="h-8 w-8 text-white/30 mx-auto mb-3" />
          <p className="text-sm text-white/40">
            {filter === 'unread' ? 'No unread messages.' : 'No messages yet.'}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/[0.06] bg-[#161616] divide-y divide-white/[0.05] overflow-hidden">
          {items.map((m) => (
            <button
              key={m.id}
              onClick={() => handleOpen(m)}
              className={cn(
                'w-full text-left px-5 py-4 hover:bg-white/[0.03] transition flex items-start gap-4',
                !m.read && 'bg-white/[0.015]'
              )}
            >
              <span className={cn(
                'mt-1 inline-flex h-2 w-2 rounded-full shrink-0',
                m.read ? 'bg-white/15' : 'bg-white'
              )} />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className={cn('text-sm', m.read ? 'text-white/70' : 'text-white font-semibold')}>
                    {m.name}
                  </span>
                  <span className="text-xs text-white/35">·</span>
                  <span className="text-xs text-white/45 truncate">{m.email}</span>
                </div>
                {m.subject && (
                  <p className={cn('text-sm mt-0.5 truncate', m.read ? 'text-white/55' : 'text-white/85')}>
                    {m.subject}
                  </p>
                )}
                <p className="text-xs text-white/40 mt-1 line-clamp-1">{m.message}</p>
              </div>
              <span className="text-[10px] text-white/35 font-mono whitespace-nowrap shrink-0">
                {formatDate(m.created_at, { month: 'short', day: 'numeric' })}
              </span>
            </button>
          ))}
        </div>
      )}

      {openMsg && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center px-4 py-8 overflow-y-auto">
          <button aria-label="Close" onClick={() => setOpenMsg(null)} className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative w-full max-w-2xl rounded-2xl bg-[#161616] border border-white/10 shadow-2xl">
            <div className="px-6 sm:px-7 py-5 border-b border-white/[0.06] flex items-center justify-between gap-4">
              <div className="min-w-0">
                <h3 className="font-display text-lg font-semibold text-white truncate">
                  {openMsg.subject || '(no subject)'}
                </h3>
                <p className="text-xs text-white/50 mt-0.5">
                  {openMsg.name} · <a href={`mailto:${openMsg.email}`} className="hover:text-white underline-offset-4 hover:underline">{openMsg.email}</a>
                </p>
              </div>
              <button onClick={() => setOpenMsg(null)} className="text-white/55 hover:text-white shrink-0" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 sm:p-7">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/40 font-semibold mb-4">
                {formatDate(openMsg.created_at, { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <p className="text-sm text-white/85 leading-relaxed whitespace-pre-wrap">
                {openMsg.message}
              </p>
            </div>
            <div className="px-6 sm:px-7 py-4 border-t border-white/[0.06] flex items-center justify-between gap-2">
              <Button variant="ghost" onClick={() => handleToggleRead(openMsg)}>
                {openMsg.read ? <><Mail className="h-4 w-4" /> Mark as unread</> : <><MailOpen className="h-4 w-4" /> Mark as read</>}
              </Button>
              <Button variant="ghost" onClick={() => { setConfirmId(openMsg.id) }}>
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!confirmId}
        title="Delete message?"
        description="The sender will not be notified. This action cannot be undone."
        busy={busyDelete}
        onCancel={() => setConfirmId(null)}
        onConfirm={handleDelete}
      />
    </>
  )
}
