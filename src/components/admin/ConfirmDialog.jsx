import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import GlassSurface from '@/components/reactbits/GlassSurface'

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

      {/* Dialog — GlassSurface */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-md"
      >
        <GlassSurface
          width="100%"
          height="100%"
          borderRadius={20}
          brightness={46}
          opacity={0.92}
          blur={14}
          backgroundOpacity={0.04}
          distortionScale={-130}
          redOffset={0}
          greenOffset={8}
          blueOffset={16}
          className="!absolute inset-0"
          style={{ position: 'absolute', inset: 0, zIndex: 0, width: '100%', height: '100%', borderRadius: 20 }}
        />
        <div className="relative z-10 p-6 sm:p-7">
          <div className="flex items-start gap-3">
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
