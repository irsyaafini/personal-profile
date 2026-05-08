import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

// Singleton QueryClient — shared across renders, never re-created.
// Creating a new QueryClient inside useState(() => ...) is fine for SSR safety,
// but for a pure CSR app this avoids any edge-case re-creation.
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Public content (profile, gallery, etc.) changes only via admin panel.
        // 30 min stale + 1 hr gc = snappy repeat visits without over-fetching.
        staleTime: 1000 * 60 * 30,
        gcTime: 1000 * 60 * 60,
        retry: 1,
        retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30_000),
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        // OPTIMASI: Jika fetch gagal karena network offline, jangan tampilkan error —
        // tampilkan data stale yang ada di cache dulu.
        networkMode: 'offlineFirst',
      },
      mutations: {
        retry: 0,
        networkMode: 'online',
      },
    },
  })
}

// Module-level singleton — avoids re-creating the client on HMR / StrictMode double-render.
let _client = null
function getQueryClient() {
  if (!_client) _client = makeQueryClient()
  return _client
}

export function QueryProvider({ children }) {
  // useState guarantees the same instance even in React StrictMode double-invoke.
  const [client] = useState(getQueryClient)
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
