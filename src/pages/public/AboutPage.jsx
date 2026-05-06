import { motion } from 'framer-motion'
import { useProfile } from '@/hooks/useProfile'
import { SectionHeader } from '@/components/common/SectionHeader'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { EXPERTISE_AREAS } from '@/constants'
import { getInitials } from '@/utils'

const TOOLS = [
  { name: 'R / RStudio', level: 95 },
  { name: 'STATA', level: 85 },
  { name: 'Python (pandas, scipy)', level: 80 },
  { name: 'ArcGIS / QGIS', level: 75 },
  { name: 'REDCap', level: 90 },
  { name: 'SPSS', level: 70 },
]

/** Animated skill bar */
function SkillBar({ name, level, delay = 0 }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-slate-700 font-medium">{name}</span>
        <span className="text-slate-400">{level}%</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary-500 to-emerald-500 rounded-full"
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

/**
 * About page — profile, expertise, skills
 */
export default function AboutPage() {
  const { data: profile, isLoading } = useProfile()

  return (
    <div className="pt-16">
      {/* Header */}
      <section className="section-padding bg-white border-b border-slate-100">
        <div className="container-section">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Avatar */}
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {isLoading ? (
                <Skeleton className="w-64 h-64 rounded-3xl" />
              ) : profile?.photo_url ? (
                <img
                  src={profile.photo_url}
                  alt={profile.name}
                  className="w-64 h-64 rounded-3xl object-cover shadow-xl ring-4 ring-primary-100"
                />
              ) : (
                <div className="w-64 h-64 rounded-3xl bg-gradient-to-br from-primary-100 to-emerald-100 flex items-center justify-center shadow-xl ring-4 ring-primary-100">
                  <span className="text-7xl font-bold gradient-text font-display">
                    {getInitials(profile?.name ?? 'SC')}
                  </span>
                </div>
              )}
            </motion.div>

            {/* Bio */}
            <motion.div
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="badge bg-primary-50 text-primary-600 border border-primary-100 mb-4">
                About Me
              </span>
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ) : (
                <>
                  <h1 className="text-4xl font-bold text-slate-900 mb-2">{profile?.name}</h1>
                  <p className="text-primary-600 font-medium text-lg mb-6">{profile?.title}</p>
                  <p className="text-slate-600 leading-relaxed mb-6">{profile?.bio}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                    {profile?.location && (
                      <span className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        {profile.location}
                      </span>
                    )}
                    {profile?.email && (
                      <a href={`mailto:${profile.email}`} className="flex items-center gap-1.5 hover:text-primary-600">
                        <svg className="w-4 h-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {profile.email}
                      </a>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Expertise */}
      <section className="section-padding bg-slate-50">
        <div className="container-section">
          <SectionHeader label="Expertise" title="Areas of Specialization" subtitle="Combining rigorous methodology with field experience in global public health." />
          <div className="grid md:grid-cols-3 gap-8">
            {EXPERTISE_AREAS.map((area, i) => (
              <motion.div key={area.id}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full">
                  <div className="text-4xl mb-4">{area.icon}</div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">{area.title}</h3>
                  <p className="text-slate-500 text-sm mb-5 leading-relaxed">{area.description}</p>
                  <ul className="space-y-1.5">
                    {area.skills.map(skill => (
                      <li key={skill} className="flex items-center gap-2 text-sm text-slate-600">
                        <span className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                        {skill}
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools */}
      <section className="section-padding bg-white">
        <div className="container-section max-w-2xl mx-auto">
          <SectionHeader label="Tools & Software" title="Technical Proficiency" />
          <div className="space-y-5">
            {TOOLS.map((tool, i) => (
              <SkillBar key={tool.name} name={tool.name} level={tool.level} delay={i * 0.08} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
