import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth/useAuth'
import { PageLoader } from '@/components/common/PageLoader'

/**
 * Wrap admin routes — if no session, redirect to /admin/login.
 */
export function RequireAuth({ children }) {
  const { session, loading } = useAuth()
  const location = useLocation()

  if (loading) return <PageLoader />
  if (!session) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  }
  return children
}
