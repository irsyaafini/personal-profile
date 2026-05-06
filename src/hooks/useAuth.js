import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { signIn, signOut } from '@/services/authService'
import { useAuthStore } from '@/app/store/authStore'

/**
 * Hook for authentication operations
 * @returns {{
 *   user: import('@supabase/supabase-js').User|null,
 *   isAuthenticated: boolean,
 *   isLoading: boolean,
 *   login: function,
 *   logout: function,
 *   isSubmitting: boolean
 * }}
 */
export function useAuth() {
  const { user, isAuthenticated, isLoading } = useAuthStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const login = async ({ email, password }) => {
    setIsSubmitting(true)
    try {
      const { error } = await signIn({ email, password })
      if (error) throw error
      toast.success('Welcome back!')
      navigate('/admin')
    } catch (err) {
      toast.error(err.message ?? 'Login failed. Check your credentials.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const logout = async () => {
    try {
      const { error } = await signOut()
      if (error) throw error
      toast.success('Signed out successfully.')
      navigate('/admin/login')
    } catch (err) {
      toast.error(err.message ?? 'Sign out failed.')
    }
  }

  return { user, isAuthenticated, isLoading, login, logout, isSubmitting }
}
