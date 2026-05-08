import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import { Github, Linkedin, Twitter, Instagram } from '@/components/ui/BrandIcons'
import { useProfile } from '@/features/profile/useProfile'
import { useTranslation } from '@/features/i18n/useTranslation'

const ICONS = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  instagram: Instagram,
  email: Mail,
}

export function Footer() {
  const { data: profile } = useProfile()
  const { t } = useTranslation()
  const socials = profile?.socials ?? {}
  const year = new Date().getFullYear()

  return (
    <footer className="relative border-t border-white/[0.06] mt-14">
      <div className="container-xl py-10 sm:py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <Link to="/" className="font-display text-base sm:text-lg font-semibold tracking-tight text-white">
              portfolio
            </Link>
            <p className="mt-2.5 text-sm text-white/50 max-w-md leading-relaxed">
              {profile?.headline || t('footer.headline_default', 'Personal portfolio · Research, projects, and a little bit of me.')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {Object.entries(socials).map(([key, value]) => {
              const Icon = ICONS[key]
              if (!Icon || !value) return null
              const href = key === 'email' ? `mailto:${value}` : value
              return (
                <a
                  key={key}
                  href={href}
                  target={key === 'email' ? undefined : '_blank'}
                  rel="noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white/55 hover:text-white hover:border-white/25 hover:bg-white/[0.04] transition"
                  aria-label={key}
                >
                  <Icon className="h-4 w-4" />
                </a>
              )
            })}
          </div>
        </div>

        <div className="mt-8 line-accent" />

        <div className="mt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px] text-white/40 uppercase tracking-[0.14em]">
          <p>© {year} {profile?.full_name || 'Portfolio'}. {t('footer.all_rights', 'All rights reserved.')}</p>
        </div>
      </div>
    </footer>
  )
}
