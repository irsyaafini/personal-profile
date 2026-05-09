import { useQuery } from '@tanstack/react-query'
import { Code2 } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { Reveal, RevealGroup } from '@/components/common/Reveal'
import { skillsService } from '@/services/skills.service'
import { QUERY_KEYS } from '@/constants'
import { useTranslation } from '@/features/i18n/useTranslation'

function SkillBar({ name, level = 0 }) {
  const pct = Math.max(0, Math.min(5, level)) * 20
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-white/85">{name}</span>
        <span className="text-[10px] text-white/40 font-mono tracking-wider">{pct}%</span>
      </div>
      <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-white/90 to-white/45 transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export function SkillsSection() {
  const { t } = useTranslation()
  const { data: skills, isLoading } = useQuery({
    queryKey: QUERY_KEYS.SKILLS,
    queryFn: () => skillsService.list(),
  })

  const grouped = (skills ?? []).reduce((acc, skill) => {
    const cat = skill.category || 'Other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(skill)
    return acc
  }, {})

  const categories = Object.keys(grouped)

  return (
    <section id="skills" className="section-gap">
      <Container>
        <Reveal direction="up">
          <SectionHeader
            eyebrow={t('skills.eyebrow', 'Tech Stack')}
            title={t('sections.skills', 'Skills')}
            description={t('skills.description', 'Tools and technologies I work with — calibrated by hands-on familiarity.')}
          />
        </Reveal>

        {isLoading ? (
          <div className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <div className="p-5 space-y-4">
                  <Skeleton className="h-5 w-1/3" />
                  {Array.from({ length: 4 }).map((_, j) => (
                    <Skeleton key={j} className="h-6" />
                  ))}
                </div>
              </Card>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="mt-8 sm:mt-10">
            <Reveal direction="up">
              <Card>
                <div className="p-7 text-center text-white/40 text-sm">
                  {t('skills.no_skills', 'No skills added yet.')}
                </div>
              </Card>
            </Reveal>
          </div>
        ) : (
          <RevealGroup
            stagger={100}
            baseDelay={120}
            direction="up"
            className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {categories.map((cat) => (
              <Card key={cat}>
                <div className="p-7">
                  <h3 className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60 mb-5">
                    <Code2 className="h-3.5 w-3.5" />
                    {cat}
                  </h3>
                  <div className="space-y-5">
                    {grouped[cat].map((s) => (
                      <SkillBar key={s.id} name={s.name} level={s.level} />
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </RevealGroup>
        )}
      </Container>
    </section>
  )
}
