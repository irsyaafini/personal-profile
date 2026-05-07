import { Mail, Phone, MapPin, Globe, Calendar, Languages, Heart } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { Badge } from '@/components/ui/Badge'
import { useProfile } from '@/features/profile/useProfile'
import { useTranslation } from '@/features/i18n/useTranslation'
import { formatDate } from '@/utils'

function InfoRow({ icon: Icon, label, value, href }) {
  if (!value) return null
  const content = (
    <>
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.04] border border-white/10 text-white/80 shrink-0 transition group-hover:bg-white/[0.08] group-hover:border-white/20">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-[0.18em] text-white/40 font-semibold">
          {label}
        </p>
        <p className="mt-1 text-sm text-white/85 truncate">{value}</p>
      </div>
    </>
  )

  if (href) {
    return (
      <a
        href={href}
        className="flex items-center gap-3.5 group hover:text-white transition"
        target={href.startsWith('http') ? '_blank' : undefined}
        rel="noreferrer"
      >
        {content}
      </a>
    )
  }
  return <div className="flex items-center gap-3.5 group">{content}</div>
}

export function AboutSection() {
  const { data: profile, isLoading } = useProfile()
  const { t } = useTranslation()

  return (
    <section id="about" className="section-gap">
      <Container>
        <SectionHeader
          eyebrow={t('sections.personal_info', 'Personal Info')}
          title={t('sections.about', 'About Me')}
          description={profile?.bio}
        />

        <div className="mt-12 sm:mt-16 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal data card */}
          <Card className="lg:col-span-2">
            <div className="p-7 sm:p-9">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50 mb-7 flex items-center gap-2.5">
                <span className="h-px w-6 bg-white/30" />
                {t('sections.personal_info', 'Personal Info')}
              </h3>

              {isLoading ? (
                <div className="grid sm:grid-cols-2 gap-5">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-14" />
                  ))}
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
                  <InfoRow icon={Mail} label="Email" value={profile?.email} href={profile?.email && `mailto:${profile.email}`} />
                  <InfoRow icon={Phone} label="Phone" value={profile?.phone} href={profile?.phone && `tel:${profile.phone}`} />
                  <InfoRow icon={MapPin} label="Location" value={profile?.location} />
                  <InfoRow icon={Globe} label="Website" value={profile?.website} href={profile?.website} />
                  <InfoRow
                    icon={Calendar}
                    label="Birth Date"
                    value={profile?.birth_date && formatDate(profile.birth_date)}
                  />
                  <InfoRow
                    icon={Languages}
                    label="Languages"
                    value={Array.isArray(profile?.languages) ? profile.languages.join(', ') : profile?.languages}
                  />
                </div>
              )}
            </div>
          </Card>

          {/* Interests card */}
          <Card>
            <div className="p-7 sm:p-9">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50 mb-7 flex items-center gap-2.5">
                <Heart className="h-3.5 w-3.5 text-white/70" />
                Interests
              </h3>

              {isLoading ? (
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-7 w-20 rounded-full" />
                  ))}
                </div>
              ) : Array.isArray(profile?.interests) && profile.interests.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest, i) => (
                    <Badge key={i} variant={i % 2 === 0 ? 'light' : 'outline'}>
                      {interest}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-white/40">No interests listed yet.</p>
              )}
            </div>
          </Card>
        </div>
      </Container>
    </section>
  )
}
