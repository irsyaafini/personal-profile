import { useState } from 'react'
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom'
import { LogOut, Menu, X, ExternalLink } from 'lucide-react'
import { ADMIN_NAV_ITEMS } from '@/constants'
import { useAuth } from '@/features/auth/useAuth'
import { useProfile } from '@/features/profile/useProfile'
import { cn } from '@/utils'
import GlassSurface from '@/components/reactbits/GlassSurface'

export function AdminLayout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { data: profile } = useProfile()

  const handleSignOut = async () => {
    await signOut()
    navigate('/admin/login', { replace: true })
  }

  const displayName = profile?.full_name ?? 'Personal'

  return (
    <div className="min-h-screen bg-[#080808] text-white flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <button
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar — glass surface */}
      <aside
        className={cn(
          'fixed lg:sticky top-0 left-0 z-40 h-screen w-64 shrink-0 flex flex-col transition-transform',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Glass background for sidebar */}
        <div className="absolute inset-0 glass-panel border-r border-white/[0.07]" />

        <div className="relative z-10 flex flex-col h-full">
          {/* Brand */}
          <div className="px-6 py-6 border-b border-white/[0.06] flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-2.5">
              <div>
                <div className="font-display text-sm font-semibold tracking-tight">{displayName}</div>
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
                      ? 'bg-white/[0.08] text-white border border-white/10 backdrop-blur'
                      : 'text-white/60 hover:text-white hover:bg-white/[0.04] border border-transparent'
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
              className="w-full flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs text-white/70 hover:text-white hover:bg-white/[0.05] border border-white/10 transition backdrop-blur"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar (mobile only) — glass */}
        <header className="lg:hidden sticky top-0 z-20 border-b border-white/[0.06] px-4 py-3 flex items-center justify-between backdrop-blur-xl bg-white/[0.03]">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white/80 hover:text-white backdrop-blur"
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
