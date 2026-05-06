import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useProfile } from '@/hooks/useProfile'
import { useResearchList } from '@/hooks/useResearch'
import { usePublications } from '@/hooks/usePublications'
import { StatCard } from '@/components/common/StatCard'

const fadeUp = { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 } }

/**
 * Home page — hero section + stats
 */
export default function HomePage() {
  const { data: profile } = useProfile()
  const { data: research } = useResearchList()
  const { data: publications } = usePublications()

  const totalCitations = publications?.reduce((sum, p) => sum + (p.citation_count ?? 0), 0) ?? 0

  return (
    <div className="flex flex-col">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center bg-mesh overflow-hidden pt-16">
        {/* Background grid */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />

        {/* Decorative blobs */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl" />

        <div className="container-section relative z-10 py-20">
          <div className="max-w-3xl">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-sm font-medium mb-8"
              {...fadeUp} transition={{ duration: 0.5 }}
            >
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Available for collaborations &amp; consulting
            </motion.div>

            <motion.h1
              className="text-5xl lg:text-7xl font-bold text-slate-900 leading-[1.1] mb-6"
              {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }}
            >
              {profile?.name ?? 'Dr. Sarah Chen'}
            </motion.h1>

            <motion.div
              className="mb-6"
              {...fadeUp} transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="gradient-text text-2xl lg:text-3xl font-semibold">
                {profile?.title ?? 'Epidemiologist & Public Health Researcher'}
              </span>
            </motion.div>

            <motion.p
              className="text-slate-500 text-lg lg:text-xl leading-relaxed mb-10 max-w-2xl"
              {...fadeUp} transition={{ duration: 0.6, delay: 0.3 }}
            >
              {profile?.subtitle ?? 'MPH · PhD Candidate · Infectious Disease Surveillance'}
            </motion.p>

            <motion.p
              className="text-slate-600 text-base leading-relaxed mb-10 max-w-xl"
              {...fadeUp} transition={{ duration: 0.6, delay: 0.35 }}
            >
              Turning complex epidemiological data into actionable public health insights.
              Specializing in outbreak investigation, disease modeling, and evidence-based policy.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4"
              {...fadeUp} transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link to="/research" className="btn-primary text-base">
                View Research →
              </Link>
              <Link to="/contact" className="btn-secondary text-base">
                Get in Touch
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400"
          animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </section>

      {/* ── Stats ─────────────────────────────────────────── */}
      <section className="section-padding bg-white border-y border-slate-100">
        <div className="container-section">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard value={`${profile?.years_experience ?? 8}+`} label="Years of Experience" icon="🔬" color="blue" delay={0} />
            <StatCard value={research?.length ?? 0} label="Research Projects" icon="📊" color="green" delay={0.1} />
            <StatCard value={publications?.length ?? 0} label="Publications" icon="📄" color="amber" delay={0.2} />
            <StatCard value={`${totalCitations}+`} label="Total Citations" icon="🏆" color="blue" delay={0.3} />
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────── */}
      <section className="section-padding bg-gradient-to-br from-primary-700 to-primary-900">
        <div className="container-section text-center">
          <motion.h2
            className="text-3xl lg:text-4xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Interested in data-driven public health research?
          </motion.h2>
          <motion.p
            className="text-primary-200 text-lg mb-8"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ delay: 0.2 }}
          >
            Let's collaborate on advancing epidemiological science.
          </motion.p>
          <Link to="/contact" className="bg-white text-primary-700 px-8 py-4 rounded-xl font-semibold hover:bg-primary-50 transition-colors inline-block">
            Start a Conversation
          </Link>
        </div>
      </section>
    </div>
  )
}
