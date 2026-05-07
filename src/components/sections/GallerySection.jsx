import { useMemo } from 'react'
import { Camera } from 'lucide-react'
import DomeGallery from '@/components/reactbits/DomeGallery'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { useGallery } from '@/features/gallery/useGallery'
import { useTranslation } from '@/features/i18n/useTranslation'
import { resolveImage } from '@/lib/storage'

export function GallerySection() {
  const { t } = useTranslation()
  const { data: items, isLoading } = useGallery()

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
      <div className="mt-12 sm:mt-16">
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
        ) : (
          <div
            className="relative w-full mx-auto"
            style={{
              height: 'min(80vh, 720px)',
              maxWidth: '100vw',
            }}
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
          </div>
        )}
      </div>
    </section>
  )
}
