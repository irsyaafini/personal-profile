import { useEffect, useState, useMemo } from 'react'

/**
 * Returns the id of the section currently in view.
 *
 * Optimized: throttled via requestAnimationFrame (one update per frame max)
 * and section elements are looked up once per scroll listener, not per call.
 *
 * @param {string[]} sectionIds
 * @param {number} [offset=120]
 */
export function useScrollSpy(sectionIds, offset = 120) {
  // Stable key so the effect doesn't re-run on every render of the parent.
  const key = sectionIds.join('|')
  const [active, setActive] = useState(sectionIds[0] ?? null)

  // Memoize ids to keep referential stability across renders.
  const ids = useMemo(() => sectionIds, [key]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (ids.length === 0) return

    let frame = 0
    let elements = []

    const refreshElements = () => {
      elements = ids.map((id) => ({ id, el: document.getElementById(id) }))
    }
    refreshElements()

    const compute = () => {
      const scrollY = window.scrollY + offset
      let current = ids[0]
      for (const { id, el } of elements) {
        if (el && el.offsetTop <= scrollY) current = id
      }
      setActive((prev) => (prev === current ? prev : current))
      frame = 0
    }

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(compute)
    }

    compute()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', refreshElements, { passive: true })
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', refreshElements)
    }
  }, [ids, offset])

  return active
}
