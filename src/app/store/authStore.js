import { create } from 'zustand'

/**
 * @typedef {Object} AuthState
 * @property {import('@supabase/supabase-js').User|null} user
 * @property {boolean} isLoading
 * @property {boolean} isAuthenticated
 * @property {function} setUser
 * @property {function} setLoading
 * @property {function} clearAuth
 */

/** @type {import('zustand').UseBoundStore<import('zustand').StoreApi<AuthState>>} */
export const useAuthStore = create((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user) => set({
    user,
    isAuthenticated: !!user,
    isLoading: false,
  }),

  setLoading: (isLoading) => set({ isLoading }),

  clearAuth: () => set({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  }),
}))
