import { useMemo, useEffect, useRef, useState, lazy, Suspense } from 'react'
import { Camera } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { useGallery } from '@/features/gallery/useGallery'
import { useTranslation } from '@/features/i18n/useTranslation'
import { resolveImage } from '@/lib/storage'

// Lazy-load the heavy DomeGallery (~900 lines + 3D transforms) so it doesn't
// bloat the initial page bundle. It's only loaded once the section scrolls
// into view.
const DomeGallery = lazy(() =>
  import('@/components/reactbits/DomeGallery').then((m) => ({ default: m.default || m }))
)

/** Tracks whether an element has ever scrolled into the viewport. */
function useInViewportOnce(rootMargin = '300px') {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    if (seen) return
    const node = ref.current
    if (!node || typeof IntersectionObserver === 'undefined') {
      setSeen(true)
      return
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true)
          obs.disconnect()
        }
      },
      { rootMargin }
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

  // Normalize Supabase rows to the shape DomeGallery expects: { src, alt }
  const domeImages = useMemo(() => {
    if (!items) return []
    return items
      .map((g) => ({
        src: resolveImage(g.image_path),
        alt: g.title || g.caption || '',
      }))
      .filter((it) => Boolean(it.src))
  }, [items])

  return (
    <section id="gallery" className="section-gap">
      <Container>
        <SectionHeader
          eyebrow="Photo Gallery"
          title={t('sections.gallery', 'Photo Gallery')}
          description="Drag, swipe, and tap to explore. Moments captured along the journey — talks, fieldwork, milestones, and a few quiet days in between."
        />
      </Container>

      {/*
        DomeGallery, restyled monochrome:
        - overlayBlurColor matches the page background for seamless blend
        - grayscale ON for editorial / coffee-table-book feel
        - tile and opened image radii kept understated
      */}
      <div ref={sentinelRef} className="mt-12 sm:mt-16">
        {isLoading ? (
          <Container>
            <Skeleton className="w-full h-[60vh] rounded-3xl" />
          </Container>
        ) : domeImages.length === 0 ? (
          <Container>
            <Card>
              <div className="p-12 flex flex-col items-center text-center">
                <Camera className="h-8 w-8 text-white/30 mb-3" />
                <p className="text-sm text-white/40">No photos in the gallery yet.</p>
              </div>
            </Card>
          </Container>
        ) : !isVisible ? (
          // Placeholder shown until the section enters the viewport. This
          // defers loading & mounting the heavy DomeGallery component.
          <Container>
            <div
              className="relative w-full mx-auto rounded-3xl border border-white/[0.06] bg-white/[0.015] flex items-center justify-center"
              style={{ height: 'min(80vh, 720px)' }}
            >
              <Camera className="h-7 w-7 text-white/25" />
            </div>
          </Container>
        ) : (
          <div
            className="relative w-full mx-auto"
            style={{
              height: 'min(80vh, 720px)',
              maxWidth: '100vw',
            }}
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
