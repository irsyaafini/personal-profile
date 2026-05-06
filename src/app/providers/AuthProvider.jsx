import { useEffect } from 'react'
import { onAuthStateChange } from '@/services/authService'
import { useAuthStore } from '@/app/store/authStore'

/**
 * Initializes Supabase auth listener and syncs to Zustand store.
 * Wrap around the app in main.jsx.
 *
 * @param {{ children: React.ReactNode }} props
 */
export function AuthProvider({ children }) {
  const { setUser, setLoading } = useAuthStore()

  useEffect(() => {
    setLoading(true)
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user)
    })
    return unsubscribe
  }, [setUser, setLoading])

  return children
}
