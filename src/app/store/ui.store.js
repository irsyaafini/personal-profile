import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useUIStore = create(
  persist(
    (set) => ({
      language: 'en',
      mobileMenuOpen: false,
      lightboxIndex: null, // gallery lightbox

      setLanguage: (language) => set({ language }),
      toggleMobileMenu: () => set((s) => ({ mobileMenuOpen: !s.mobileMenuOpen })),
      closeMobileMenu: () => set({ mobileMenuOpen: false }),

      openLightbox: (index) => set({ lightboxIndex: index }),
      closeLightbox: () => set({ lightboxIndex: null }),
    }),
    {
      name: 'ui-prefs',
      partialize: (s) => ({ language: s.language }),
    }
  )
)
