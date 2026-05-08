/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useMemo, useRef, useCallback, memo } from 'react'
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

// OPTIMASI: Pisahkan MenuToggleButton sebagai memo component.
// Komponen ini tidak perlu re-render setiap kali Navbar scroll state berubah.
const MenuToggleButton = memo(function MenuToggleButton({ open, onClick, t }) {
  const plusHRef = useRef(null)
  const plusVRef = useRef(null)
  const iconRef  = useRef(null)

  useEffect(() => {
    const h = plusHRef.current
    const v = plusVRef.current
    const icon = iconRef.current
    if (!h || !v || !icon) return
    gsap.set(h,    { rotate: 0,  transformOrigin: '50% 50%' })
    gsap.set(v,    { rotate: 90, transformOrigin: '50% 50%' })
    gsap.set(icon, { rotate: 0,  transformOrigin: '50% 50%' })
  }, [])

  useEffect(() => {
    const h = plusHRef.current
    const v = plusVRef.current
    if (!h || !v) return
    if (open) {
      gsap.to(h, { rotate: 45,  duration: 0.5,  ease: 'power4.out' })
      gsap.to(v, { rotate: -45, duration: 0.5,  ease: 'power4.out' })
    } else {
      gsap.to(h, { rotate: 0,   duration: 0.35, ease: 'power3.inOut' })
      gsap.to(v, { rotate: 90,  duration: 0.35, ease: 'power3.inOut' })
    }
  }, [open])

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={open ? t('menu.close', 'Close menu') : t('menu.open', 'Open menu')}
      aria-expanded={open}
      className="relative inline-flex items-center gap-[0.4rem] bg-transparent border-0 cursor-pointer text-white font-medium leading-none px-1 py-2 text-[15px]"
    >
      <span className="leading-none whitespace-nowrap">
        {open ? t('menu.close', 'Close') : t('menu.open', 'Menu')}
      </span>
      <span
        ref={iconRef}
        className="relative w-[14px] h-[14px] shrink-0 inline-flex items-center justify-center"
        aria-hidden="true"
      >
        <span ref={plusHRef} className="absolute left-1/2 top-1/2 w-full h-[2px] bg-current rounded-[2px] -translate-x-1/2 -translate-y-1/2" />
        <span ref={plusVRef} className="absolute left-1/2 top-1/2 w-full h-[2px] bg-current rounded-[2px] -translate-x-1/2 -translate-y-1/2" />
      </span>
    </button>
  )
})

// OPTIMASI: glassSurfaceProps konstan — objek ini tidak perlu dibuat ulang
// setiap render. Dengan memindahkannya ke luar komponen, referensinya selalu sama.
const GLASS_PROPS = {
  width: '100%', height: 60, borderRadius: 16, borderWidth: 0.07,
  backgroundOpacity: 0, saturation: 1, brightness: 50, opacity: 0.93,
  blur: 8, displace: 0, distortionScale: -140, redOffset: 0,
  greenOffset: 6, blueOffset: 12, xChannel: 'R', yChannel: 'G',
  mixBlendMode: 'difference', className: 'w-full',
}

export function Navbar() {
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const { language, setLanguage } = useUIStore()
  const { t }                     = useTranslation()
  const location                  = useLocation()
  const isHome                    = location.pathname === '/'
  const isCompact                 = useMediaQuery('(max-width: 1023px)')
  const { data: profile }         = useProfile()

  const sectionIds = useMemo(() => NAV_ITEMS.map((n) => n.id), [])
  const activeId   = useScrollSpy(isHome && !isCompact ? sectionIds : [], 140)

  // OPTIMASI: rAF throttle scroll listener — identik dengan versi lama tetapi
  // sekarang cleanup lebih eksplisit untuk mencegah memory leak.
  useEffect(() => {
    let frame = 0
    const compute = () => { setScrolled(window.scrollY > 12); frame = 0 }
    const onScroll = () => { if (frame) return; frame = requestAnimationFrame(compute) }
    compute()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  // Tutup menu saat navigasi
  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  // Lock body scroll saat menu mobile terbuka
  useEffect(() => {
    if (!menuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [menuOpen])

  // OPTIMASI: useCallback untuk toggle agar tidak membuat fungsi baru tiap render
  const toggleMenu     = useCallback(() => setMenuOpen((v) => !v), [])
  const closeMenu      = useCallback(() => setMenuOpen(false), [])
  const toggleLanguage = useCallback(
    () => setLanguage(language === 'en' ? 'id' : 'en'),
    [language, setLanguage]
  )

  // OPTIMASI: staggeredItems hanya recompute jika isHome atau bahasa berubah
  const staggeredItems = useMemo(
    () => NAV_ITEMS.map((it) => ({
      label:     t(`nav.${it.id}`, it.label),
      ariaLabel: it.label,
      link:      isHome ? it.href : `/${it.href}`,
    })),
    [isHome, t]
  )

  const brandName = profile?.full_name ?? 'Portfolio'

  return (
    <>
      <header className="sticky top-0 z-40 px-4 sm:px-6 lg:px-10 pt-4 pb-3">
        <div className="max-w-7xl mx-auto">

          {/* ── DESKTOP ── */}
          {!isCompact && (
            <GlassSurface {...GLASS_PROPS}>
              <div className="w-full h-full flex items-center justify-between px-4 sm:px-6">
                {/* Brand */}
                <Link to="/" className="group">
                  <span className="font-display text-base sm:text-lg font-semibold tracking-tight text-white">
                    {brandName}
                  </span>
                </Link>

                {/* Nav items */}
                <nav className="flex items-center gap-1" aria-label="Main navigation">
                  {NAV_ITEMS.map((item) => {
                    const isActive = isHome && activeId === item.id
                    return (
                      <a
                        key={item.id}
                        href={isHome ? item.href : `/${item.href}`}
                        className={cn(
                          'relative px-3.5 py-2 text-sm font-medium transition-colors rounded-lg tracking-wide',
                          isActive ? 'text-white' : 'text-white/65 hover:text-white'
                        )}
                      >
                        {t(`nav.${item.id}`, item.label)}
                        {isActive && (
                          <span className="absolute inset-x-3 -bottom-0.5 h-px bg-white/70" aria-hidden />
                        )}
                      </a>
                    )
                  })}
                </nav>

                {/* Language toggle */}
                <button
                  type="button"
                  onClick={toggleLanguage}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80 hover:text-white border border-white/15 hover:border-white/35 transition"
                  aria-label="Toggle language"
                >
                  <Languages className="h-3.5 w-3.5" aria-hidden />
                  {language}
                </button>
              </div>
            </GlassSurface>
          )}

          {/* ── MOBILE ── */}
          {isCompact && (
            <div className="relative" style={{ height: 60 }}>
              {/* Glass background — hanya render saat sudah scroll */}
              <div
                className="absolute inset-0 rounded-2xl transition-opacity duration-300"
                style={{ opacity: scrolled ? 1 : 0, pointerEvents: 'none' }}
                aria-hidden
              >
                <GlassSurface {...GLASS_PROPS}><div /></GlassSurface>
              </div>

              {/* Content */}
              <div className="relative z-10 w-full h-full flex items-center justify-between px-4 sm:px-6">
                <Link to="/" className="group">
                  <span className="font-display text-base font-semibold tracking-tight text-white">
                    {brandName}
                  </span>
                </Link>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleLanguage}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80 hover:text-white border border-white/15 hover:border-white/35 transition"
                    aria-label="Toggle language"
                  >
                    <Languages className="h-3.5 w-3.5" aria-hidden />
                    {language}
                  </button>
                  <MenuToggleButton open={menuOpen} onClick={toggleMenu} t={t} />
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* OPTIMASI: Hanya render overlay jika mobile DAN menu terbuka.
          Sebelumnya: selalu ada di DOM meski menu tutup. */}
      {isCompact && menuOpen && (
        <MobileMenuOverlay items={staggeredItems} onClose={closeMenu} />
      )}
    </>
  )
}

// OPTIMASI: memo + stabil onClose ref mencegah StaggeredMenu re-mount
const MobileMenuOverlay = memo(function MobileMenuOverlay({ items, onClose }) {
  const [hasOpened, setHasOpened] = useState(false)

  useEffect(() => {
    // OPTIMASI: Kurangi timeout — 50ms sudah cukup untuk satu paint cycle
    const id = setTimeout(() => {
      const btn = document.querySelector('.sm-toggle')
      if (btn && !hasOpened) {
        btn.click()
        setHasOpened(true)
      }
    }, 50)
    return () => clearTimeout(id)
  }, [hasOpened])

  // OPTIMASI: useCallback di level parent sudah stabil, tapi kita bungkus
  // lagi agar StaggeredMenu tidak re-render karena inline arrow function
  const handleClose = useCallback(
    () => setTimeout(onClose, 400),
    [onClose]
  )

  return (
    <StaggeredMenu
      isFixed
      position="right"
      items={items}
      displaySocials={false}
      displayItemNumbering={true}
      colors={['#1a1a1a', '#0a0a0a']}
      accentColor="#ffffff"
      menuButtonColor="#ffffff"
      openMenuButtonColor="#ffffff"
      changeMenuColorOnOpen={false}
      logoUrl="/favicon.svg"
      onMenuClose={handleClose}
    />
  )
})
