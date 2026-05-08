import { useQuery } from '@tanstack/react-query'
import { Briefcase, GraduationCap, Award, BadgeCheck } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { Badge } from '@/components/ui/Badge'
import { Reveal } from '@/components/common/Reveal'
import { experiencesService } from '@/services/experiences.service'
import { QUERY_KEYS } from '@/constants'
import { useTranslation } from '@/features/i18n/useTranslation'
import { formatDateRange } from '@/utils'

function getTypeMeta(type, t) {
  const map = {
    work: { icon: Briefcase, label: t('experience.type_work', 'Work') },
    education: { icon: GraduationCap, label: t('experience.type_education', 'Education') },
    certification: { icon: BadgeCheck, label: t('experience.type_certification', 'Certification') },
    award: { icon: Award, label: t('experience.type_award', 'Award') },
  }
  return map[type] ?? map.work
}

function TimelineItem({ item, last, t }) {
  const meta = getTypeMeta(item.type, t)
  const Icon = meta.icon

  return (
    <div className="relative pl-12 sm:pl-16">
      {/* dot */}
      <span className="absolute left-3 sm:left-5 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--c-card)] border border-white/15 ring-4 ring-[var(--c-bg)]">
        <Icon className="h-3.5 w-3.5 text-white/80" />
      </span>
      {/* line */}
      {!last && (
        <span className="absolute left-[26px] sm:left-[34px] top-9 bottom-[-2.5rem] w-px bg-gradient-to-b from-white/15 to-transparent" />
      )}

      <Card>
        <div className="p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-white tracking-tight">
                {item.role}
              </h3>
              <p className="text-sm text-white/55 mt-1">
                {item.organization}
                {item.location && <span className="text-white/30"> · {item.location}</span>}
              </p>
            </div>
            <Badge variant="light">{meta.label}</Badge>
          </div>

          <p className="text-[10px] font-mono tracking-wider uppercase text-white/40 mt-1.5">
            {formatDateRange(item.start_date, item.end_date)}
          </p>

          {item.description && (
            <p className="mt-4 text-sm text-white/55 leading-relaxed">{item.description}</p>
          )}

          {Array.isArray(item.highlights) && item.highlights.length > 0 && (
            <ul className="mt-4 space-y-2">
              {item.highlights.map((h, i) => (
                <li key={i} className="text-sm text-white/55 flex gap-3">
                  <span className="mt-2 inline-block h-1 w-1 rounded-full bg-white/40 shrink-0" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Card>
    </div>
  )
}

export function ExperienceSection() {
  const { t } = useTranslation()
  const { data: items, isLoading } = useQuery({
    queryKey: QUERY_KEYS.EXPERIENCES,
    queryFn: () => experiencesService.list(),
  })

  return (
    <section id="experience" className="section-gap">
      <Container size="lg">
        <Reveal direction="up">
          <SectionHeader
            eyebrow={t('experience.eyebrow', 'Timeline')}
            title={t('sections.experience', 'Experience & Education')}
            description={t('experience.description', "A chronological view of where I've worked, studied, and what I've earned along the way.")}
          />
        </Reveal>

        <div className="mt-8 sm:mt-10 space-y-6">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="relative pl-12 sm:pl-16">
                <Skeleton className="h-32" />
              </div>
            ))
          ) : !items || items.length === 0 ? (
            <Reveal direction="up">
              <Card>
                <div className="p-8 text-center text-white/40 text-sm">
                  {t('experience.no_experience', 'No experiences added yet.')}
                </div>
              </Card>
            </Reveal>
          ) : (
            // Timeline items: tiap item slide dari kiri dengan stagger.
            // Pakai delay manual berdasarkan index, BUKAN RevealGroup,
            // karena tiap item sudah punya wrapper relative-positioned
            // untuk dot/line — kita tidak mau menambah div pembungkus.
            items.map((it, i) => (
              <Reveal
                key={it.id}
                direction="left"
                delay={i * 100}
                threshold={0.1}
              >
                <TimelineItem item={it} last={i === items.length - 1} t={t} />
              </Reveal>
            ))
          )}
        </div>
      </Container>
    </section>
  )
}
