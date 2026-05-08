import { useEffect, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

/**
 * Simple, accessible lightbox.
 * @param {{
 *   items: Array<{src: string, title?: string, caption?: string}>,
 *   index: number,
 *   onClose: () => void,
 *   onChange: (newIndex: number) => void,
 * }} props
 */
export function Lightbox({ items, index, onClose, onChange }) {
  const total = items.length
  const current = items[index]

  const next = useCallback(() => {
    if (total === 0) return
    onChange((index + 1) % total)
  }, [index, total, onChange])

  const prev = useCallback(() => {
    if (total === 0) return
    onChange((index - 1 + total) % total)
  }, [index, total, onChange])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') next()
      else if (e.key === 'ArrowLeft') prev()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [next, prev, onClose])

  if (!current) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onClose() }}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/80 hover:bg-white/10 transition"
        aria-label="Close"
      >
        <X className="h-5 w-5" />
      </button>

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); prev() }}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/5 text-white/80 hover:bg-white/10 transition"
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); next() }}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/5 text-white/80 hover:bg-white/10 transition"
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      <div
        className="max-w-5xl w-full px-4 sm:px-10"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={current.src}
          alt={current.title ?? ''}
          className="max-h-[80vh] w-full object-contain rounded-xl"
        />
        {(current.title || current.caption) && (
          <div className="mt-4 text-center">
            {current.title && (
              <h3 className="text-base sm:text-lg font-semibold text-white/90">
                {current.title}
              </h3>
            )}
            {current.caption && (
              <p className="mt-1 text-sm text-white/55">{current.caption}</p>
            )}
            <p className="mt-2 text-xs text-white/40">
              {index + 1} / {total}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
