import { Outlet, ScrollRestoration } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

export function RootLayout() {
  return (
    <div className="relative min-h-screen flex flex-col bg-noise">
      {/*
        Ambient atmospheric glows — kept to 2 blobs (was 3) and smaller to
        reduce GPU paint cost. The blur radius was also lowered in index.css.
      */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="blob"
          style={{
            top: '-15%',
            right: '-10%',
            width: '36rem',
            height: '36rem',
            background: 'radial-gradient(circle, rgba(255,255,255,0.045), transparent 60%)',
          }}
        />
        <div
          className="blob"
          style={{
            bottom: '-20%',
            left: '-15%',
            width: '32rem',
            height: '32rem',
            background: 'radial-gradient(circle, rgba(255,255,255,0.03), transparent 60%)',
          }}
        />
      </div>

      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  )
}
