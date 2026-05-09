/**
 * HeroSection — dengan GlassSurface pada label/badge elements
 */
import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Mail, MapPin } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { Skeleton } from '@/components/ui/Skeleton'
import { useProfile } from '@/features/profile/useProfile'
import { useTranslation } from '@/features/i18n/useTranslation'
import { resolveImage } from '@/lib/storage'
import GlassSurface from '@/components/reactbits/GlassSurface'

const introAlreadySeen = () => {
  try { return sessionStorage.getItem('intro-seen') === '1' }
  catch { return true }
}

const PENDING_CLASS = 'hero-anim-pending'

export function HeroSection() {
  const { data: profile, isLoading } = useProfile()
  const { t } = useTranslation()

  const avatarSrc = resolveImage(profile?.avatar_url)
  const fullName = profile?.full_name ?? 'Your Name'
  const headline = profile?.headline ?? 'Researcher · Lifelong Learner'
  const location = profile?.location

  const nameWords = fullName.trim().split(/\s+/)
  const lastWord = nameWords[nameWords.length - 1]
  const firstPart = nameWords.slice(0, -1).join(' ')

  const sectionRef    = useRef(null)
  const avatarWrapRef = useRef(null)
  const ringsRef      = useRef([])
  const eyebrowRef    = useRef(null)
  const headlineRef   = useRef(null)
  const subheadRef    = useRef(null)
  const bioRef        = useRef(null)
  const metaRef       = useRef(null)
  const buttonsRef    = useRef([])

  const [hasPlayed, setHasPlayed] = useState(false)
  const [introDone, setIntroDone] = useState(() => introAlreadySeen())

  const setButtonRef = (el, idx) => { if (el) buttonsRef.current[idx] = el }
  const setRingRef = (el, idx) => { if (el) ringsRef.current[idx] = el }

  useEffect(() => {
    if (introDone) return
    const onIntroComplete = () => setIntroDone(true)
    window.addEventListener('intro:complete', onIntroComplete)
    const safetyTimeout = setTimeout(() => setIntroDone(true), 6000)
    return () => {
      window.removeEventListener('intro:complete', onIntroComplete)
      clearTimeout(safetyTimeout)
    }
  }, [introDone])

  useEffect(() => {
    if (isLoading || !introDone || hasPlayed) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const avatarWrap = avatarWrapRef.current
    const eyebrow    = eyebrowRef.current
    const headlineEl = headlineRef.current
    const subhead    = subheadRef.current
    const bio        = bioRef.current
    const meta       = metaRef.current
    const rings      = ringsRef.current.filter(Boolean)
    const buttons    = buttonsRef.current.filter(Boolean)

    if (!avatarWrap) return

    const textEls = [eyebrow, headlineEl, subhead, bio, meta].filter(Boolean)
    const allEls  = [avatarWrap, ...rings, ...textEls, ...buttons]

    const showAll = () => {
      allEls.forEach(el => el.classList.remove(PENDING_CLASS))
    }

    if (prefersReducedMotion) {
      showAll()
      allEls.forEach(el => {
        el.style.opacity = '1'
        el.style.transform = 'none'
      })
      setHasPlayed(true)
      return
    }

    let cancelled = false
    let killFn = () => {}

    import('gsap').then(({ gsap }) => {
      if (cancelled) return

      const ctx = gsap.context(() => {
        gsap.set(avatarWrap, {
          y: -60,
          scale: 0.6,
          transformOrigin: 'center center',
          willChange: 'transform, opacity',
        })
        gsap.set(textEls, { y: 30, willChange: 'transform, opacity' })
        gsap.set(buttons, { y: 24, willChange: 'transform, opacity' })

        showAll()

        const tl = gsap.timeline({
          defaults: { ease: 'power3.out' },
          delay: 0.15,
          onComplete: () => {
            gsap.set(allEls, { opacity: 1, willChange: 'auto' })
            setHasPlayed(true)
          },
        })

        tl.fromTo(avatarWrap,
          { opacity: 0, y: -60, scale: 0.6 },
          { opacity: 1, y: 0, scale: 1, duration: 1.1, ease: 'back.out(1.4)' }
        )

        if (rings.length) {
          tl.fromTo(rings,
            { opacity: 0 },
            { opacity: 1, duration: 0.7, stagger: 0.08, ease: 'power2.out' },
            '-=0.55'
          )
        }

        if (textEls.length) {
          tl.fromTo(textEls,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.75, stagger: 0.08, ease: 'power3.out' },
            '-=0.45'
          )
        }

        if (buttons.length) {
          tl.fromTo(buttons,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' },
            '-=0.25'
          )
        }
      }, sectionRef)

      killFn = () => ctx.kill()
    }).catch(() => {
      showAll()
      allEls.forEach(el => { el.style.opacity = '1' })
      setHasPlayed(true)
    })

    return () => {
      cancelled = true
      killFn()
    }
  }, [isLoading, introDone, hasPlayed])

  const pending = hasPlayed ? '' : PENDING_CLASS

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative overflow-x-clip pt-24 sm:pt-24 md:pt-28 lg:pt-10 pb-12 sm:pb-16"
    >
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[420px] sm:min-h-[480px] lg:min-h-[520px]">
          {/* Text */}
          <div className="lg:col-span-7 order-2 lg:order-1 min-w-0">
            {/* Eyebrow badge — GlassSurface wrapper */}
            <div
              ref={eyebrowRef}
              className={`${pending} mb-5 inline-block`}
            >
              <GlassSurface
                width="auto"
                height={36}
                borderRadius={9999}
                brightness={50}
                opacity={0.92}
                blur={10}
                backgroundOpacity={0.03}
                distortionScale={-100}
                redOffset={0}
                greenOffset={6}
                blueOffset={12}
                style={{ display: 'inline-flex', alignItems: 'center', padding: '0 14px', gap: 8, minWidth: 0 }}
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-50 animate-ping" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
                </span>
                <span className="text-[11px] font-medium tracking-[0.22em] uppercase text-white/70">
                  {t('hero.greeting', 'Available for collaboration')}
                </span>
              </GlassSurface>
            </div>

            {isLoading ? (
              <Skeleton className="h-14 sm:h-20 w-3/4" />
            ) : (
              <h1
                ref={headlineRef}
                className={`${pending} font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-[-0.03em] leading-[1.1] break-words pr-2`}
                style={{ minHeight: '1.1em' }}
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
                  <MapPin className="h-4 w-4 text-white/60" aria-hidden="true" />
                  {location}
                </span>
              )}
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center gap-2 hover:text-white transition"
                >
                  <Mail className="h-4 w-4 text-white/60" aria-hidden="true" />
                  {profile.email}
                </a>
              )}
            </div>

            <div className="mt-6 sm:mt-7 flex flex-wrap items-center gap-3">
              <div ref={(el) => setButtonRef(el, 0)} className={`${pending} inline-flex`}>
                <Button as="a" href="#portfolio" variant="solid">
                  {t('hero.cta_primary', 'View Portfolio')}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
              <div ref={(el) => setButtonRef(el, 1)} className={`${pending} inline-flex`}>
                <Button as="a" href="#contact" variant="outline">
                  {t('hero.cta_secondary', 'Get in Touch')}
                </Button>
              </div>
            </div>
          </div>

          {/* Avatar */}
          <div className="lg:col-span-5 order-1 lg:order-2 flex justify-center lg:justify-end">
            <div
              ref={avatarWrapRef}
              className={`${pending} relative`}
              style={{ aspectRatio: '1 / 1' }}
            >
              <div
                ref={(el) => setRingRef(el, 0)}
                className={`${pending} absolute -inset-8 rounded-full opacity-50`}
                style={{
                  background: 'radial-gradient(circle, rgba(255,255,255,0.12), transparent 65%)',
                  filter: 'blur(40px)',
                }}
                aria-hidden="true"
              />
              <div
                ref={(el) => setRingRef(el, 1)}
                className={`${pending} absolute -inset-4 rounded-full border border-white/[0.08]`}
                aria-hidden="true"
              />
              <div
                ref={(el) => setRingRef(el, 2)}
                className={`${pending} absolute -inset-2 rounded-full border border-white/[0.05]`}
                aria-hidden="true"
              />

              <Avatar
                src={avatarSrc}
                name={fullName}
                size="2xl"
                priority={true}
                className="relative ring-1 ring-white/15 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]"
              />

              {profile?.headline && (
                <div
                  ref={(el) => setRingRef(el, 3)}
                  className={`${pending} absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap`}
                >
                  <GlassSurface
                    width="auto"
                    height={36}
                    borderRadius={9999}
                    brightness={48}
                    opacity={0.92}
                    blur={12}
                    backgroundOpacity={0.02}
                    distortionScale={-110}
                    style={{ display: 'inline-flex', alignItems: 'center', padding: '0 16px', minWidth: 0 }}
                  >
                    <span className="text-[11px] font-medium tracking-[0.18em] uppercase text-white/85">
                      {profile.headline.split(' ').slice(0, 3).join(' ')}
                    </span>
                  </GlassSurface>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
