import { Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/app/providers/AuthProvider'

/**
 * Root layout — the single parent of every route tree.
 * Placing AuthProvider here gives it access to React Router context
 * (needed for useNavigate inside useAuth hook).
 */
export function RootLayout() {
  return (
    <AuthProvider>
      <Outlet />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '12px',
            background: '#1e293b',
            color: '#f8fafc',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#f8fafc' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: '#f8fafc' } },
        }}
      />
    </AuthProvider>
  )
}
