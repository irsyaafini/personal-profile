import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

/**
 * TEMA FIX (ConfirmDialog):
 * 1. Warning icon bg: `bg-rose-500/15 border-rose-500/30 text-rose-300`
 *    → `bg-white/[0.06] border-white/20 text-white/70` (monokrom)
 * 2. Confirm button: `bg-rose-500 hover:bg-rose-600 border-rose-500`
 *    → `bg-white/[0.08] hover:bg-white/[0.14] border-white/20 text-white`
 *    Destruktif dibedakan lewat konten label ("Delete"), bukan warna merah.
 */
export function ConfirmDialog({
  open,
  title       = 'Are you sure?',
  description = 'This action cannot be undone.',
  confirmLabel = 'Delete',
  cancelLabel  = 'Cancel',
  busy  = false,
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onCancel?.() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
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
            {/* Icon — monokrom, tidak lagi merah */}
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.06] border border-white/20 text-white/70 shrink-0">
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
            {/* Confirm button — monokrom, diferensiasi lewat teks bukan warna */}
            <button
              type="button"
              onClick={onConfirm}
              disabled={busy}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm tracking-wide bg-white text-black border border-white hover:bg-white/85 transition disabled:opacity-50"
            >
              {busy ? 'Deleting…' : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
