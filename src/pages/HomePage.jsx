import { lazy, Suspense } from 'react'
import { HeroSection } from '@/components/sections/HeroSection'

/**
 * HomePage (OPTIMIZED FOR LIGHTHOUSE)
 *
 * ── PERUBAHAN OPTIMASI ────────────────────────────────────────────────────
 * 1. LCP — HeroSection di-import statis (above-the-fold) agar muncul cepat.
 * 2. TBT — Section below-the-fold di-lazy load via React.lazy + dibungkus
 *    Suspense. Browser tidak perlu parse JS section bawah saat first paint.
 *    Suspense fallback adalah div kosong dengan tinggi reservasi (CLS-safe).
 * 3. Speed Index — Section bawah dibungkus div dengan className "cv-auto"
 *    (content-visibility: auto) agar browser skip rendering sampai scroll
 *    mendekati area itu. Lihat utility .cv-auto di src/index.css.
 * ──────────────────────────────────────────────────────────────────────────
 */

// Section below-the-fold di-lazy load
const AboutSection      = lazy(() =>
  import('@/components/sections/AboutSection').then(m => ({ default: m.AboutSection }))
)
const ExperienceSection = lazy(() =>
  import('@/components/sections/ExperienceSection').then(m => ({ default: m.ExperienceSection }))
)
const SkillsSection     = lazy(() =>
  import('@/components/sections/SkillsSection').then(m => ({ default: m.SkillsSection }))
)
const GallerySection    = lazy(() =>
  import('@/components/sections/GallerySection').then(m => ({ default: m.GallerySection }))
)
const PortfolioSection  = lazy(() =>
  import('@/components/sections/PortfolioSection').then(m => ({ default: m.PortfolioSection }))
)
const ContactSection    = lazy(() =>
  import('@/components/sections/ContactSection').then(m => ({ default: m.ContactSection }))
)

// OPTIMASI CLS: fallback dengan tinggi reservasi untuk masing-masing section.
// Browser akan menampilkan placeholder ini sebelum section asli ter-load.
const SectionFallback = ({ height = 600 }) => (
  <div
    aria-hidden="true"
    style={{ minHeight: `${height}px` }}
    className="w-full"
  />
)

export default function HomePage() {
  return (
    <>
      {/* Hero — above-the-fold, eager */}
      <HeroSection />

      {/* Below-the-fold sections — lazy + content-visibility */}
      <div className="cv-auto">
        <Suspense fallback={<SectionFallback height={500} />}>
          <AboutSection />
        </Suspense>
      </div>

      <div className="cv-auto">
        <Suspense fallback={<SectionFallback height={600} />}>
          <ExperienceSection />
        </Suspense>
      </div>

      <div className="cv-auto">
        <Suspense fallback={<SectionFallback height={500} />}>
          <SkillsSection />
        </Suspense>
      </div>

      <div className="cv-auto">
        <Suspense fallback={<SectionFallback height={720} />}>
          <GallerySection />
        </Suspense>
      </div>

      <div className="cv-auto">
        <Suspense fallback={<SectionFallback height={600} />}>
          <PortfolioSection />
        </Suspense>
      </div>

      <div className="cv-auto">
        <Suspense fallback={<SectionFallback height={500} />}>
          <ContactSection />
        </Suspense>
      </div>
    </>
  )
}