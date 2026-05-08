/**
 * IntroScreen — Elegant page intro animation
 *
 * Konsep: "Curtain Reveal"
 *  1. 5 panel hitam menutupi seluruh layar
 *  2. Nama "IRSYA" muncul huruf per huruf di tengah (stagger, clip-path)
 *  3. Sebuah garis tipis horizontal menyapu dari kiri ke kanan
 *  4. Panels keluar ke atas satu per satu (stagger), reveal konten di bawah
 *  5. Konten website fade-in + slide-up halus
 *
 * Library: GSAP (sudah ada di project)
 * Dipasang di: RootLayout.jsx
 *
 * Session storage dipakai agar intro hanya muncul sekali per sesi
 * (tidak muncul lagi saat navigasi antar halaman, hanya saat buka baru / refresh)
 *
 * ── Dispatch event 'intro:complete' ──────────────────────────────────
 * Saat intro selesai, kita kirim custom event ke window agar komponen
 * lain (mis. HeroSection) bisa menunda animasinya sampai panel intro
 * benar-benar hilang. Mencegah animasi hero "kebakar" di balik panel
 * saat user pertama kali membuka situs.
 */
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

// Huruf-huruf nama — tiap huruf dianimasikan sendiri
const NAME_LETTERS = ['I', 'R', 'S', 'Y', 'A']

export function IntroScreen({ onComplete }) {
  const wrapperRef   = useRef(null)
  const panelsRef    = useRef([])
  const lettersRef   = useRef([])
  const lineRef      = useRef(null)
  const subtitleRef  = useRef(null)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (!visible) return

    const wrapper  = wrapperRef.current
    const panels   = panelsRef.current
    const letters  = lettersRef.current
    const line     = lineRef.current
    const subtitle = subtitleRef.current

    if (!wrapper || panels.some(p => !p)) return

    // Kunci scroll selama intro
    document.body.style.overflow = 'hidden'

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = ''
        // Fade out wrapper sepenuhnya
        gsap.to(wrapper, {
          opacity: 0,
          duration: 0.4,
          ease: 'power2.inOut',
          onComplete: () => {
            setVisible(false)
            // Beri tahu komponen lain bahwa intro benar-benar selesai.
            // HeroSection mendengarkan event ini untuk memulai animasinya.
            try {
              window.dispatchEvent(new Event('intro:complete'))
            } catch { /* ignore */ }
            onComplete?.()
          }
        })
      }
    })

    // ── FASE 1: Setup awal ─────────────────────────────────────
    gsap.set(panels, { yPercent: 0 })
    gsap.set(letters, { yPercent: 120, opacity: 0 })
    gsap.set(line, { scaleX: 0, transformOrigin: 'left center' })
    if (subtitle) gsap.set(subtitle, { opacity: 0, y: 8 })

    // ── FASE 2: Nama muncul (stagger clip reveal) ──────────────
    tl.to(letters, {
      yPercent: 0,
      opacity: 1,
      duration: 0.9,
      stagger: 0.07,
      ease: 'power4.out',
      delay: 0.2,
    })

    // ── FASE 3: Subtitle muncul ────────────────────────────────
    if (subtitle) {
      tl.to(subtitle, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
      }, '-=0.4')
    }

    // ── FASE 4: Garis horizontal sweep ────────────────────────
    tl.to(line, {
      scaleX: 1,
      duration: 0.8,
      ease: 'power3.inOut',
    }, '-=0.2')

    // ── FASE 5: Nama menghilang ke atas ───────────────────────
    tl.to([subtitle, letters], {
      yPercent: -110,
      opacity: 0,
      duration: 0.55,
      stagger: 0.03,
      ease: 'power3.in',
    }, '+=0.15')

    // ── FASE 6: Panels sweep keluar ke atas (stagger) ─────────
    tl.to(panels, {
      yPercent: -100,
      duration: 0.85,
      stagger: 0.07,
      ease: 'power4.inOut',
    }, '-=0.3')

    return () => {
      tl.kill()
      document.body.style.overflow = ''
    }
  }, [visible, onComplete])

  if (!visible) return null

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {/* 5 panel curtain — dengan sedikit perbedaan warna untuk efek depth */}
      {[
        'rgb(10, 10, 10)',
        'rgb(13, 13, 13)',
        'rgb(10, 10, 10)',
        'rgb(13, 13, 13)',
        'rgb(10, 10, 10)',
      ].map((bg, i) => (
        <div
          key={i}
          ref={el => panelsRef.current[i] = el}
          style={{
            position: 'absolute',
            top: 0,
            left: `${i * 20}%`,
            width: '21%', // sedikit overlap agar tidak ada gap
            height: '100%',
            background: bg,
            willChange: 'transform',
          }}
        />
      ))}

      {/* Center stage — nama + line */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.5rem',
        zIndex: 1,
      }}>

        {/* Garis atas tipis */}
        <div
          ref={lineRef}
          style={{
            width: 'clamp(120px, 20vw, 200px)',
            height: '1px',
            background: 'rgba(255,255,255,0.25)',
            willChange: 'transform',
          }}
        />

        {/* Nama — tiap huruf dalam overflow-hidden wrapper */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(0.15rem, 1vw, 0.5rem)',
          overflow: 'hidden',
          paddingBottom: '0.1em', // ruang untuk descender
        }}>
          {NAME_LETTERS.map((letter, i) => (
            <span
              key={i}
              ref={el => lettersRef.current[i] = el}
              style={{
                display: 'block',
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontWeight: 300,
                fontSize: 'clamp(3.5rem, 12vw, 8rem)',
                letterSpacing: '0.2em',
                color: '#f5f5f5',
                lineHeight: 1,
                willChange: 'transform, opacity',
                userSelect: 'none',
              }}
            >
              {letter}
            </span>
          ))}
        </div>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          style={{
            fontFamily: 'ui-monospace, SFMono-Regular, monospace',
            fontSize: 'clamp(9px, 1.2vw, 11px)',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.35)',
            willChange: 'transform, opacity',
            userSelect: 'none',
          }}
        >
          Personal Profile
        </p>

      </div>
    </div>
  )
}

export default IntroScreen
