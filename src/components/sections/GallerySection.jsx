import { useMemo, useRef, useState, useEffect, lazy, Suspense } from 'react'
import { Camera } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { Reveal } from '@/components/common/Reveal'
import { useGallery } from '@/features/gallery/useGallery'
import { useTranslation } from '@/features/i18n/useTranslation'
import { resolveImage } from '@/lib/storage'

// OPTIMASI: DomeGallery (895 baris!) hanya di-load saat section masuk viewport.
const DomeGallery = lazy(() =>
  import('@/components/reactbits/DomeGallery').then((m) => ({ default: m.default || m }))
)

/**
 * useInViewportOnce — Hook untuk lazy loading DomeGallery.
 * Beda dengan useScrollReveal: ini selalu sekali (tidak replay) karena
 * komponen DomeGallery besar dan tidak perlu di-mount/unmount berulang.
 */
function useInViewportOnce(rootMargin = '400px') {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    if (seen) return
    const node = ref.current
    if (!node) return

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

  const domeImages = useMemo(() => {
    if (!items?.length) return []
    return items
      .map((g) => ({
        src: resolveImage(g.image_path),
        alt: g.title || g.caption || '',
      }))
      .filter((it) => Boolean(it.src))
  }, [items])

  const galleryHeight = 'min(80vh, 720px)'

  return (
    <section id="gallery" className="section-gap">
      <Container>
        {/* Heading reveal */}
        <Reveal direction="up">
          <SectionHeader
            eyebrow={t('gallery.eyebrow', 'Photo Gallery')}
            title={t('sections.gallery', 'Photo Gallery')}
            description={t(
              'gallery.description',
              'Drag, swipe, and tap to explore. Moments captured along the journey — talks, fieldwork, milestones, and a few quiet days in between.'
            )}
          />
        </Reveal>
      </Container>

      {/* sentinel div — saat ini masuk viewport, DomeGallery mulai di-load.
          PENTING: jangan bungkus dengan <Reveal> karena akan mengganggu
          sentinel detection (transform pada parent bisa pengaruhi observer). */}
      <div ref={sentinelRef} className="mt-8 sm:mt-10">
        {isLoading ? (
          <Container>
            <Skeleton className="w-full h-[60vh] rounded-3xl" />
          </Container>
        ) : domeImages.length === 0 ? (
          <Container>
            <Reveal direction="up">
              <Card>
                <div className="p-12 flex flex-col items-center text-center">
                  <Camera className="h-8 w-8 text-white/30 mb-3" aria-hidden />
                  <p className="text-sm text-white/40">
                    {t('gallery.no_photos', 'No photos in the gallery yet.')}
                  </p>
                </div>
              </Card>
            </Reveal>
          </Container>
        ) : !isVisible ? (
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
