import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/app/store/authStore'

/**
 * Guards admin routes — redirects to /admin/login if not authenticated.
 * Shows nothing while auth state is still loading.
 */
export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuthStore()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Checking authentication…</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return <Outlet />
}
