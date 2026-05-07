import { cn } from '@/utils'

export function Input({ className = '', error = false, ...props }) {
  return (
    <input
      className={cn('field', error && 'field-error', className)}
      {...props}
    />
  )
}

export function Textarea({ className = '', error = false, rows = 5, ...props }) {
  return (
    <textarea
      rows={rows}
      className={cn('field resize-y', error && 'field-error', className)}
      {...props}
    />
  )
}

export function Label({ children, htmlFor, className = '' }) {
  return (
    <label htmlFor={htmlFor} className={cn('label', className)}>
      {children}
    </label>
  )
}
