import { motion } from 'framer-motion'

/**
 * Animated stat counter card
 * @param {{
 *   value: string|number,
 *   label: string,
 *   icon: string,
 *   color?: 'blue'|'green'|'amber',
 *   delay?: number
 * }} props
 */
export function StatCard({ value, label, icon, color = 'blue', delay = 0 }) {
  const colorMap = {
    blue: 'from-primary-500 to-primary-600',
    green: 'from-emerald-500 to-emerald-600',
    amber: 'from-amber-500 to-amber-600',
  }

  return (
    <motion.div
      className="stat-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorMap[color]} flex items-center justify-center text-white text-lg`}>
        {icon}
      </div>
      <p className="text-3xl font-display font-bold text-slate-900">{value}</p>
      <p className="text-sm text-slate-500 font-medium">{label}</p>
    </motion.div>
  )
}
