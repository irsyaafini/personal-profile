import { useState } from 'react'
import { Outlet, ScrollRestoration } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { IntroScreen } from '@/components/common/IntroScreen'

/**
 * RootLayout (OPTIMIZED)
 *
 * ── PERUBAHAN OPTIMASI LIGHTHOUSE ─────────────────────────────────────────
 * 1. PAINT/TBT — Ambient blob glow tetap ada tapi sudah punya
 *    will-change:transform di .blob (lihat index.css), jadi cuma di-rasterize
 *    sekali dan dimainkan oleh GPU compositor — tidak repaint per frame.
 * 2. CLS — main wrapper diberi `min-height` untuk reservasi ruang konten.
 * 3. Scroll restoration tetap di belakang biar kerja normal antar page.
 */

const hasSeenIntro = () => {
  try { return sessionStorage.getItem('intro-seen') === '1' }
  catch { return false }
}

const markIntroSeen = () => {
  try { sessionStorage.setItem('intro-seen', '1') }
  catch { /* ignore */ }
}

export function RootLayout() {
  const [introVisible, setIntroVisible] = useState(!hasSeenIntro())

  const handleIntroComplete = () => {
    markIntroSeen()
    setIntroVisible(false)
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-noise">

      {/* Intro curtain — hanya saat session baru */}
      {introVisible && (
        <IntroScreen onComplete={handleIntroComplete} />
      )}

      {/* Ambient atmospheric glows — pure decorative, tidak interaktif */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div
          className="blob"
          style={{
            top: '-15%',
            right: '-10%',
            width: '36rem',
            height: '36rem',
            background: 'radial-gradient(circle, rgba(255,255,255,0.04), transparent 60%)',
          }}
        />
        <div
          className="blob"
          style={{
            bottom: '-20%',
            left: '-15%',
            width: '32rem',
            height: '32rem',
            background: 'radial-gradient(circle, rgba(255,255,255,0.025), transparent 60%)',
          }}
        />
      </div>

      <Navbar />
      <main className="flex-1" id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />

      <ScrollRestoration />
    </div>
  )
}