import { Outlet, ScrollRestoration } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

export function RootLayout() {
  return (
    <div className="relative min-h-screen flex flex-col bg-noise">
      {/* Ambient atmospheric glows — pure white at very low opacity for sophistication */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="blob"
          style={{
            top: '-15%',
            right: '-10%',
            width: '42rem',
            height: '42rem',
            background: 'radial-gradient(circle, rgba(255,255,255,0.05), transparent 60%)',
          }}
        />
        <div
          className="blob"
          style={{
            bottom: '-20%',
            left: '-15%',
            width: '38rem',
            height: '38rem',
            background: 'radial-gradient(circle, rgba(255,255,255,0.035), transparent 60%)',
          }}
        />
        <div
          className="blob"
          style={{
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '30rem',
            height: '30rem',
            background: 'radial-gradient(circle, rgba(255,255,255,0.02), transparent 60%)',
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
