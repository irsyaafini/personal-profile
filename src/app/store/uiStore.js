import { create } from 'zustand'

/**
 * @typedef {Object} UIState
 * @property {boolean} isMobileMenuOpen
 * @property {string|null} activeModal
 * @property {function} toggleMobileMenu
 * @property {function} closeMobileMenu
 * @property {function} openModal
 * @property {function} closeModal
 */

/** @type {import('zustand').UseBoundStore<import('zustand').StoreApi<UIState>>} */
export const useUIStore = create((set) => ({
  isMobileMenuOpen: false,
  activeModal: null,

  toggleMobileMenu: () => set((state) => ({
    isMobileMenuOpen: !state.isMobileMenuOpen,
  })),

  closeMobileMenu: () => set({ isMobileMenuOpen: false }),

  openModal: (modalId) => set({ activeModal: modalId }),

  closeModal: () => set({ activeModal: null }),
}))
