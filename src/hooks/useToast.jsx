import { useState, useCallback } from 'react'
import { CheckCircle2, AlertCircle, X } from 'lucide-react'
import { cn } from '@/utils'

/**
 * Minimal inline toast — no portal, no dep. Returns
 *   { toast, show(message, kind?) }
 *
 * Mount {toast} once near the top of a page.
 */
export function useToast() {
  const [state, setState] = useState(null)

  const show = useCallback((message, kind = 'success') => {
    setState({ message, kind, id: Date.now() })
    setTimeout(() => setState(null), 3500)
  }, [])

  const toast = state ? (
    <div className="fixed top-5 right-5 z-50 max-w-sm">
      <div
        className={cn(
          'flex items-start gap-2.5 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur',
          state.kind === 'success'
            ? 'bg-white/10 border-white/20 text-white'
            : 'bg-rose-500/15 border-rose-500/30 text-rose-200'
        )}
      >
        {state.kind === 'success' ? (
          <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
        ) : (
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
        )}
        <p className="text-sm leading-relaxed">{state.message}</p>
        <button
          onClick={() => setState(null)}
          className="ml-2 text-white/60 hover:text-white"
          aria-label="Dismiss"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  ) : null

  return { toast, show }
}
