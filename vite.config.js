import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

/**
 * Vite config (OPTIMIZED FOR LIGHTHOUSE)
 *
 * Optimasi yang diterapkan:
 * 1. Code splitting manual untuk vendor besar (gsap, react, react-query, supabase)
 *    sehingga bundle utama (initial JS) sekecil mungkin.
 * 2. Build target ES2020+ (browser modern) — output lebih kecil & lebih cepat
 *    karena tidak perlu polyfill berlebihan.
 * 3. cssCodeSplit: true — CSS untuk halaman admin tidak dimuat di public site.
 * 4. Drop console & debugger di production.
 * 5. Asset inline limit dinaikkan ke 4kb agar SVG icon kecil di-inline (1 less request).
 */

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  build: {
    // Target browser modern — JS lebih kecil & lebih cepat
    target: 'es2020',

    // CSS code splitting per route
    cssCodeSplit: true,

    // Inline asset < 4KB sebagai data URL (kurangi request)
    assetsInlineLimit: 4096,

    // Source maps di production: false untuk size optimal,
    // tapi kalau perlu monitoring set ke 'hidden' agar masih ada
    // tapi tidak tertaut otomatis di browser.
    sourcemap: false,

    // Minify dengan terser untuk hasil maksimal
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,    // hapus console.log di production
        drop_debugger: true,
        passes: 2,
      },
      format: {
        comments: false,
      },
    },

    rollupOptions: {
      output: {
        // Manual chunk splitting — kurangi initial bundle size
        manualChunks: {
          // React core
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // GSAP — animasi (lazy-loaded, tapi di-extract supaya cacheable)
          'gsap': ['gsap'],
          // Supabase client
          'supabase': ['@supabase/supabase-js'],
          // React Query
          'query': ['@tanstack/react-query'],
          // Lucide icons
          'icons': ['lucide-react'],
        },
        // File naming dengan content hash untuk cache busting
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },

    // Warning threshold untuk chunk size
    chunkSizeWarningLimit: 600,
  },

  // OPTIMASI: pre-bundling dependencies untuk dev fast
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'lucide-react',
    ],
    // GSAP di-load lazy, jadi tidak perlu pre-bundle
    exclude: ['gsap'],
  },

  // Server config — untuk dev only
  server: {
    port: 5173,
    open: false,
  },
})