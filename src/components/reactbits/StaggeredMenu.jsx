/* eslint-disable react-hooks/exhaustive-deps */
/**
 * StaggeredMenu — React Bits component (custom-styled untuk brand Irsya Paputungan)
 *
 * REVISI: Mengadopsi design & efek dari website Evan:
 *  1. CSS di-inline di dalam file ini (inject ke <head>).
 *  2. Prop logoNode untuk render logo custom (mis. text brand name).
 *  3. Prop scrolled — saat true, header bar menampilkan GlassSurface
 *     floating pill (liquid glass effect) seperti Evan.
 *  4. Panel slide-in dengan stagger animation GSAP — identik dengan Evan.
 *  5. Social links render icon (react-icons).
 *  6. Tema: MONOCHROME — hitam-putih sesuai identity Irsya (bukan gold Evan).
 *  7. Header bar: logo di kiri, tombol language toggle + hamburger di kanan.
 */
import React, { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa'
import { SiGmail } from 'react-icons/si'
import { Languages } from 'lucide-react'
import GlassSurface from '@/components/reactbits/GlassSurface'

// ── Icon mapping: string name → component ──
const ICON_MAP = {
  github: FaGithub,
  linkedin: FaLinkedin,
  instagram: FaInstagram,
  gmail: SiGmail,
}

// ── Inline CSS injection (sekali saja ke <head>) ──
const STYLE_ID = 'staggered-menu-styles-irsya'
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const styleEl = document.createElement('style')
  styleEl.id = STYLE_ID
  styleEl.textContent = `
    .staggered-menu-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      z-index: 40;
      pointer-events: none;
    }

    .staggered-menu-wrapper.fixed-wrapper {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      /* REVISI: 100vh di mobile berubah-ubah saat address bar Safari/Chrome
         muncul-hilang → bikin posisi navbar terasa "ngambang/mepet" saat
         scroll. Pakai 100dvh (dynamic viewport height) agar adjust otomatis.
         Fallback 100vh untuk browser yang belum support dvh. */
      height: 100vh;
      height: 100dvh;
      z-index: 40;
      overflow: hidden;
    }

    /*
      HEADER BAR — floating pill navbar.
      REVISI v6: position FIXED (bukan absolute lagi) → header pin langsung
      ke viewport, tidak peduli wrapper height. Ini eliminasi semua glitch
      posisi vertikal saat mobile address bar muncul-hilang.
      GlassSurface selalu tampil agar posisi & visual KONSISTEN.
    */
    .staggered-menu-header-outer {
      position: fixed;
      top: 0.75rem;
      left: 0.75rem;
      right: 0.75rem;
      z-index: 41;
      pointer-events: none;
      display: flex;
      justify-content: center;
    }

    @media (min-width: 640px) {
      .staggered-menu-header-outer {
        top: 1rem;
        left: 1rem;
        right: 1rem;
      }
    }

    .staggered-menu-header-inner {
      width: 100%;
      max-width: 1400px;
      pointer-events: auto;
      border-radius: 9999px;
    }

    /* GlassSurface wrapper — SELALU tampil agar navbar konsisten saat scroll */
    .staggered-menu-glass-wrapper {
      position: absolute;
      inset: 0;
      border-radius: 9999px;
      opacity: 1;
      pointer-events: none;
      overflow: hidden;
    }

    /* Sembunyikan glass HANYA saat menu terbuka (panel sudah punya bg sendiri) */
    .staggered-menu-wrapper[data-open] .staggered-menu-glass-wrapper {
      opacity: 0;
      transition: opacity 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    .staggered-menu-glass-wrapper > * {
      width: 100%;
      height: 100%;
    }

    .staggered-menu-header {
      position: relative;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 1.25rem;
      background: transparent;
      z-index: 2;
    }

    @media (min-width: 640px) {
      .staggered-menu-header { padding: 0.875rem 1.5rem; }
    }

    /* LOGO */
    .sm-logo {
      display: flex;
      align-items: center;
      user-select: none;
      font-family: Georgia, 'Times New Roman', serif;
      font-size: 1rem;
      font-weight: 400;
      letter-spacing: -0.01em;
      color: #f5f5f5;
      text-decoration: none;
    }

    .sm-logo a {
      color: inherit;
      text-decoration: none;
      transition: color 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    .sm-logo a:hover { color: #ffffff; }

    .sm-logo-accent {
      color: rgba(255, 255, 255, 0.45);
      margin-left: 0.15rem;
    }

    .sm-logo-img {
      display: block;
      height: 28px;
      width: auto;
      object-fit: contain;
    }

    /* HEADER ACTIONS — language toggle + hamburger */
    .sm-header-actions {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    /* LANGUAGE BUTTON */
    .sm-lang-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.4rem 0.75rem;
      border-radius: 9999px;
      border: 1px solid rgba(255, 255, 255, 0.15);
      background: transparent;
      color: rgba(255, 255, 255, 0.75);
      font-family: ui-monospace, SFMono-Regular, monospace;
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      cursor: pointer;
      transition: color 0.3s ease, border-color 0.3s ease, background 0.3s ease;
      white-space: nowrap;
    }

    .sm-lang-btn:hover {
      color: #ffffff;
      border-color: rgba(255, 255, 255, 0.4);
    }

    .sm-lang-btn svg {
      width: 12px;
      height: 12px;
      flex-shrink: 0;
    }

    /* HAMBURGER TOGGLE */
    .sm-toggle {
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: transparent;
      border: none;
      cursor: pointer;
      color: #ebe7e0;
      font-weight: 500;
      line-height: 1;
      overflow: visible;
      font-family: ui-monospace, SFMono-Regular, monospace;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.25em;
      padding: 0.5rem 0;
    }

    .sm-toggle:focus-visible {
      outline: 1px solid rgba(255, 255, 255, 0.5);
      outline-offset: 4px;
      border-radius: 2px;
    }

    .sm-toggle-textWrap {
      position: relative;
      display: inline-block;
      height: 1em;
      overflow: hidden;
      white-space: nowrap;
      width: var(--sm-toggle-width, auto);
      min-width: var(--sm-toggle-width, auto);
    }

    .sm-toggle-textInner {
      display: flex;
      flex-direction: column;
      line-height: 1;
    }

    .sm-toggle-line {
      display: block;
      height: 1em;
      line-height: 1;
    }

    .sm-icon {
      position: relative;
      width: 14px;
      height: 14px;
      flex: 0 0 14px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      will-change: transform;
    }

    .sm-panel-itemWrap {
      position: relative;
      overflow: hidden;
      line-height: 1;
    }

    .sm-icon-line {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 100%;
      height: 1.5px;
      background: currentColor;
      border-radius: 2px;
      transform: translate(-50%, -50%);
      will-change: transform;
    }

    /* PANEL — monochrome dark background */
    .staggered-menu-panel {
      position: absolute;
      top: 0;
      right: 0;
      width: clamp(280px, 40vw, 460px);
      height: 100%;
      background: rgb(10, 10, 10);
      background-image:
        radial-gradient(ellipse at 80% 0%, rgba(255, 255, 255, 0.03) 0%, transparent 55%),
        radial-gradient(ellipse at 20% 100%, rgba(255, 255, 255, 0.02) 0%, transparent 55%);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      display: flex;
      flex-direction: column;
      padding: 5.5rem 2rem 2rem 2rem;
      overflow-y: auto;
      z-index: 10;
      pointer-events: auto;
      opacity: 0;
      border-left: 1px solid rgba(255, 255, 255, 0.06);
    }

    [data-position='left'] .staggered-menu-panel {
      right: auto;
      left: 0;
      border-left: none;
      border-right: 1px solid rgba(255, 255, 255, 0.06);
    }

    @media (min-width: 640px) {
      .staggered-menu-panel { padding: 6rem 2.5rem 2.5rem 2.5rem; }
    }

    .sm-prelayers {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      width: clamp(280px, 40vw, 460px);
      pointer-events: none;
      z-index: 5;
      opacity: 0;
    }

    [data-position='left'] .sm-prelayers {
      right: auto;
      left: 0;
    }

    .sm-prelayer {
      position: absolute;
      top: 0;
      right: 0;
      height: 100%;
      width: 100%;
      transform: translateX(0);
      opacity: 0;
    }

    .sm-panel-inner {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    /* PANEL LIST — editorial typography, serif display */
    .sm-panel-list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .sm-panel-item {
      position: relative;
      color: #f5f5f5;
      font-family: Georgia, 'Times New Roman', serif;
      font-weight: 300;
      font-size: clamp(2.25rem, 8vw, 3.5rem);
      cursor: pointer;
      line-height: 1;
      letter-spacing: -0.03em;
      transition: color 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      display: inline-block;
      text-decoration: none;
      padding-right: 1.4em;
    }

    .sm-panel-itemLabel {
      display: inline-block;
      will-change: transform;
      transform-origin: 50% 100%;
    }

    .sm-panel-item:hover {
      color: #ffffff;
      font-style: italic;
    }

    /* Active state: section ini sedang ditampilkan di scroll position user. */
    .sm-panel-item.is-active {
      font-style: italic;
      color: #ffffff;
    }
    .sm-panel-item.is-active::before {
      content: '';
      position: absolute;
      left: -0.4em;
      top: 50%;
      width: 0.25em;
      height: 1px;
      background: rgba(255, 255, 255, 0.85);
      transform: translateY(-50%);
    }

    .sm-panel-list[data-numbering] { counter-reset: smItem; }

    .sm-panel-list[data-numbering] .sm-panel-item::after {
      counter-increment: smItem;
      content: counter(smItem, decimal-leading-zero);
      position: absolute;
      top: 0.2em;
      right: 0.2em;
      font-family: ui-monospace, SFMono-Regular, monospace;
      font-size: 10px;
      font-weight: 400;
      color: rgba(255, 255, 255, 0.4);
      letter-spacing: 0.15em;
      pointer-events: none;
      user-select: none;
      opacity: var(--sm-num-opacity, 0);
    }

    /* SOCIALS */
    .sm-socials {
      margin-top: auto;
      padding-top: 2rem;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .sm-socials-title {
      margin: 0;
      font-family: ui-monospace, SFMono-Regular, monospace;
      font-size: 10px;
      font-weight: 400;
      text-transform: uppercase;
      letter-spacing: 0.3em;
      color: rgba(163, 163, 163, 0.8);
    }

    .sm-socials-list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 1.5rem;
      flex-wrap: wrap;
    }

    .sm-socials-list .sm-socials-link { opacity: 1; }
    .sm-socials-list:hover .sm-socials-link { opacity: 0.35; }
    .sm-socials-list:hover .sm-socials-link:hover { opacity: 1; }

    .sm-socials-link:focus-visible {
      outline: 1px solid rgba(255, 255, 255, 0.5);
      outline-offset: 4px;
      border-radius: 4px;
    }

    .sm-socials-link {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      color: #ebe7e0;
      text-decoration: none;
      border-radius: 50%;
      transition:
        color 0.3s ease,
        background-color 0.3s ease,
        opacity 0.3s ease,
        transform 0.3s ease;
    }

    .sm-socials-link svg {
      width: 22px;
      height: 22px;
      display: block;
    }

    .sm-socials-link:hover {
      color: #ffffff;
      background-color: rgba(255, 255, 255, 0.08);
      transform: translateY(-2px);
    }

    .sm-panel-title {
      margin: 0;
      font-size: 10px;
      font-weight: 400;
      color: rgba(163, 163, 163, 0.8);
      text-transform: uppercase;
      letter-spacing: 0.3em;
      font-family: ui-monospace, SFMono-Regular, monospace;
    }

    /* RESPONSIVE — full-width panel di mobile */
    @media (max-width: 1024px) {
      .staggered-menu-panel,
      .sm-prelayers {
        width: 100%;
        left: 0;
        right: 0;
      }
    }

    @media (max-width: 640px) {
      .staggered-menu-panel {
        width: 100%;
        left: 0;
        right: 0;
        padding: 5rem 1.5rem 1.5rem 1.5rem;
      }
      .sm-prelayers {
        width: 100%;
        left: 0;
        right: 0;
      }
      .sm-panel-item {
        font-size: clamp(2rem, 11vw, 3rem);
      }
      .sm-panel-list[data-numbering] .sm-panel-item::after {
        font-size: 9px;
      }
      .sm-socials-list {
        gap: 1rem;
      }
      .sm-socials-link {
        width: 38px;
        height: 38px;
      }
      .sm-socials-link svg {
        width: 20px;
        height: 20px;
      }
    }
  `
  document.head.appendChild(styleEl)
}

export const StaggeredMenu = ({
  position = 'right',
  colors = ['#1a1a1a', '#0d0d0d'],
  items = [],
  socialItems = [],
  displaySocials = true,
  displayItemNumbering = true,
  className,
  logoUrl = null,
  logoNode = null,
  menuButtonColor = '#fff',
  openMenuButtonColor = '#fff',
  accentColor = '#ffffff',
  changeMenuColorOnOpen = false,
  isFixed = false,
  closeOnClickAway = true,
  scrolled = false,
  // Language toggle props
  language = null,
  onToggleLanguage = null,
  onMenuOpen,
  onMenuClose,
}) => {
  const [open, setOpen] = useState(false)
  const openRef = useRef(false)
  const panelRef = useRef(null)
  const preLayersRef = useRef(null)
  const preLayerElsRef = useRef([])
  const plusHRef = useRef(null)
  const plusVRef = useRef(null)
  const iconRef = useRef(null)
  const textInnerRef = useRef(null)
  const textWrapRef = useRef(null)
  const [textLines, setTextLines] = useState(['Menu', 'Close'])

  const openTlRef = useRef(null)
  const closeTweenRef = useRef(null)
  const spinTweenRef = useRef(null)
  const textCycleAnimRef = useRef(null)
  const colorTweenRef = useRef(null)
  const toggleBtnRef = useRef(null)
  const busyRef = useRef(false)
  const itemEntranceTweenRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current
      const preContainer = preLayersRef.current
      const plusH = plusHRef.current
      const plusV = plusVRef.current
      const icon = iconRef.current
      const textInner = textInnerRef.current
      if (!panel || !plusH || !plusV || !icon || !textInner) return

      let preLayers = []
      if (preContainer) {
        preLayers = Array.from(preContainer.querySelectorAll('.sm-prelayer'))
      }
      preLayerElsRef.current = preLayers

      const offscreen = position === 'left' ? -100 : 100
      gsap.set([panel, ...preLayers], { xPercent: offscreen, opacity: 1 })
      if (preContainer) gsap.set(preContainer, { xPercent: 0, opacity: 1 })

      gsap.set(plusH, { transformOrigin: '50% 50%', rotate: 0 })
      gsap.set(plusV, { transformOrigin: '50% 50%', rotate: 90 })
      gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' })
      gsap.set(textInner, { yPercent: 0 })

      if (toggleBtnRef.current) gsap.set(toggleBtnRef.current, { color: menuButtonColor })
    })
    return () => ctx.revert()
  }, [menuButtonColor, position])

  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current
    const layers = preLayerElsRef.current
    if (!panel) return null

    openTlRef.current?.kill()
    if (closeTweenRef.current) {
      closeTweenRef.current.kill()
      closeTweenRef.current = null
    }
    itemEntranceTweenRef.current?.kill()

    const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'))
    const numberEls = Array.from(panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item'))
    const socialTitle = panel.querySelector('.sm-socials-title')
    const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link'))

    const offscreen = position === 'left' ? -100 : 100
    const layerStates = layers.map((el) => ({ el, start: offscreen }))
    const panelStart = offscreen

    if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 })
    if (numberEls.length) gsap.set(numberEls, { '--sm-num-opacity': 0 })
    if (socialTitle) gsap.set(socialTitle, { opacity: 0 })
    if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 })

    const tl = gsap.timeline({ paused: true })

    layerStates.forEach((ls, i) => {
      tl.fromTo(ls.el, { xPercent: ls.start }, { xPercent: 0, duration: 0.5, ease: 'power4.out' }, i * 0.07)
    })

    const lastTime = layerStates.length ? (layerStates.length - 1) * 0.07 : 0
    const panelInsertTime = lastTime + (layerStates.length ? 0.08 : 0)
    const panelDuration = 0.65

    tl.fromTo(
      panel,
      { xPercent: panelStart },
      { xPercent: 0, duration: panelDuration, ease: 'power4.out' },
      panelInsertTime
    )

    if (itemEls.length) {
      const itemsStartRatio = 0.15
      const itemsStart = panelInsertTime + panelDuration * itemsStartRatio
      tl.to(
        itemEls,
        { yPercent: 0, rotate: 0, duration: 1, ease: 'power4.out', stagger: { each: 0.1, from: 'start' } },
        itemsStart
      )
      if (numberEls.length) {
        tl.to(
          numberEls,
          { duration: 0.6, ease: 'power2.out', '--sm-num-opacity': 1, stagger: { each: 0.08, from: 'start' } },
          itemsStart + 0.1
        )
      }
    }

    if (socialTitle || socialLinks.length) {
      const socialsStart = panelInsertTime + panelDuration * 0.4
      if (socialTitle) {
        tl.to(socialTitle, { opacity: 1, duration: 0.5, ease: 'power2.out' }, socialsStart)
      }
      if (socialLinks.length) {
        tl.to(
          socialLinks,
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: 'power3.out',
            stagger: { each: 0.08, from: 'start' },
            onComplete: () => gsap.set(socialLinks, { clearProps: 'opacity' }),
          },
          socialsStart + 0.04
        )
      }
    }

    openTlRef.current = tl
    return tl
  }, [position])

  const playOpen = useCallback(() => {
    if (busyRef.current) return
    busyRef.current = true
    const tl = buildOpenTimeline()
    if (tl) {
      tl.eventCallback('onComplete', () => { busyRef.current = false })
      tl.play(0)
    } else {
      busyRef.current = false
    }
  }, [buildOpenTimeline])

  const playClose = useCallback(() => {
    openTlRef.current?.kill()
    openTlRef.current = null
    itemEntranceTweenRef.current?.kill()

    const panel = panelRef.current
    const layers = preLayerElsRef.current
    if (!panel) return

    const all = [...layers, panel]
    closeTweenRef.current?.kill()
    const offscreen = position === 'left' ? -100 : 100

    closeTweenRef.current = gsap.to(all, {
      xPercent: offscreen,
      duration: 0.32,
      ease: 'power3.in',
      overwrite: 'auto',
      onComplete: () => {
        const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'))
        if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 })
        const numberEls = Array.from(panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item'))
        if (numberEls.length) gsap.set(numberEls, { '--sm-num-opacity': 0 })
        const socialTitle = panel.querySelector('.sm-socials-title')
        const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link'))
        if (socialTitle) gsap.set(socialTitle, { opacity: 0 })
        if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 })
        busyRef.current = false
      },
    })
  }, [position])

  const animateIcon = useCallback((opening) => {
    const icon = iconRef.current
    if (!icon) return
    spinTweenRef.current?.kill()
    if (opening) {
      spinTweenRef.current = gsap.to(icon, { rotate: 225, duration: 0.8, ease: 'power4.out', overwrite: 'auto' })
    } else {
      spinTweenRef.current = gsap.to(icon, { rotate: 0, duration: 0.35, ease: 'power3.inOut', overwrite: 'auto' })
    }
  }, [])

  const animateColor = useCallback(
    (opening) => {
      const btn = toggleBtnRef.current
      if (!btn) return
      colorTweenRef.current?.kill()
      if (changeMenuColorOnOpen) {
        const targetColor = opening ? openMenuButtonColor : menuButtonColor
        colorTweenRef.current = gsap.to(btn, { color: targetColor, delay: 0.18, duration: 0.3, ease: 'power2.out' })
      } else {
        gsap.set(btn, { color: menuButtonColor })
      }
    },
    [openMenuButtonColor, menuButtonColor, changeMenuColorOnOpen]
  )

  const animateText = useCallback((opening) => {
    const inner = textInnerRef.current
    if (!inner) return
    textCycleAnimRef.current?.kill()

    const currentLabel = opening ? 'Menu' : 'Close'
    const targetLabel = opening ? 'Close' : 'Menu'
    const cycles = 3
    const seq = [currentLabel]
    let last = currentLabel
    for (let i = 0; i < cycles; i++) {
      last = last === 'Menu' ? 'Close' : 'Menu'
      seq.push(last)
    }
    if (last !== targetLabel) seq.push(targetLabel)
    seq.push(targetLabel)
    setTextLines(seq)

    gsap.set(inner, { yPercent: 0 })
    const lineCount = seq.length
    const finalShift = ((lineCount - 1) / lineCount) * 100
    textCycleAnimRef.current = gsap.to(inner, {
      yPercent: -finalShift,
      duration: 0.5 + lineCount * 0.07,
      ease: 'power4.out',
    })
  }, [])

  const toggleMenu = useCallback(() => {
    const target = !openRef.current
    openRef.current = target
    setOpen(target)
    if (target) {
      onMenuOpen?.()
      playOpen()
    } else {
      onMenuClose?.()
      playClose()
    }
    animateIcon(target)
    animateColor(target)
    animateText(target)
  }, [playOpen, playClose, animateIcon, animateColor, animateText, onMenuOpen, onMenuClose])

  const closeMenu = useCallback(() => {
    if (openRef.current) {
      openRef.current = false
      setOpen(false)
      onMenuClose?.()
      playClose()
      animateIcon(false)
      animateColor(false)
      animateText(false)
    }
  }, [playClose, animateIcon, animateColor, animateText, onMenuClose])

  React.useEffect(() => {
    if (toggleBtnRef.current) {
      if (changeMenuColorOnOpen) {
        const targetColor = openRef.current ? openMenuButtonColor : menuButtonColor
        gsap.set(toggleBtnRef.current, { color: targetColor })
      } else {
        gsap.set(toggleBtnRef.current, { color: menuButtonColor })
      }
    }
  }, [changeMenuColorOnOpen, menuButtonColor, openMenuButtonColor])

  React.useEffect(() => {
    if (!closeOnClickAway || !open) return
    const handleClickOutside = (event) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target) &&
        toggleBtnRef.current &&
        !toggleBtnRef.current.contains(event.target)
      ) {
        closeMenu()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [closeOnClickAway, open, closeMenu])

  return (
    <div
      className={(className ? className + ' ' : '') + 'staggered-menu-wrapper' + (isFixed ? ' fixed-wrapper' : '')}
      style={accentColor ? { ['--sm-accent']: accentColor } : undefined}
      data-position={position}
      data-open={open || undefined}
    >
      {/* Pre-layers untuk animasi slide-in */}
      <div ref={preLayersRef} className="sm-prelayers" aria-hidden="true">
        {(() => {
          const raw = colors && colors.length ? colors.slice(0, 4) : ['#1a1a1a', '#0d0d0d']
          let arr = [...raw]
          if (arr.length >= 3) {
            const mid = Math.floor(arr.length / 2)
            arr.splice(mid, 1)
          }
          return arr.map((c, i) => <div key={i} className="sm-prelayer" style={{ background: c }} />)
        })()}
      </div>

      {/*
        HEADER BAR
        - Glass pill muncul saat scrolled=true
        - Logo kiri, language toggle + hamburger kanan
      */}
      <div
        className="staggered-menu-header-outer"
        data-scrolled={scrolled || undefined}
        aria-label="Main navigation header"
      >
        <div className="staggered-menu-header-inner">
          {/* Glass background — di belakang konten */}
          <div className="staggered-menu-glass-wrapper" aria-hidden="true">
            <GlassSurface
              width="100%"
              height="100%"
              borderRadius={9999}
              brightness={50}
              opacity={0.93}
              blur={8}
              backgroundOpacity={0}
              saturation={1}
              displace={0}
              distortionScale={-140}
              redOffset={0}
              greenOffset={6}
              blueOffset={12}
              mixBlendMode="difference"
            />
          </div>

          {/* Header content */}
          <div className="staggered-menu-header">
            {/* Logo */}
            <div className="sm-logo" aria-label="Logo">
              {logoNode ? (
                logoNode
              ) : logoUrl ? (
                <img src={logoUrl} alt="Logo" className="sm-logo-img" draggable={false} width={110} height={24} />
              ) : null}
            </div>

            {/* Actions: Language Toggle + Hamburger */}
            <div className="sm-header-actions">
              {/* Language toggle — hanya render jika prop diberikan */}
              {language && onToggleLanguage && (
                <button
                  type="button"
                  className="sm-lang-btn"
                  onClick={onToggleLanguage}
                  aria-label="Toggle language"
                >
                  <Languages />
                  {language}
                </button>
              )}

              {/* Hamburger toggle */}
              <button
                ref={toggleBtnRef}
                className="sm-toggle"
                aria-label={open ? 'Close menu' : 'Open menu'}
                aria-expanded={open}
                aria-controls="staggered-menu-panel"
                onClick={toggleMenu}
                type="button"
              >
                <span ref={textWrapRef} className="sm-toggle-textWrap" aria-hidden="true">
                  <span ref={textInnerRef} className="sm-toggle-textInner">
                    {textLines.map((l, i) => (
                      <span className="sm-toggle-line" key={i}>
                        {l}
                      </span>
                    ))}
                  </span>
                </span>
                <span ref={iconRef} className="sm-icon" aria-hidden="true">
                  <span ref={plusHRef} className="sm-icon-line" />
                  <span ref={plusVRef} className="sm-icon-line sm-icon-line-v" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Panel slide-in */}
      <aside id="staggered-menu-panel" ref={panelRef} className="staggered-menu-panel" aria-hidden={!open}>
        <div className="sm-panel-inner">
          <ul className="sm-panel-list" role="list" data-numbering={displayItemNumbering || undefined}>
            {items && items.length ? (
              items.map((it, idx) => (
                <li className="sm-panel-itemWrap" key={it.label + idx}>
                  <a
                    className={`sm-panel-item${it.active ? ' is-active' : ''}`}
                    href={it.link}
                    aria-label={it.ariaLabel}
                    aria-current={it.active ? 'page' : undefined}
                    data-index={idx + 1}
                    onClick={closeMenu}
                  >
                    <span className="sm-panel-itemLabel">{it.label}</span>
                  </a>
                </li>
              ))
            ) : (
              <li className="sm-panel-itemWrap" aria-hidden="true">
                <span className="sm-panel-item">
                  <span className="sm-panel-itemLabel">No items</span>
                </span>
              </li>
            )}
          </ul>

          {displaySocials && socialItems && socialItems.length > 0 && (
            <div className="sm-socials" aria-label="Social links">
              <h3 className="sm-socials-title">Connect</h3>
              <ul className="sm-socials-list" role="list">
                {socialItems.map((s, i) => {
                  const IconComponent = s.icon ? ICON_MAP[s.icon.toLowerCase()] : null
                  const isMail = s.link?.startsWith('mailto:')
                  return (
                    <li key={s.label + i} className="sm-socials-item">
                      <a
                        href={s.link}
                        target={isMail ? undefined : '_blank'}
                        rel={isMail ? undefined : 'noopener noreferrer'}
                        className="sm-socials-link"
                        aria-label={s.label}
                        title={s.label}
                      >
                        {IconComponent ? <IconComponent /> : s.label}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>
      </aside>
    </div>
  )
}

export default StaggeredMenu