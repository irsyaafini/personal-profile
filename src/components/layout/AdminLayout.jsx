import { Outlet } from 'react-router-dom'
import { AdminSidebar } from './AdminSidebar'

/**
 * Layout wrapper for all admin dashboard pages
 */
export function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
