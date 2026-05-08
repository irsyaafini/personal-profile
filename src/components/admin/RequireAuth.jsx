import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth/useAuth'
import { PageLoader } from '@/components/common/PageLoader'

/**
 * Guard untuk admin routes.
 *
 * Kondisi akses:
 * - Harus sudah login (session ada)
 * - Harus punya role 'admin' (isAdmin === true)
 *
 * Jika tidak memenuhi syarat:
 * - Masih loading → tampilkan PageLoader
 * - Tidak login → redirect ke /admin/login (simpan lokasi asal)
 * - Login tapi bukan admin → redirect ke /admin/login dengan pesan error
 */
export function RequireAuth({ children }) {
  const { session, isAdmin, loading } = useAuth()
  const location = useLocation()

  if (loading) return <PageLoader />

  if (!session) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location.pathname }}
      />
    )
  }

  if (!isAdmin) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location.pathname, error: 'Akun ini tidak memiliki akses admin.' }}
      />
    )
  }

  return children
}
