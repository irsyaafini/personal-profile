import { useState, useRef } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/utils'

/**
 * Comma- or Enter-separated chip input. Stores an array of strings.
 *
 * @param {string[]} value
 * @param {(next: string[]) => void} onChange
 */
export function TagInput({ value = [], onChange, placeholder = 'Type and press Enter…', className = '' }) {
  const [draft, setDraft] = useState('')
  const inputRef = useRef(null)

  const add = (raw) => {
    const cleaned = raw.split(',').map((s) => s.trim()).filter(Boolean)
    if (cleaned.length === 0) return
    const next = [...value]
    cleaned.forEach((c) => {
      if (!next.includes(c)) next.push(c)
    })
    onChange(next)
    setDraft('')
  }

  const removeAt = (idx) => {
    const next = value.slice()
    next.splice(idx, 1)
    onChange(next)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      if (draft.trim()) add(draft)
    } else if (e.key === 'Backspace' && draft === '' && value.length > 0) {
      removeAt(value.length - 1)
    }
  }

  return (
    <div
      className={cn(
        'field flex flex-wrap items-center gap-1.5 cursor-text',
        className
      )}
      onClick={() => inputRef.current?.focus()}
    >
      {value.map((tag, i) => (
        <span
          key={`${tag}-${i}`}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/[0.06] border border-white/10 text-xs text-white"
        >
          {tag}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              removeAt(i)
            }}
            className="text-white/50 hover:text-white"
            aria-label={`Remove ${tag}`}
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => draft.trim() && add(draft)}
        placeholder={value.length === 0 ? placeholder : ''}
        className="flex-1 min-w-[120px] bg-transparent outline-none text-sm text-white placeholder:text-white/35 py-0.5"
      />
    </div>
  )
}
