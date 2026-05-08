import { useState } from 'react'
import { Outlet, ScrollRestoration } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { IntroScreen } from '@/components/common/IntroScreen'

/**
 * RootLayout
 *
 * Perubahan: Tambah IntroScreen — animasi curtain reveal saat pertama buka.
 * Hanya muncul sekali per session (session storage), tidak muncul
 * saat navigasi antar halaman internal.
 */

// Cek apakah intro sudah pernah ditampilkan di session ini
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

      {/* Ambient atmospheric glows */}
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