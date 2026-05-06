import { useEffect, useRef, useState } from 'react'

/**
 * Hook that returns true once the element enters the viewport.
 * Use alongside Framer Motion or CSS animations for scroll reveals.
 *
 * @param {{ threshold?: number, rootMargin?: string }} [options]
 * @returns {{ ref: React.RefObject, isVisible: boolean }}
 *
 * @example
 * const { ref, isVisible } = useScrollReveal()
 * return (
 *   <div ref={ref} style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.5s' }}>
 *     Content
 *   </div>
 * )
 */
export function useScrollReveal({ threshold = 0.15, rootMargin = '0px' } = {}) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(el) // fire once
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return { ref, isVisible }
}
