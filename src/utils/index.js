/**
 * Format a date string to a human-readable format
 * @param {string} dateString
 * @param {Intl.DateTimeFormatOptions} [options]
 * @returns {string}
 */
export function formatDate(dateString, options = { year: 'numeric', month: 'long', day: 'numeric' }) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', options)
}

/**
 * Format date as "Mon YYYY" (e.g., "Jan 2024") for compact timeline display
 * @param {string} dateString
 * @returns {string}
 */
export function formatMonthYear(dateString) {
  if (!dateString) return 'Present'
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

/**
 * Format date range
 * @param {string} startDate
 * @param {string|null} endDate
 * @returns {string}
 */
export function formatDateRange(startDate, endDate) {
  const start = formatMonthYear(startDate)
  const end = endDate ? formatMonthYear(endDate) : 'Present'
  return `${start} — ${end}`
}

/**
 * Truncate text to a specified length with ellipsis
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export function truncateText(text, maxLength = 150) {
  if (!text || text.length <= maxLength) return text
  return `${text.slice(0, maxLength).trim()}…`
}

/**
 * Safely parse JSON, returning null on error
 * @param {string} jsonString
 * @returns {any|null}
 */
export function safeJsonParse(jsonString) {
  try {
    return typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString
  } catch {
    return null
  }
}

/**
 * Generate initials from a full name
 * @param {string} name
 * @returns {string}
 */
export function getInitials(name) {
  if (!name) return '?'
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0].toUpperCase())
    .join('')
}

/**
 * Get status badge color classes
 * @param {'ongoing'|'completed'|'published'} status
 * @returns {string}
 */
export function getStatusColor(status) {
  const colorMap = {
    ongoing: 'bg-amber-100 text-amber-700',
    completed: 'bg-primary-100 text-primary-700',
    published: 'bg-emerald-100 text-emerald-700',
  }
  return colorMap[status] ?? 'bg-slate-100 text-slate-600'
}

/**
 * Debounce a function
 * @param {function} fn
 * @param {number} delay
 * @returns {function}
 */
export function debounce(fn, delay) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

/**
 * Combine class names, filtering out falsy values
 * @param  {...string} classes
 * @returns {string}
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}
