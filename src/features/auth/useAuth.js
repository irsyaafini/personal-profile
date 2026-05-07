import { useEffect } from 'react'
import { useAuthStore } from '@/app/store/auth.store'

export function useAuth() {
  const auth = useAuthStore()

  useEffect(() => {
    if (auth.session === null && auth.loading) {
      auth.init()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return auth
}
