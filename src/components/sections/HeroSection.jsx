import { ArrowRight, Mail, MapPin } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { Skeleton } from '@/components/ui/Skeleton'
import { useProfile } from '@/features/profile/useProfile'
import { useTranslation } from '@/features/i18n/useTranslation'
import { resolveImage } from '@/lib/storage'

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

  return (
    <section
      id="home"
      // overflow-x-clip (instead of overflow-hidden) doesn't clip text
      // descenders / italic overhang vertically.
      // pt-12 on mobile → tight spacing below the sticky GlassSurface navbar.
      className="relative overflow-x-clip pt-12 sm:pt-10 md:pt-12 pb-16 sm:pb-24"
    >
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Text */}
          <div className="lg:col-span-7 order-2 lg:order-1 min-w-0">
            {/* Subtle eyebrow */}
            <div className="inline-flex items-center gap-2.5 mb-7 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/10">
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
              // pr-2 gives the italic letterform breathing room so it
              // doesn't get cut off at the right edge.
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-[-0.03em] leading-[1.1] break-words pr-2">
                {firstPart && (
                  <>
                    <span className="text-white">{firstPart}</span>{' '}
                  </>
                )}
                <span className="text-gradient-silver italic font-light">{lastWord}</span>
              </h1>
            )}

            <p className="mt-7 sm:mt-8 text-lg sm:text-xl text-white/70 leading-relaxed max-w-2xl font-light">
              {headline}
            </p>

            {profile?.bio && (
              <p className="mt-4 text-sm sm:text-base text-white/50 leading-relaxed max-w-2xl">
                {profile.bio}
              </p>
            )}

            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/50">
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

            <div className="mt-9 sm:mt-11 flex flex-wrap items-center gap-3">
              <Button as="a" href="#portfolio" variant="solid">
                {t('hero.cta_primary', 'View Portfolio')}
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button as="a" href="#contact" variant="outline">
                {t('hero.cta_secondary', 'Get in Touch')}
              </Button>
            </div>
          </div>

          {/* Avatar — refined monochrome frame */}
          <div className="lg:col-span-5 order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative">
              {/* Soft white halo */}
              <div
                className="absolute -inset-8 rounded-full opacity-50"
                style={{
                  background:
                    'radial-gradient(circle, rgba(255,255,255,0.12), transparent 65%)',
                  filter: 'blur(40px)',
                }}
              />
              {/* Decorative ring */}
              <div className="absolute -inset-4 rounded-full border border-white/[0.08]" />
              <div className="absolute -inset-2 rounded-full border border-white/[0.05]" />

              <Avatar
                src={avatarSrc}
                name={fullName}
                size="2xl"
                className="relative ring-1 ring-white/15 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]"
              />

              {profile?.headline && (
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/85 border border-white/15 backdrop-blur whitespace-nowrap shadow-2xl">
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