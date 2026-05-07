import { useEffect, useState, useMemo, useRef } from 'react'
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
import { cn } from '@/utils'

/**
 * "Menu +" toggle button styled identically to React Bits' StaggeredMenu toggle.
 * The plus icon rotates 45° to form an "x" when open, and the text crossfades
 * between "Menu" and "Close". This matches the look in the StaggeredMenu
 * overlay so the transition is seamless.
 */
function MenuToggleButton({ open, onClick }) {
  const plusHRef = useRef(null)
  const plusVRef = useRef(null)
  const iconRef = useRef(null)

  // Initial rotation setup (plus = horizontal + vertical bars at 90deg)
  useEffect(() => {
    const h = plusHRef.current
    const v = plusVRef.current
    const icon = iconRef.current
    if (!h || !v || !icon) return
    gsap.set(h, { rotate: 0, transformOrigin: '50% 50%' })
    gsap.set(v, { rotate: 90, transformOrigin: '50% 50%' })
    gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' })
  }, [])

  // Animate plus → x on open, back to plus on close
  useEffect(() => {
    const h = plusHRef.current
    const v = plusVRef.current
    if (!h || !v) return
    if (open) {
      gsap.to(h, { rotate: 45, duration: 0.5, ease: 'power4.out' })
      gsap.to(v, { rotate: -45, duration: 0.5, ease: 'power4.out' })
    } else {
      gsap.to(h, { rotate: 0, duration: 0.35, ease: 'power3.inOut' })
      gsap.to(v, { rotate: 90, duration: 0.35, ease: 'power3.inOut' })
    }
  }, [open])

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={open ? 'Close menu' : 'Open menu'}
      aria-expanded={open}
      className="relative inline-flex items-center gap-[0.4rem] bg-transparent border-0 cursor-pointer text-white font-medium leading-none px-1 py-2 text-[15px]"
    >
      <span className="leading-none whitespace-nowrap">{open ? 'Close' : 'Menu'}</span>
      <span
        ref={iconRef}
        className="relative w-[14px] h-[14px] shrink-0 inline-flex items-center justify-center"
        aria-hidden="true"
      >
        <span
          ref={plusHRef}
          className="absolute left-1/2 top-1/2 w-full h-[2px] bg-current rounded-[2px] -translate-x-1/2 -translate-y-1/2"
        />
        <span
          ref={plusVRef}
          className="absolute left-1/2 top-1/2 w-full h-[2px] bg-current rounded-[2px] -translate-x-1/2 -translate-y-1/2"
        />
      </span>
    </button>
  )
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { language, setLanguage } = useUIStore()
  const { t } = useTranslation()
  const location = useLocation()
  const isHome = location.pathname === '/'

  const isCompact = useMediaQuery('(max-width: 1023px)')

  const sectionIds = NAV_ITEMS.map((n) => n.id)
  const activeId = useScrollSpy(isHome && !isCompact ? sectionIds : [], 140)

  useEffect(() => {
    let frame = 0
    const compute = () => {
      setScrolled(window.scrollY > 12)
      frame = 0
    }
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(compute)
    }
    compute()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    if (!menuOpen) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [menuOpen])

  const staggeredItems = useMemo(
    () =>
      NAV_ITEMS.map((it) => ({
        label: t(`nav.${it.id}`, it.label),
        ariaLabel: it.label,
        link: isHome ? it.href : `/${it.href}`,
      })),
    [isHome, t]
  )

  const glassProps = {
    width: '100%',
    height: scrolled ? 60 : 70,
    borderRadius: scrolled ? 16 : 20,
    borderWidth: 0.07,
    backgroundOpacity: 0,
    saturation: 1,
    brightness: 50,
    opacity: 0.93,
    blur: 8,
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

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 transition-all duration-300 px-4 sm:px-6 lg:px-10',
          scrolled ? 'pt-3 pb-2' : 'pt-5 pb-3'
        )}
      >
        <div className="max-w-7xl mx-auto">
          <GlassSurface {...glassProps}>
            <div className="w-full h-full flex items-center justify-between px-4 sm:px-6">
              {/* Brand */}
              <Link to="/" className="flex items-center gap-2.5 group">
                <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black border border-white/40 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
                  <span className="font-display text-sm font-bold">P</span>
                </span>
                <span className="font-display text-base sm:text-lg font-semibold tracking-tight text-white">
                  portfolio
                </span>
              </Link>

              {/* Desktop only — inline menu items */}
              {!isCompact && (
                <nav className="flex items-center gap-1">
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
                        {isActive && <span className="absolute inset-x-3 -bottom-0.5 h-px bg-white/70" />}
                      </a>
                    )
                  })}
                </nav>
              )}

              {/* Right cluster */}
              <div className="flex items-center gap-3">
                {!isCompact && (
                  <button
                    type="button"
                    onClick={() => setLanguage(language === 'en' ? 'id' : 'en')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80 hover:text-white border border-white/15 hover:border-white/35 transition"
                    aria-label="Toggle language"
                  >
                    <Languages className="h-3.5 w-3.5" />
                    {language}
                  </button>
                )}

                {/* Mobile — React Bits style "Menu +" button (no border) */}
                {isCompact && (
                  <MenuToggleButton
                    open={menuOpen}
                    onClick={() => setMenuOpen((v) => !v)}
                  />
                )}
              </div>
            </div>
          </GlassSurface>
        </div>
      </header>

      {/* StaggeredMenu — only mounted while mobile menu is open.
          When closed, NO overlay exists in the DOM at all → all touch
          events pass through to the page content normally (dome gallery,
          buttons, scrolling all work). */}
      {isCompact && menuOpen && (
        <MobileMenuOverlay
          items={staggeredItems}
          onClose={() => setMenuOpen(false)}
        />
      )}
    </>
  )
}

/**
 * Renders StaggeredMenu and auto-opens it on mount. On close, waits for the
 * close animation, then signals the parent to unmount this overlay so the
 * fixed wrapper is removed from the DOM (returns full interactivity to page).
 */
function MobileMenuOverlay({ items, onClose }) {
  const [hasOpened, setHasOpened] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => {
      const btn = document.querySelector('.sm-toggle')
      if (btn && !hasOpened) {
        btn.click()
        setHasOpened(true)
      }
    }, 50)
    return () => clearTimeout(t)
  }, [hasOpened])

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
      onMenuClose={() => {
        // Wait for close animation (~0.4s) before unmounting
        setTimeout(onClose, 400)
      }}
    />
  )
}