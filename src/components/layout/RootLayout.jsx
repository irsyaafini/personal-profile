import { Outlet, ScrollRestoration } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

/**
 * RootLayout
 *
 * OPTIMASI yang diterapkan:
 * 1. Blob ambient glow menggunakan `will-change: transform` TIDAK disarankan
 *    karena dapat memaksa GPU layer baru yang justru memperlambat.
 *    Sebagai gantinya, kita pakai `transform: translateZ(0)` untuk promote layer
 *    HANYA pada blob yang ada animasinya (jika ada).
 *
 * 2. Blob dibungkus dalam `aria-hidden` — pure dekoratif, tidak perlu di DOM aksesibilitas.
 *
 * 3. `overflow-hidden` pada wrapper fixed blob memastikan blob tidak memicu
 *    horizontal scrollbar di mobile.
 *
 * 4. TIDAK menggunakan backdrop-filter pada blob — terlalu berat di low-end device.
 *    Filter hanya ada di GlassSurface (navbar) yang ukurannya kecil dan
 *    di-throttle resize-nya.
 */
export function RootLayout() {
  return (
    <div className="relative min-h-screen flex flex-col bg-noise">
      {/* Ambient atmospheric glows — 2 blob, fixed, pointer-events none */}
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
            // OPTIMASI: Kurangi opacity blob — efek visual sama tapi GPU lebih ringan
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
        {/* tabIndex={-1} untuk skip-to-content link aksesibilitas */}
        <Outlet />
      </main>
      <Footer />

      {/* OPTIMASI: ScrollRestoration mencegah halaman baru selalu mulai dari tengah */}
      <ScrollRestoration />
    </div>
  )
}
