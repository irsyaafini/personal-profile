import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { RootLayout } from '@/components/layout/RootLayout'
import { PageLoader } from '@/components/common/PageLoader'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { RequireAuth } from '@/components/admin/RequireAuth'
import { AdminLayout } from '@/components/admin/AdminLayout'

// Public pages
const HomePage = lazy(() => import('@/pages/HomePage'))
const ResearchPage = lazy(() => import('@/pages/ResearchPage'))
const ResearchDetailPage = lazy(() => import('@/pages/ResearchDetailPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

// Admin pages
const AdminLoginPage = lazy(() => import('@/pages/admin/AdminLoginPage'))
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'))
const AdminProfilePage = lazy(() => import('@/pages/admin/AdminProfilePage'))
const AdminExperiencesPage = lazy(() => import('@/pages/admin/AdminExperiencesPage'))
const AdminSkillsPage = lazy(() => import('@/pages/admin/AdminSkillsPage'))
const AdminGalleryPage = lazy(() => import('@/pages/admin/AdminGalleryPage'))
const AdminResearchPage = lazy(() => import('@/pages/admin/AdminResearchPage'))
const AdminMessagesPage = lazy(() => import('@/pages/admin/AdminMessagesPage'))

const withSuspense = (Component) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
)

export const router = createBrowserRouter([
  // Public site
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: withSuspense(HomePage) },
      { path: 'research', element: withSuspense(ResearchPage) },
      { path: 'research/:id', element: withSuspense(ResearchDetailPage) },
    ],
  },

  // Admin login (no layout, no auth requirement)
  {
    path: '/admin/login',
    element: withSuspense(AdminLoginPage),
    errorElement: <ErrorBoundary />,
  },

  // Admin (auth required)
  {
    path: '/admin',
    element: (
      <RequireAuth>
        <AdminLayout />
      </RequireAuth>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: withSuspense(AdminDashboardPage) },
      { path: 'profile', element: withSuspense(AdminProfilePage) },
      { path: 'experiences', element: withSuspense(AdminExperiencesPage) },
      { path: 'skills', element: withSuspense(AdminSkillsPage) },
      { path: 'gallery', element: withSuspense(AdminGalleryPage) },
      { path: 'research', element: withSuspense(AdminResearchPage) },
      { path: 'messages', element: withSuspense(AdminMessagesPage) },
    ],
  },

  // 404 fallback
  {
    path: '*',
    element: withSuspense(NotFoundPage),
  },
])
