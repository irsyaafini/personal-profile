import { useEffect, useRef, useState, useMemo } from 'react'

/**
 * useScrollSpy — returns the id of the section currently in view.
 *
 * OPTIMASI yang diterapkan:
 * 1. Element lookup hanya dilakukan sekali (bukan tiap scroll event)
 * 2. rAF throttle tetap dipertahankan (satu update per frame maksimal)
 * 3. Functional update di setActive mencegah stale closure
 * 4. WeakRef tidak diperlukan di sini karena element dikumpulkan lewat cleanup
 * 5. key string sebagai dep agar effect tidak jalan ulang saat parent re-render
 *    tanpa perubahan sectionIds yang nyata
 *
 * @param {string[]} sectionIds
 * @param {number}   [offset=120]  px dari top yang dihitung sebagai "active"
 */
export function useScrollSpy(sectionIds, offset = 120) {
  const key = sectionIds.join('|')

  // OPTIMASI: ids memiliki referensi stabil — hanya berubah jika konten array berubah
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const ids = useMemo(() => sectionIds, [key])

  const [active, setActive] = useState(() => ids[0] ?? null)

  // Cache element references — di-refresh hanya saat resize
  const elementsRef = useRef([])

  useEffect(() => {
    if (ids.length === 0) return

    let frame = 0

    const refreshElements = () => {
      elementsRef.current = ids.map((id) => ({ id, el: document.getElementById(id) }))
    }

    refreshElements()

    const compute = () => {
      const scrollY = window.scrollY + offset
      let current = ids[0]
      for (const { id, el } of elementsRef.current) {
        if (el && el.offsetTop <= scrollY) current = id
      }
      // OPTIMASI: functional update — tidak perlu current active dalam deps
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
