import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function ConfirmDialog({
  open,
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  busy = false,
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onCancel?.()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Close"
        onClick={onCancel}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-md rounded-2xl bg-[#161616] border border-white/10 shadow-2xl"
      >
        <div className="p-6 sm:p-7">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-base font-semibold text-white">{title}</h3>
              <p className="mt-1.5 text-sm text-white/60 leading-relaxed">{description}</p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-2">
            <Button variant="ghost" onClick={onCancel} disabled={busy}>
              {cancelLabel}
            </Button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={busy}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm tracking-wide bg-rose-500 hover:bg-rose-600 text-white border border-rose-500 transition disabled:opacity-60"
            >
              {busy ? 'Deleting…' : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
