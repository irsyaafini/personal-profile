/**
 * useScrollReveal — IntersectionObserver-based reveal hook
 *
 * Mengembalikan `{ ref, inView }`:
 *   - ref:    pasangkan ke elemen target
 *   - inView: true saat elemen masuk viewport, false saat keluar
 *
 * Mode: REPLAY — animasi jalan setiap kali elemen masuk viewport lagi
 * (sesuai pilihan user). Untuk mode "sekali saja", set option `once: true`.
 *
 * Kenapa pakai IntersectionObserver, bukan ScrollTrigger?
 * - Native API, tidak ada plugin tambahan, tidak ada scroll listener overhead
 * - Otomatis di-throttle browser, super performant untuk banyak elemen
 * - Cukup untuk kebutuhan "fade + slide saat masuk viewport"
 *
 * Options:
 *   - threshold: 0..1 — berapa banyak elemen harus terlihat (default 0.15 = 15%)
 *   - rootMargin: string CSS — offset trigger area (default "0px 0px -10% 0px"
 *                              artinya trigger 10% sebelum elemen sampai ke
 *                              bottom viewport, terasa lebih natural)
 *   - once: boolean — kalau true, animasi hanya sekali (default false = replay)
 */
import { useEffect, useRef, useState } from 'react'

export function useScrollReveal({
  threshold = 0.15,
  rootMargin = '0px 0px -10% 0px',
  once = false,
} = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Hormati prefers-reduced-motion: langsung tampilkan, tidak observe.
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      setInView(true)
      return
    }

    // Fallback untuk browser super lawas tanpa IntersectionObserver.
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) observer.unobserve(el)
        } else if (!once) {
          // Mode replay: keluar viewport → reset agar bisa animate lagi
          setInView(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin, once])

  return { ref, inView }
}
