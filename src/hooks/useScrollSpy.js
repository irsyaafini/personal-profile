/**
 * useScrollSpy — Returns the id of the section currently in view.
 *
 * v3: Hybrid IntersectionObserver + getBoundingClientRect untuk akurasi
 * tinggi, robust terhadap layout shift dari reveal animation.
 *
 * Algoritma: cari section yang TOP-nya paling baru saja dilewati
 * trigger line (default: 25% dari top viewport).
 *
 * @param {string[]} sectionIds — id semua section yang di-track
 * @param {number}   [threshold=0.25] — posisi garis aktif di viewport
 *                                       (0 = top, 0.5 = middle, 1 = bottom)
 */
import { useEffect, useState, useMemo, useRef } from 'react'

export function useScrollSpy(sectionIds, threshold = 0.25) {
  const key = sectionIds.join('|')

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const ids = useMemo(() => sectionIds, [key])

  const [active, setActive] = useState(() => ids[0] ?? null)

  const elementsRef = useRef([])
  const frameRef = useRef(0)
  const observerRef = useRef(null)

  useEffect(() => {
    if (ids.length === 0) {
      setActive(null)
      return
    }

    const refreshElements = () => {
      elementsRef.current = ids
        .map((id) => ({ id, el: document.getElementById(id) }))
        .filter((x) => x.el !== null)
    }

    const compute = () => {
      frameRef.current = 0

      if (elementsRef.current.length === 0) {
        refreshElements()
        if (elementsRef.current.length === 0) return
      }

      const scrollY = window.scrollY
      const viewportH = window.innerHeight
      const docH = document.documentElement.scrollHeight
      const triggerLine = scrollY + viewportH * threshold

      const atBottom = scrollY + viewportH >= docH - 2
      if (atBottom) {
        const lastId = elementsRef.current[elementsRef.current.length - 1].id
        setActive((prev) => (prev === lastId ? prev : lastId))
        return
      }

      if (scrollY <= 0) {
        const firstId = elementsRef.current[0].id
        setActive((prev) => (prev === firstId ? prev : firstId))
        return
      }

      let bestId = elementsRef.current[0].id
      let bestTop = -Infinity

      for (const { id, el } of elementsRef.current) {
        const rect = el.getBoundingClientRect()
        const absoluteTop = rect.top + scrollY

        if (absoluteTop <= triggerLine) {
          if (absoluteTop > bestTop) {
            bestTop = absoluteTop
            bestId = id
          }
        }
      }

      setActive((prev) => (prev === bestId ? prev : bestId))
    }

    const onScrollOrResize = () => {
      if (frameRef.current) return
      frameRef.current = requestAnimationFrame(compute)
    }

    refreshElements()
    compute()

    if (typeof IntersectionObserver !== 'undefined') {
      observerRef.current = new IntersectionObserver(onScrollOrResize, {
        rootMargin: '0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      })
      elementsRef.current.forEach(({ el }) => observerRef.current.observe(el))
    }

    window.addEventListener('scroll', onScrollOrResize, { passive: true })
    const onResize = () => {
      refreshElements()
      onScrollOrResize()
    }
    window.addEventListener('resize', onResize, { passive: true })

    let retryCount = 0
    const retryInterval = setInterval(() => {
      if (retryCount >= 5) {
        clearInterval(retryInterval)
        return
      }
      const found = ids
        .map((id) => document.getElementById(id))
        .filter(Boolean)
      if (found.length !== elementsRef.current.length) {
        refreshElements()
        observerRef.current?.disconnect()
        if (observerRef.current) {
          elementsRef.current.forEach(({ el }) =>
            observerRef.current.observe(el)
          )
        }
        compute()
      }
      retryCount++
    }, 300)

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
      observerRef.current?.disconnect()
      observerRef.current = null
      window.removeEventListener('scroll', onScrollOrResize)
      window.removeEventListener('resize', onResize)
      clearInterval(retryInterval)
    }
  }, [ids, threshold])

  return active
}