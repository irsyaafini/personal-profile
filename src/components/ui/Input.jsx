/**
 * Reusable Input field component
 * @param {{
 *   label?: string,
 *   id: string,
 *   error?: string,
 *   className?: string,
 *   [key: string]: any
 * }} props
 */
export function Input({ label, id, error, className = '', ...rest }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="label-field">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`input-field ${error ? 'border-red-400 focus:ring-red-400' : ''} ${className}`}
        {...rest}
      />
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  )
}

/**
 * Reusable Textarea component
 */
export function Textarea({ label, id, error, className = '', rows = 4, ...rest }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="label-field">
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={rows}
        className={`input-field resize-none ${error ? 'border-red-400' : ''} ${className}`}
        {...rest}
      />
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  )
}

/**
 * Reusable Select component
 */
export function Select({ label, id, error, children, className = '', ...rest }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="label-field">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`input-field ${error ? 'border-red-400' : ''} ${className}`}
        {...rest}
      >
        {children}
      </select>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  )
}
