import { useState } from 'react'
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom'
import { LogOut, Menu, X, ExternalLink } from 'lucide-react'
import { ADMIN_NAV_ITEMS } from '@/constants'
import { useAuth } from '@/features/auth/useAuth'
import { cn } from '@/utils'

export function AdminLayout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <button
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:sticky top-0 left-0 z-40 h-screen w-64 shrink-0 bg-[#0d0d0d] border-r border-white/[0.06] flex flex-col transition-transform',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Brand */}
        <div className="px-6 py-6 border-b border-white/[0.06] flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-2.5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black font-display text-sm font-bold">
              P
            </span>
            <div>
              <div className="font-display text-sm font-semibold tracking-tight">portfolio</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-white/40">admin</div>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/60 hover:text-white"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
          {ADMIN_NAV_ITEMS.map((item) => (
            <NavLink
              key={item.id}
              to={item.to}
              end={item.to === '/admin'}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                cn(
                  'block px-3.5 py-2.5 rounded-lg text-sm transition',
                  isActive
                    ? 'bg-white/[0.08] text-white border border-white/10'
                    : 'text-white/60 hover:text-white hover:bg-white/[0.03] border border-transparent'
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-white/[0.06] space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs text-white/55 hover:text-white hover:bg-white/[0.04] transition"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View site
          </Link>
          <div className="px-3.5 py-2">
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/35 font-semibold">
              Signed in
            </p>
            <p className="text-xs text-white/75 truncate mt-0.5">
              {user?.email ?? '—'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs text-white/70 hover:text-white hover:bg-white/[0.04] border border-white/10 transition"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar (mobile only) */}
        <header className="lg:hidden sticky top-0 z-20 bg-[#0a0a0a]/85 backdrop-blur border-b border-white/[0.06] px-4 py-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white/80 hover:text-white"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-display text-sm font-semibold">admin</span>
          <span className="w-9" />
        </header>

        <main className="flex-1 px-4 sm:px-6 lg:px-10 py-8 sm:py-10 max-w-6xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
