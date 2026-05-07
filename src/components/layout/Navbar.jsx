import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Languages } from 'lucide-react'
import GlassSurface from '@/components/reactbits/GlassSurface'
import { NAV_ITEMS } from '@/constants'
import { useUIStore } from '@/app/store/ui.store'
import { useTranslation } from '@/features/i18n/useTranslation'
import { useScrollSpy } from '@/hooks/useScrollSpy'
import { cn } from '@/utils'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const { mobileMenuOpen, toggleMobileMenu, closeMobileMenu, language, setLanguage } = useUIStore()
  const { t } = useTranslation()
  const location = useLocation()
  const isHome = location.pathname === '/'

  const sectionIds = NAV_ITEMS.map((n) => n.id)
  const activeId = useScrollSpy(isHome ? sectionIds : [], 140)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    closeMobileMenu()
  }, [location.pathname, closeMobileMenu])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300 px-4 sm:px-6 lg:px-10',
        scrolled ? 'pt-3 pb-2' : 'pt-5 pb-3'
      )}
    >
      <div className="max-w-7xl mx-auto">
        {/*
          GlassSurface — crystal-clear glass like React Bits' reference demo.
          - mixBlendMode "difference" + chromatic offsets (R/G/B) create the
            light-refraction & rainbow-edge effect of real glass.
          - displace + large negative distortionScale produce the lens-like
            warping you see when content scrolls underneath.
          - Low backgroundOpacity keeps it transparent so you actually see
            the page through it.
          The effect is most visible when content scrolls past behind the bar.
        */}
        <GlassSurface
          width="100%"
          height={scrolled ? 60 : 70}
          borderRadius={scrolled ? 16 : 20}
          borderWidth={0.07}
          backgroundOpacity={0}
          saturation={1}
          brightness={50}
          opacity={0.93}
          blur={11}
          displace={2}
          distortionScale={-180}
          redOffset={0}
          greenOffset={10}
          blueOffset={20}
          xChannel="R"
          yChannel="G"
          mixBlendMode="difference"
          className="w-full"
        >
          <div className="w-full h-full flex items-center justify-between px-4 sm:px-6">
            {/* Brand */}
            <Link
              to="/"
              className="flex items-center gap-2.5 group"
              onClick={closeMobileMenu}
            >
              <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black border border-white/40 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
                <span className="font-display text-sm font-bold">P</span>
              </span>
              <span className="font-display text-base sm:text-lg font-semibold tracking-tight text-white">
                portfolio
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive = isHome && activeId === item.id
                return (
                  <a
                    key={item.id}
                    href={isHome ? item.href : `/${item.href}`}
                    className={cn(
                      'relative px-3.5 py-2 text-sm font-medium transition-colors rounded-lg tracking-wide',
                      isActive
                        ? 'text-white'
                        : 'text-white/65 hover:text-white'
                    )}
                  >
                    {t(`nav.${item.id}`, item.label)}
                    {isActive && (
                      <span className="absolute inset-x-3 -bottom-0.5 h-px bg-white/70" />
                    )}
                  </a>
                )
              })}
            </nav>

            {/* Right cluster */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setLanguage(language === 'en' ? 'id' : 'en')}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80 hover:text-white border border-white/15 hover:border-white/35 transition"
                aria-label="Toggle language"
              >
                <Languages className="h-3.5 w-3.5" />
                {language}
              </button>

              <button
                type="button"
                onClick={toggleMobileMenu}
                className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-white/90 hover:text-white hover:border-white/30 transition"
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </GlassSurface>

        {/* Mobile menu — separate panel below the navbar */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 rounded-2xl overflow-hidden border border-white/10 bg-[rgba(10,10,10,0.92)] backdrop-blur-xl">
            <nav className="py-3 px-3 flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.id}
                  href={isHome ? item.href : `/${item.href}`}
                  onClick={closeMobileMenu}
                  className="px-3 py-3 text-sm font-medium text-white/75 hover:text-white hover:bg-white/[0.06] rounded-lg transition"
                >
                  {t(`nav.${item.id}`, item.label)}
                </a>
              ))}
              <button
                type="button"
                onClick={() => setLanguage(language === 'en' ? 'id' : 'en')}
                className="mt-2 inline-flex items-center justify-center gap-2 px-3 py-3 rounded-lg text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80 border border-white/15"
              >
                <Languages className="h-4 w-4" />
                Language: {language.toUpperCase()}
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
