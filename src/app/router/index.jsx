import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from '@/components/layout/RootLayout'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { ProtectedRoute } from './ProtectedRoute'

// ── Page-level lazy imports ─────────────────────────────────
const HomePage        = lazy(() => import('@/pages/public/HomePage'))
const AboutPage       = lazy(() => import('@/pages/public/AboutPage'))
const ResearchPage    = lazy(() => import('@/pages/public/ResearchPage'))
const PublicationsPage = lazy(() => import('@/pages/public/PublicationsPage'))
const ContactPage     = lazy(() => import('@/pages/public/ContactPage'))
const NotFoundPage    = lazy(() => import('@/pages/public/NotFoundPage'))

const LoginPage       = lazy(() => import('@/pages/admin/LoginPage'))
const DashboardPage   = lazy(() => import('@/pages/admin/DashboardPage'))
const AdminResearch   = lazy(() => import('@/pages/admin/AdminResearchPage'))
const AdminPublications = lazy(() => import('@/pages/admin/AdminPublicationsPage'))
const AdminMessages   = lazy(() => import('@/pages/admin/AdminMessagesPage'))
const AdminProfile    = lazy(() => import('@/pages/admin/AdminProfilePage'))

/** Full-page suspense fallback */
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
    </div>
  )
}

function Wrap({ children }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>
}

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
  // ── Public routes ────────────────────────────────────────
  {
    element: <PublicLayout />,
    children: [
      { path: '/',             element: <Wrap><HomePage /></Wrap> },
      { path: '/about',        element: <Wrap><AboutPage /></Wrap> },
      { path: '/research',     element: <Wrap><ResearchPage /></Wrap> },
      { path: '/publications', element: <Wrap><PublicationsPage /></Wrap> },
      { path: '/contact',      element: <Wrap><ContactPage /></Wrap> },
      { path: '*',             element: <Wrap><NotFoundPage /></Wrap> },
    ],
  },
  // ── Admin login (no AdminLayout) ─────────────────────────
  {
    path: '/admin/login',
    element: <Wrap><LoginPage /></Wrap>,
  },
  // ── Protected admin routes ───────────────────────────────
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: '/admin',                  element: <Wrap><DashboardPage /></Wrap> },
          { path: '/admin/research',         element: <Wrap><AdminResearch /></Wrap> },
          { path: '/admin/publications',     element: <Wrap><AdminPublications /></Wrap> },
          { path: '/admin/messages',         element: <Wrap><AdminMessages /></Wrap> },
          { path: '/admin/profile',          element: <Wrap><AdminProfile /></Wrap> },
        ],
      },
    ],
  },
  ],       // end RootLayout children
  },        // end RootLayout
])
