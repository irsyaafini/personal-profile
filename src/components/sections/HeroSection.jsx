/**
 * HeroSection — Sequential Stagger Reveal Animation
 *
 * Konsep animasi:
 *   1. AVATAR turun dari atas (y: -60) dengan scale 0.6 → 1, ease back.out
 *      → memberi kesan "datang" yang sedikit overshoot, elegan.
 *   2. RINGS + HALO + LABEL fade in mengikuti avatar (sedikit ter-offset).
 *   3. ELEMEN TEKS muncul satu per satu dari bawah (y: 30 → 0, opacity 0 → 1)
 *      dengan stagger 0.08s, ease power3.out:
 *        eyebrow → headline → subheadline → bio → meta info
 *   4. BUTTONS slide up terakhir (y: 24 → 0) dengan stagger lebih ketat 0.1s.
 *
 * Timing total: ~2.0s (presisi & tidak terburu-buru).
 *
 * ── Bagaimana initial-hide bekerja ────────────────────────────────────────
 * Sebelum animasi mulai, semua elemen target diberi class .hero-anim-pending
 * yang men-set opacity:0 lewat CSS (lihat index.css). Pendekatan ini lebih
 * aman daripada men-set inline style via JS karena:
 *   - Tidak ada FOUC (elemen tidak sempat tampil sebelum JS jalan)
 *   - Tidak konflik dengan gsap.context() saat cleanup
 *   - Tidak race condition antar useEffect
 *
 * Setelah animasi mulai, kita hapus class itu — GSAP yang pegang kendali
 * opacity selama timeline berjalan. Setelah selesai, GSAP menulis inline
 * opacity:1 sehingga elemen tetap tampil meski class sudah tidak ada.
 *
 * Prerequisite: di src/index.css, tambahkan rule:
 *   .hero-anim-pending { opacity: 0; }
 *
 * ── Catatan teknis lain ──────────────────────────────────────────────────
 *   - Animasi menunggu dua kondisi: data ready + intro screen selesai.
 *   - Mendengarkan custom event `intro:complete` dari IntroScreen.
 *   - Menghormati `prefers-reduced-motion`: langsung tampil tanpa animasi.
 */
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ArrowRight, Mail, MapPin } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { Skeleton } from '@/components/ui/Skeleton'
import { useProfile } from '@/features/profile/useProfile'
import { useTranslation } from '@/features/i18n/useTranslation'
import { resolveImage } from '@/lib/storage'

// Cek apakah intro sudah pernah ditampilkan di session ini.
// Sinkron dengan logika di RootLayout / IntroScreen.
const introAlreadySeen = () => {
  try { return sessionStorage.getItem('intro-seen') === '1' }
  catch { return true } // Kalau sessionStorage di-block, anggap sudah selesai
}

// Class untuk elemen yang menunggu di-animasikan (opacity:0 via CSS).
const PENDING_CLASS = 'hero-anim-pending'

export function HeroSection() {
  const { data: profile, isLoading } = useProfile()
  const { t } = useTranslation()

  const avatarSrc = resolveImage(profile?.avatar_url)
  const fullName = profile?.full_name ?? 'Your Name'
  const headline = profile?.headline ?? 'Researcher · Lifelong Learner'
  const location = profile?.location

  // Split full name → first part (white) + last word (italic silver gradient)
  const nameWords = fullName.trim().split(/\s+/)
  const lastWord = nameWords[nameWords.length - 1]
  const firstPart = nameWords.slice(0, -1).join(' ')

  // ── Refs untuk semua elemen yang akan dianimasikan ──────────────────────
  const sectionRef    = useRef(null)
  const avatarWrapRef = useRef(null)   // pembungkus avatar (untuk drop + scale)
  const ringsRef      = useRef([])     // halo + 2 ring + label
  const eyebrowRef    = useRef(null)
  const headlineRef   = useRef(null)
  const subheadRef    = useRef(null)
  const bioRef        = useRef(null)
  const metaRef       = useRef(null)
  const buttonsRef    = useRef([])

  // Trigger animasi hanya setelah data siap
  const [hasPlayed, setHasPlayed] = useState(false)

  // Intro selesai? Kalau intro sudah pernah dilihat di session ini, langsung
  // true. Kalau belum, mulai dari false dan menunggu event 'intro:complete'.
  const [introDone, setIntroDone] = useState(() => introAlreadySeen())

  // Helper: register ref aman dari React StrictMode double-call
  const setButtonRef = (el, idx) => {
    if (el) buttonsRef.current[idx] = el
  }
  const setRingRef = (el, idx) => {
    if (el) ringsRef.current[idx] = el
  }

  // ── Listener untuk event 'intro:complete' ───────────────────────────────
  useEffect(() => {
    if (introDone) return

    const onIntroComplete = () => setIntroDone(true)
    window.addEventListener('intro:complete', onIntroComplete)

    // Safety net: kalau karena suatu hal event tidak datang
    // (mis. IntroScreen ter-unmount lebih dulu), tunggu max 6 detik
    // lalu jalankan animasi tetap. Mencegah hero "terjebak" tidak muncul.
    const safetyTimeout = setTimeout(() => setIntroDone(true), 6000)

    return () => {
      window.removeEventListener('intro:complete', onIntroComplete)
      clearTimeout(safetyTimeout)
    }
  }, [introDone])

  // ── Timeline animasi utama ──────────────────────────────────────────────
  useEffect(() => {
    // Tunggu: data ready, intro selesai, dan belum pernah play.
    if (isLoading || !introDone || hasPlayed) return

    // Hormati preferensi user untuk reduced motion
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    const avatarWrap = avatarWrapRef.current
    const eyebrow    = eyebrowRef.current
    const headline   = headlineRef.current
    const subhead    = subheadRef.current
    const bio        = bioRef.current
    const meta       = metaRef.current
    const rings      = ringsRef.current.filter(Boolean)
    const buttons    = buttonsRef.current.filter(Boolean)

    if (!avatarWrap) return

    const textEls = [eyebrow, headline, subhead, bio, meta].filter(Boolean)
    const allEls  = [avatarWrap, ...rings, ...textEls, ...buttons]

    // Helper: pastikan elemen tampil (hapus class pending).
    const showAll = () => {
      allEls.forEach(el => el.classList.remove(PENDING_CLASS))
    }

    // Mode reduced-motion: tampil instan tanpa animasi.
    if (prefersReducedMotion) {
      showAll()
      gsap.set(allEls, { opacity: 1, y: 0, scale: 1, clearProps: 'all' })
      setHasPlayed(true)
      return
    }

    const ctx = gsap.context(() => {
      // ── STATE AWAL: set posisi/scale (opacity sudah 0 dari CSS class) ────
      gsap.set(avatarWrap, {
        y: -60,
        scale: 0.6,
        transformOrigin: 'center center',
        willChange: 'transform, opacity',
      })
      gsap.set(textEls, {
        y: 30,
        willChange: 'transform, opacity',
      })
      gsap.set(buttons, {
        y: 24,
        willChange: 'transform, opacity',
      })

      // SEKARANG hapus class pending — GSAP pegang kendali opacity.
      // Dilakukan SETELAH gsap.set agar tidak ada flash.
      showAll()

      // ── TIMELINE UTAMA ───────────────────────────────────────────────────
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        // Sedikit jeda agar "napas" antara intro keluar dan hero masuk.
        delay: 0.15,
        onComplete: () => {
          // Pastikan opacity final = 1 (inline), bersihkan will-change.
          gsap.set(allEls, { opacity: 1, willChange: 'auto' })
          setHasPlayed(true)
        },
      })

      // FASE 1 — Avatar drop dari atas dengan scale + slight overshoot
      tl.fromTo(avatarWrap,
        { opacity: 0, y: -60, scale: 0.6 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.1,
          ease: 'back.out(1.4)',
        }
      )

      // FASE 1b — Halo + rings + label fade in mengikuti avatar
      if (rings.length) {
        tl.fromTo(rings,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.7,
            stagger: 0.08,
            ease: 'power2.out',
          },
          '-=0.55'
        )
      }

      // FASE 2 — Elemen teks muncul satu per satu dari bawah
      if (textEls.length) {
        tl.fromTo(textEls,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.08,
            ease: 'power3.out',
          },
          '-=0.45'
        )
      }

      // FASE 3 — Buttons slide up terakhir
      if (buttons.length) {
        tl.fromTo(buttons,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out',
          },
          '-=0.25'
        )
      }
    }, sectionRef)

    // PENTING: TIDAK pakai ctx.revert() karena akan mengembalikan inline
    // style ke state sebelum context dibuat (membuat elemen invisible lagi).
    // Cukup kill timeline.
    return () => {
      ctx.kill()
    }
  }, [isLoading, introDone, hasPlayed])

  // Class pending hanya ditambahkan sampai animasi mulai. Setelah hasPlayed,
  // class tidak ditambahkan lagi, dan inline opacity:1 dari GSAP yang berlaku.
  const pending = hasPlayed ? '' : PENDING_CLASS

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative overflow-x-clip pt-24 sm:pt-24 md:pt-28 lg:pt-10 pb-12 sm:pb-16"
    >
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Text */}
          <div className="lg:col-span-7 order-2 lg:order-1 min-w-0">
            {/* Subtle eyebrow */}
            <div
              ref={eyebrowRef}
              className={`${pending} inline-flex items-center gap-2.5 mb-5 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/10`}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-50 animate-ping" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
              </span>
              <span className="text-[11px] font-medium tracking-[0.22em] uppercase text-white/70">
                {t('hero.greeting', 'Available for collaboration')}
              </span>
            </div>

            {isLoading ? (
              <Skeleton className="h-14 sm:h-20 w-3/4" />
            ) : (
              <h1
                ref={headlineRef}
                className={`${pending} font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-[-0.03em] leading-[1.1] break-words pr-2`}
              >
                {firstPart && (
                  <>
                    <span className="text-white">{firstPart}</span>{' '}
                  </>
                )}
                <span className="text-gradient-silver italic font-light">{lastWord}</span>
              </h1>
            )}

            <p
              ref={subheadRef}
              className={`${pending} mt-4 sm:mt-5 text-lg sm:text-xl text-white/70 leading-relaxed max-w-2xl font-light`}
            >
              {headline}
            </p>

            {profile?.bio && (
              <p
                ref={bioRef}
                className={`${pending} mt-4 text-sm sm:text-base text-white/50 leading-relaxed max-w-2xl`}
              >
                {profile.bio}
              </p>
            )}

            <div
              ref={metaRef}
              className={`${pending} mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/50`}
            >
              {location && (
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-white/60" />
                  {location}
                </span>
              )}
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center gap-2 hover:text-white transition"
                >
                  <Mail className="h-4 w-4 text-white/60" />
                  {profile.email}
                </a>
              )}
            </div>

            <div className="mt-6 sm:mt-7 flex flex-wrap items-center gap-3">
              <div ref={(el) => setButtonRef(el, 0)} className={`${pending} inline-flex`}>
                <Button as="a" href="#portfolio" variant="solid">
                  {t('hero.cta_primary', 'View Portfolio')}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              <div ref={(el) => setButtonRef(el, 1)} className={`${pending} inline-flex`}>
                <Button as="a" href="#contact" variant="outline">
                  {t('hero.cta_secondary', 'Get in Touch')}
                </Button>
              </div>
            </div>
          </div>

          {/* Avatar — refined monochrome frame */}
          <div className="lg:col-span-5 order-1 lg:order-2 flex justify-center lg:justify-end">
            <div ref={avatarWrapRef} className={`${pending} relative`}>
              {/* Soft white halo */}
              <div
                ref={(el) => setRingRef(el, 0)}
                className={`${pending} absolute -inset-8 rounded-full opacity-50`}
                style={{
                  background:
                    'radial-gradient(circle, rgba(255,255,255,0.12), transparent 65%)',
                  filter: 'blur(40px)',
                }}
              />
              {/* Decorative rings */}
              <div
                ref={(el) => setRingRef(el, 1)}
                className={`${pending} absolute -inset-4 rounded-full border border-white/[0.08]`}
              />
              <div
                ref={(el) => setRingRef(el, 2)}
                className={`${pending} absolute -inset-2 rounded-full border border-white/[0.05]`}
              />

              <Avatar
                src={avatarSrc}
                name={fullName}
                size="2xl"
                className="relative ring-1 ring-white/15 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]"
              />

              {profile?.headline && (
                <div
                  ref={(el) => setRingRef(el, 3)}
                  className={`${pending} absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/85 border border-white/15 backdrop-blur whitespace-nowrap shadow-2xl`}
                >
                  <span className="text-[11px] font-medium tracking-[0.18em] uppercase text-white/85">
                    {profile.headline.split(' ').slice(0, 3).join(' ')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
