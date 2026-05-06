/**
 * Format a date string to a human-readable format
 * @param {string} dateString
 * @param {Intl.DateTimeFormatOptions} [options]
 * @returns {string}
 */
export function formatDate(dateString, options = { year: 'numeric', month: 'long', day: 'numeric' }) {
  return new Date(dateString).toLocaleDateString('en-US', options)
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
 * Get publication type label
 * @param {string} type
 * @returns {string}
 */
export function getPublicationTypeLabel(type) {
  const labels = {
    journal: 'Journal Article',
    conference: 'Conference Paper',
    book_chapter: 'Book Chapter',
    report: 'Technical Report',
  }
  return labels[type] ?? type
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
