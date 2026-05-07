import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export function QueryProvider({ children }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Public site content (profile, gallery, etc.) is updated by the
            // owner via the admin panel — visitors don't need fresh fetches
            // every few minutes. 30 min stale + 1 hr gc keeps things snappy.
            staleTime: 1000 * 60 * 30,
            gcTime: 1000 * 60 * 60,
            retry: 1,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
          },
          mutations: {
            retry: 0,
          },
        },
      })
  )

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
