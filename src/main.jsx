import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { QueryProvider } from '@/app/providers/QueryProvider'
import { router } from '@/app/router'
import './index.css'

const root = document.getElementById('root')

// OPTIMASI: Guard jika element root tidak ditemukan
if (!root) {
  throw new Error('Root element #root tidak ditemukan di HTML. Periksa index.html Anda.')
}

createRoot(root).render(
  <StrictMode>
    <QueryProvider>
      <RouterProvider router={router} />
    </QueryProvider>
  </StrictMode>,
)
