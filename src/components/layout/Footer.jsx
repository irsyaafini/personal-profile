import { Link } from 'react-router-dom'
import { NAV_LINKS } from '@/constants'

/**
 * Public site footer
 */
export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="container-section py-14">
        <div className="grid md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="space-y-3">
            <p className="font-display font-bold text-white text-lg">Dr. Sarah Chen</p>
            <p className="text-sm leading-relaxed text-slate-400">
              Epidemiologist & Public Health Researcher specializing in
              infectious disease surveillance and data-driven insights.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Navigation</p>
            <div className="flex flex-col gap-2">
              {NAV_LINKS.map(({ label, path }) => (
                <Link key={path} to={path}
                  className="text-sm text-slate-400 hover:text-primary-400 transition-colors w-fit">
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contact</p>
            <div className="space-y-2 text-sm text-slate-400">
              <p>sarah.chen@epidemio.org</p>
              <p>Geneva, Switzerland</p>
              <div className="flex gap-3 pt-2">
                <a href="#" className="hover:text-primary-400 transition-colors">ORCID</a>
                <a href="#" className="hover:text-primary-400 transition-colors">LinkedIn</a>
                <a href="#" className="hover:text-primary-400 transition-colors">ResearchGate</a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-slate-500">
          <p>© {year} Dr. Sarah Chen. All rights reserved.</p>
          <Link to="/admin/login" className="hover:text-slate-400 transition-colors">Admin</Link>
        </div>
      </div>
    </footer>
  )
}
