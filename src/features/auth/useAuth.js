import { useEffect } from 'react'
import { useAuthStore } from '@/app/store/auth.store'

/**
 * Hook untuk mengakses auth state.
 * Memanggil init() sekali saat pertama kali di-mount.
 *
 * FIX: Sebelumnya mengecek `_unsubscribe === null` tapi auth.store.js
 * sudah diubah menggunakan `_initialized`. Sekarang menggunakan
 * `_initialized` yang konsisten dengan store.
 */
export function useAuth() {
  const auth = useAuthStore()

  useEffect(() => {
    if (!auth._initialized) {
      auth.init()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return auth
}