import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { QueryProvider } from '@/app/providers/QueryProvider'
import { router } from '@/app/router'
import './index.css'

/**
 * Application entry point.
 * AuthProvider lives inside RootLayout (a route component) so it always
 * has access to the React Router context.  Toaster is rendered by RootLayout too.
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryProvider>
      <RouterProvider router={router} />
    </QueryProvider>
  </StrictMode>,
)
