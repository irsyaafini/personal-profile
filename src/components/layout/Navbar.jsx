/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useRef, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Languages } from 'lucide-react'
import { gsap } from 'gsap'
import GlassSurface from '@/components/reactbits/GlassSurface'
import StaggeredMenu from '@/components/reactbits/StaggeredMenu'
import { NAV_ITEMS } from '@/constants'
import { useUIStore } from '@/app/store/ui.store'
import { useTranslation } from '@/features/i18n/useTranslation'
import { useScrollSpy } from '@/hooks/useScrollSpy'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useProfile } from '@/features/profile/useProfile'
import { cn } from '@/utils'

/**
 * REVISI v5 — Posisi navbar mobile yang benar-benar stabil
 *
 * Akar masalah dari versi sebelumnya:
 *   StaggeredMenu di-render di dalam pembungkus <div class="fixed ...">.
 *   Class internal .staggered-menu-wrapper di-set "position: relative;
 *   height: 100%" karena prop isFixed default false. Padahal header bar
 *   pakai "position: absolute" yang resolved-nya ke wrapper itu →
 *   wrapper relative dengan height variable bikin header tidak punya
 *   positioning context yang stabil → posisi navbar terasa berpindah.
 *
 * Solusi:
 *   Pass isFixed={true} ke StaggeredMenu. Class .fixed-wrapper akan
 *   override jadi "position: fixed; top: 0; width: 100vw; height: 100vh".
 *   Sekarang header bar (position: absolute) punya positioning ancestor
 *   yang stabil, fixed ke viewport — posisi tidak bisa berubah lagi.
 *   Dan kita HAPUS pembungkus <div class="fixed h-screen"> di sini
 *   karena sudah duplikat dengan fixed-wrapper internal StaggeredMenu.
 */

// Konstanta GlassSurface desktop — KONSISTEN, tidak berubah saat scroll
const GLASS_PROPS_DESKTOP = {
  width: '100%',
  height: 60,
  borderRadius: 9999,
  borderWidth: 0.07,
  backgroundOpacity: 0,
  saturation: 1,
  brightness: 54,        // nilai tengah dari 50/58 sebelumnya — fixed
  opacity: 0.93,
  blur: 11,              // nilai tengah dari 8/14 sebelumnya — fixed
  displace: 0,
  distortionScale: -140,
  redOffset: 0,
  greenOffset: 6,
  blueOffset: 12,
  xChannel: 'R',
  yChannel: 'G',
  mixBlendMode: 'difference',
  className: 'w-full',
}

export function Navbar() {
  const navRef                    = useRef(null)
  const { language, setLanguage } = useUIStore()
  const { t }                     = useTranslation()
  const location                  = useLocation()
  const isHome                    = location.pathname === '/'
  const isMobile                  = useMediaQuery('(max-width: 1023px)')
  const { data: profile }         = useProfile()

  const sectionIds = useMemo(() => NAV_ITEMS.map((n) => n.id), [])

  // Scroll spy untuk highlight section aktif (di nav desktop & menu mobile)
  const activeId = useScrollSpy(isHome ? sectionIds : [], 0.25)

  // Fade-in animation desktop navbar (gsap) — sekali saja saat mount
  useEffect(() => {
    if (isMobile || !navRef.current) return

    const shell = navRef.current.querySelector('[data-nav-shell]')
    const items = navRef.current.querySelectorAll('[data-nav-item]')

    if (shell) {
      gsap.fromTo(shell,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 1.2, delay: 0.2, ease: 'power3.out' }
      )
    }
    if (items.length) {
      gsap.fromTo(items,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 1.1, stagger: 0.07, delay: 0.3, ease: 'power3.out' }
      )
    }
  }, [isMobile])

  const toggleLanguage = useCallback(
    () => setLanguage(language === 'en' ? 'id' : 'en'),
    [language, setLanguage]
  )

  // Nav items untuk StaggeredMenu mobile (dengan field `active` untuk highlight)
  const menuItems = useMemo(
    () => NAV_ITEMS.map((it) => ({
      label:     t(`nav.${it.id}`, it.label),
      ariaLabel: it.label,
      link:      isHome ? it.href : `/${it.href}`,
      active:    isHome && activeId === it.id,
    })),
    [isHome, t, activeId]
  )

  const brandName = profile?.full_name ?? 'Portfolio'

  // ──────────────────────────────────────────────────────────────
  //  MOBILE / TABLET — StaggeredMenu (isFixed=true untuk posisi stabil)
  // ──────────────────────────────────────────────────────────────
  if (isMobile) {
    const logoNode = (
      <Link to="/" className="sm-logo">
        {brandName}
        <span className="sm-logo-accent">—</span>
      </Link>
    )

    // CATATAN PENTING: TIDAK ada pembungkus <div class="fixed ..."> di sini.
    // StaggeredMenu sendiri yang handle position fixed via isFixed={true}.
    // Pembungkus tambahan hanya akan bikin nested fixed → konflik posisi.
    return (
      <StaggeredMenu
        isFixed={true}
        position="right"
        items={menuItems}
        socialItems={[]}
        displaySocials={false}
        displayItemNumbering={true}
        colors={['#1a1a1a', '#0d0d0d']}
        accentColor="#ffffff"
        menuButtonColor="#f5f5f5"
        openMenuButtonColor="#f5f5f5"
        changeMenuColorOnOpen={false}
        closeOnClickAway={true}
        logoNode={logoNode}
        /* scrolled selalu false → GlassSurface tetap konsisten karena
           di StaggeredMenu yang sudah dipatch glass selalu tampil. */
        scrolled={false}
        language={language.toUpperCase()}
        onToggleLanguage={toggleLanguage}
      />
    )
  }

  // ──────────────────────────────────────────────────────────────
  //  DESKTOP — floating pill navbar
  // ──────────────────────────────────────────────────────────────
  return (
    <div
      ref={navRef}
      className="fixed top-6 inset-x-4 sm:inset-x-8 lg:inset-x-12 z-50 pointer-events-none"
    >
      <div
        data-nav-shell
        className="opacity-0 pointer-events-auto mx-auto max-w-7xl"
      >
        {/* GlassSurface KONSTAN — tidak ada toggle berdasarkan scrolled */}
        <GlassSurface {...GLASS_PROPS_DESKTOP}>
          <div className="flex items-center justify-between w-full px-6 sm:px-8 py-3.5">

            {/* Logo */}
            <Link
              to="/"
              data-nav-item
              className="opacity-0 font-display text-base sm:text-lg font-semibold tracking-tight text-white hover:text-white/80 transition-colors duration-300"
            >
              {brandName}
              <span className="text-white/40 ml-0.5">—</span>
            </Link>

            {/* Nav links */}
            <nav className="flex items-center gap-1" aria-label="Main navigation">
              {NAV_ITEMS.map((item) => {
                const isActive = isHome && activeId === item.id
                return (
                  <div key={item.id} data-nav-item className="opacity-0">
                    <a
                      href={isHome ? item.href : `/${item.href}`}
                      aria-current={isActive ? 'page' : undefined}
                      className={cn(
                        'relative px-3.5 py-2 text-sm font-medium transition-colors rounded-lg tracking-wide',
                        isActive ? 'text-white' : 'text-white/60 hover:text-white'
                      )}
                    >
                      {t(`nav.${item.id}`, item.label)}
                      {isActive && (
                        <span className="absolute inset-x-3 -bottom-0.5 h-px bg-white/70" aria-hidden />
                      )}
                    </a>
                  </div>
                )
              })}
            </nav>

            {/* Language toggle */}
            <div data-nav-item className="opacity-0">
              <button
                type="button"
                onClick={toggleLanguage}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/15 text-white/70 font-mono text-[10px] uppercase tracking-[0.18em] hover:border-white/35 hover:text-white transition-colors duration-300"
                aria-label="Toggle language"
              >
                <Languages className="h-3.5 w-3.5" aria-hidden />
                {language}
              </button>
            </div>

          </div>
        </GlassSurface>
      </div>
    </div>
  )
}