import { useEffect, useState } from 'react'

/**
 * Returns the id of the section currently in view.
 * @param {string[]} sectionIds
 * @param {number} [offset=120]
 */
export function useScrollSpy(sectionIds, offset = 120) {
  const [active, setActive] = useState(sectionIds[0] ?? null)

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY + offset
      let current = sectionIds[0]
      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= scrollY) current = id
      }
      setActive(current)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [sectionIds, offset])

  return active
}
