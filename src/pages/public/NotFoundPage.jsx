import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <motion.div
        className="text-center px-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-8xl mb-6">🔍</div>
        <h1 className="text-6xl font-bold gradient-text mb-4 font-display">404</h1>
        <h2 className="text-2xl font-semibold text-slate-900 mb-3">Page Not Found</h2>
        <p className="text-slate-500 mb-8 max-w-sm mx-auto">
          This page seems to have gone missing from our dataset.
        </p>
        <Link to="/" className="btn-primary">← Return Home</Link>
      </motion.div>
    </div>
  )
}
