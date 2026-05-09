import { useState } from 'react'
import { Outlet, ScrollRestoration } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { IntroScreen } from '@/components/common/IntroScreen'

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

      {/* Intro curtain */}
      {introVisible && (
        <IntroScreen onComplete={handleIntroComplete} />
      )}

      {/* Atmospheric glows — richer multi-point lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        {/* Top right warm glow */}
        <div
          className="blob"
          style={{
            top: '-10%',
            right: '-8%',
            width: '42rem',
            height: '42rem',
            background: 'radial-gradient(circle, rgba(255,255,255,0.05), transparent 55%)',
          }}
        />
        {/* Bottom left cool glow */}
        <div
          className="blob"
          style={{
            bottom: '-18%',
            left: '-12%',
            width: '38rem',
            height: '38rem',
            background: 'radial-gradient(circle, rgba(255,255,255,0.03), transparent 55%)',
          }}
        />
        {/* Center ambient very subtle */}
        <div
          className="blob"
          style={{
            top: '40%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60rem',
            height: '30rem',
            background: 'radial-gradient(ellipse, rgba(255,255,255,0.015), transparent 65%)',
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
