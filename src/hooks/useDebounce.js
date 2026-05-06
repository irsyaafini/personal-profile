import { useState, useEffect } from 'react'

/**
 * Delays updating a value until after `delay` ms have passed
 * since the last change. Useful for search inputs.
 *
 * @template T
 * @param {T} value - value to debounce
 * @param {number} [delay=400] - debounce delay in ms
 * @returns {T} debounced value
 *
 * @example
 * const [query, setQuery] = useState('')
 * const debouncedQuery = useDebounce(query, 300)
 * // use debouncedQuery in your API call
 */
export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}
