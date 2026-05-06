import { Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/app/store/authStore'
import { LoginForm } from '@/features/auth/LoginForm'

/**
 * Admin login page — shown when not authenticated
 */
export default function LoginPage() {
  const { isAuthenticated } = useAuthStore()

  if (isAuthenticated) return <Navigate to="/admin" replace />

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-600 to-emerald-500 flex items-center justify-center mb-4 shadow-lg shadow-primary-200">
            <span className="text-white font-bold text-2xl font-display">E</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Admin Access</h1>
          <p className="text-slate-500 text-sm mt-1">EpiPortfolio Dashboard</p>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8">
          <LoginForm />
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Protected area — authorized personnel only
        </p>
      </motion.div>
    </div>
  )
}
