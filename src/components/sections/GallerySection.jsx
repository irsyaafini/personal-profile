import { useMemo, useRef, useState, useEffect, lazy, Suspense } from 'react'
import { Camera } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { useGallery } from '@/features/gallery/useGallery'
import { useTranslation } from '@/features/i18n/useTranslation'
import { resolveImage } from '@/lib/storage'

// OPTIMASI: DomeGallery (895 baris!) hanya di-load saat section masuk viewport.
// Ini mencegah 3 hal sekaligus:
//   1. JS parse time saat initial load
//   2. Memory overhead dari @use-gesture/react sebelum diperlukan
//   3. GPU work dari canvas/WebGL sebelum user scroll ke section ini
const DomeGallery = lazy(() =>
  import('@/components/reactbits/DomeGallery').then((m) => ({ default: m.default || m }))
)

/**
 * OPTIMASI: Custom hook IntersectionObserver yang hanya trigger sekali.
 * rootMargin '400px' = mulai load DomeGallery 400px sebelum section terlihat
 * sehingga sudah siap ketika user tiba.
 *
 * Perbedaan dari versi lama: menggunakan threshold 0 dengan rootMargin
 * daripada langsung setSeen(true) di fallback — lebih akurat.
 */
function useInViewportOnce(rootMargin = '400px') {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    if (seen) return
    const node = ref.current
    if (!node) return

    // OPTIMASI: Fallback graceful jika browser tidak support IntersectionObserver
    if (typeof IntersectionObserver === 'undefined') {
      setSeen(true)
      return
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true)
          obs.disconnect()
        }
      },
      { rootMargin, threshold: 0 }
    )

    obs.observe(node)
    return () => obs.disconnect()
  }, [seen, rootMargin])

  return [ref, seen]
}

export function GallerySection() {
  const { t } = useTranslation()
  const { data: items, isLoading } = useGallery()
  const [sentinelRef, isVisible] = useInViewportOnce('400px')

  // OPTIMASI: useMemo dengan deps yang tepat — hanya recompute jika `items` berubah
  const domeImages = useMemo(() => {
    if (!items?.length) return []
    return items
      .map((g) => ({
        src: resolveImage(g.image_path),
        alt: g.title || g.caption || '',
      }))
      .filter((it) => Boolean(it.src))
  }, [items])

  // OPTIMASI: Height konsisten via CSS variable agar tidak terjadi layout shift (CLS)
  const galleryHeight = 'min(80vh, 720px)'

  return (
    <section id="gallery" className="section-gap">
      <Container>
        <SectionHeader
          eyebrow={t('gallery.eyebrow', 'Photo Gallery')}
          title={t('sections.gallery', 'Photo Gallery')}
          description={t(
            'gallery.description',
            'Drag, swipe, and tap to explore. Moments captured along the journey — talks, fieldwork, milestones, and a few quiet days in between.'
          )}
        />
      </Container>

      {/* sentinel div — saat ini masuk viewport, DomeGallery mulai di-load */}
      <div ref={sentinelRef} className="mt-12 sm:mt-16">
        {isLoading ? (
          <Container>
            <Skeleton className="w-full h-[60vh] rounded-3xl" />
          </Container>
        ) : domeImages.length === 0 ? (
          <Container>
            <Card>
              <div className="p-12 flex flex-col items-center text-center">
                <Camera className="h-8 w-8 text-white/30 mb-3" aria-hidden />
                <p className="text-sm text-white/40">
                  {t('gallery.no_photos', 'No photos in the gallery yet.')}
                </p>
              </div>
            </Card>
          </Container>
        ) : !isVisible ? (
          // OPTIMASI: Placeholder dengan dimensi sama persis dengan DomeGallery
          // agar tidak ada Cumulative Layout Shift (CLS) saat section muncul.
          <Container>
            <div
              aria-hidden
              className="relative w-full mx-auto rounded-3xl border border-white/[0.06] bg-white/[0.015] flex items-center justify-center"
              style={{ height: galleryHeight }}
            >
              <Camera className="h-7 w-7 text-white/25" />
            </div>
          </Container>
        ) : (
          <div
            className="relative w-full mx-auto"
            style={{ height: galleryHeight, maxWidth: '100vw' }}
          >
            {/* OPTIMASI: Suspense boundary lokal — error di DomeGallery tidak
                crash seluruh halaman, hanya menampilkan skeleton fallback */}
            <Suspense
              fallback={
                <Container>
                  <Skeleton className="w-full h-[60vh] rounded-3xl" />
                </Container>
              }
            >
              <DomeGallery
                images={domeImages}
                fit={0.5}
                fitBasis="auto"
                minRadius={400}
                padFactor={0.2}
                overlayBlurColor="#0a0a0a"
                grayscale={false}
                imageBorderRadius="14px"
                openedImageBorderRadius="20px"
                openedImageWidth="380px"
                openedImageHeight="380px"
              />
            </Suspense>
          </div>
        )}
      </div>
    </section>
  )
}
