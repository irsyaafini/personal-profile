import { Component } from 'react'
import { useRouteError, Link, isRouteErrorResponse } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

// ── Route-level Error Boundary (untuk React Router errorElement) ──────────────
// Dipakai sebagai `errorElement` di router config.
export function ErrorBoundary() {
  const error = useRouteError()

  // Log ke console hanya di dev
  if (import.meta.env.DEV) {
    console.error('[ErrorBoundary]', error)
  }

  // OPTIMASI: Tampilkan pesan yang berbeda untuk 404 vs error lain
  const is404 = isRouteErrorResponse(error) && error.status === 404
  const message = is404
    ? 'Halaman tidak ditemukan.'
    : error?.statusText || error?.message || 'Silakan refresh halaman atau kembali ke beranda.'

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-noise">
      <div className="max-w-md text-center">
        <p className="section-label mb-4">{is404 ? '404' : 'Terjadi Kesalahan'}</p>
        <h1 className="text-3xl sm:text-4xl font-semibold text-slate-100">
          {is404 ? 'Halaman Tidak Ditemukan' : 'Ups, Ada yang Salah'}
        </h1>
        <p className="mt-3 text-sm text-slate-400">{message}</p>
        <div className="mt-8 flex justify-center gap-3">
          <Button as={Link} to="/" variant="solid">
            Kembali ke Beranda
          </Button>
          {!is404 && (
            <Button variant="ghost" onClick={() => window.location.reload()}>
              Refresh
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Class-based Error Boundary (untuk React component tree errors) ────────────
// Dipakai untuk membungkus komponen berat seperti DomeGallery, StaggeredMenu, dll
// yang mungkin throw error di componentDidMount / useEffect.
//
// Contoh penggunaan:
//   <ComponentErrorBoundary fallback={<div>Komponen gagal dimuat.</div>}>
//     <DomeGallery ... />
//   </ComponentErrorBoundary>
export class ComponentErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) {
      console.error('[ComponentErrorBoundary]', error, info.componentStack)
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="p-8 text-center text-sm text-white/40">
          Komponen gagal dimuat. Silakan refresh halaman.
        </div>
      )
    }
    return this.props.children
  }
}
