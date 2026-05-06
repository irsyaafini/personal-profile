import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useDashboardStats } from '@/hooks/useMessages'
import { useResearchList } from '@/hooks/useResearch'
import { usePublications } from '@/hooks/usePublications'
import { useAuth } from '@/hooks/useAuth'
import { Skeleton } from '@/components/ui/Skeleton'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatDate, truncateText } from '@/utils'

/** Admin stat card */
function AdminStat({ label, value, icon, color, link }) {
  const colorMap = {
    blue:   'bg-primary-50 text-primary-600 border-primary-100',
    green:  'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber:  'bg-amber-50 text-amber-600 border-amber-100',
    red:    'bg-red-50 text-red-600 border-red-100',
  }
  return (
    <Link to={link}>
      <motion.div
        className={`p-6 rounded-2xl border ${colorMap[color]} hover:shadow-md transition-shadow cursor-pointer`}
        whileHover={{ y: -2 }}
      >
        <div className="text-3xl mb-3">{icon}</div>
        <p className="text-3xl font-bold mb-1 font-display">{value}</p>
        <p className="text-sm font-medium opacity-80">{label}</p>
      </motion.div>
    </Link>
  )
}

/**
 * Admin dashboard overview page
 */
export default function DashboardPage() {
  const { user } = useAuth()
  const { data: stats, isLoading: statsLoading } = useDashboardStats()
  const { data: research } = useResearchList()
  const { data: publications } = usePublications()

  const recentResearch = research?.slice(0, 3) ?? []
  const recentPubs = publications?.slice(0, 3) ?? []

  return (
    <div className="space-y-8">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-display">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">
          Welcome back, {user?.email} — here's an overview of your portfolio.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)
        ) : (
          <>
            <AdminStat label="Research Projects" value={stats?.research ?? 0} icon="🔬" color="blue" link="/admin/research" />
            <AdminStat label="Publications" value={stats?.publications ?? 0} icon="📄" color="green" link="/admin/publications" />
            <AdminStat label="Total Messages" value={stats?.messages ?? 0} icon="✉️" color="amber" link="/admin/messages" />
            <AdminStat label="Unread Messages" value={stats?.unread ?? 0} icon="🔔" color="red" link="/admin/messages" />
          </>
        )}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-base font-semibold text-slate-700 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/research" className="btn-primary text-sm py-2 px-4">+ Add Research</Link>
          <Link to="/admin/publications" className="btn-secondary text-sm py-2 px-4">+ Add Publication</Link>
          <Link to="/admin/messages" className="btn-secondary text-sm py-2 px-4">View Messages</Link>
          <Link to="/" target="_blank" className="btn-ghost text-sm py-2">View Public Site ↗</Link>
        </div>
      </div>

      {/* Recent content */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent research */}
        <Card>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-slate-900">Recent Research</h3>
            <Link to="/admin/research" className="text-sm text-primary-600 hover:text-primary-700">
              Manage →
            </Link>
          </div>
          <div className="space-y-3">
            {recentResearch.length === 0 && (
              <p className="text-slate-400 text-sm">No research projects yet.</p>
            )}
            {recentResearch.map(r => (
              <div key={r.id} className="flex items-start gap-3 py-2 border-b border-slate-50 last:border-0">
                <Badge color={r.status === 'published' ? 'green' : r.status === 'ongoing' ? 'amber' : 'blue'}>
                  {r.status}
                </Badge>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{r.title}</p>
                  <p className="text-xs text-slate-400">{r.year}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent publications */}
        <Card>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-slate-900">Recent Publications</h3>
            <Link to="/admin/publications" className="text-sm text-primary-600 hover:text-primary-700">
              Manage →
            </Link>
          </div>
          <div className="space-y-3">
            {recentPubs.length === 0 && (
              <p className="text-slate-400 text-sm">No publications yet.</p>
            )}
            {recentPubs.map(p => (
              <div key={p.id} className="flex items-start gap-3 py-2 border-b border-slate-50 last:border-0">
                <span className="text-lg">📄</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 line-clamp-1">{p.title}</p>
                  <p className="text-xs text-slate-400">{p.journal} · {p.year}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
