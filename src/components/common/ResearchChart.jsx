import {
  LineChart, Line, AreaChart, Area,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { CHART_COLORS } from '@/constants'

/**
 * @typedef {'line'|'area'|'bar'} ChartType
 */

/**
 * Dynamic chart component for research visualization data
 * @param {{
 *   data: Array<Object>,
 *   type?: ChartType,
 *   dataKeys: string[],
 *   xKey?: string,
 *   height?: number,
 *   title?: string
 * }} props
 */
export function ResearchChart({ data, type = 'area', dataKeys, xKey = 'name', height = 280, title }) {
  if (!data || data.length === 0) return null

  const colors = [
    CHART_COLORS.primary,
    CHART_COLORS.secondary,
    CHART_COLORS.accent,
    CHART_COLORS.danger,
    CHART_COLORS.muted,
  ]

  const tooltipStyle = {
    backgroundColor: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    boxShadow: '0 4px 24px -4px rgba(0,0,0,0.1)',
    fontSize: '13px',
  }

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 5, right: 10, left: -10, bottom: 5 },
    }

    if (type === 'bar') {
      return (
        <BarChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey={xKey} tick={{ fontSize: 12, fill: '#94a3b8' }} />
          <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend />
          {dataKeys.map((key, i) => (
            <Bar key={key} dataKey={key} fill={colors[i % colors.length]} radius={[4, 4, 0, 0]} />
          ))}
        </BarChart>
      )
    }

    if (type === 'line') {
      return (
        <LineChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey={xKey} tick={{ fontSize: 12, fill: '#94a3b8' }} />
          <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend />
          {dataKeys.map((key, i) => (
            <Line key={key} type="monotone" dataKey={key} stroke={colors[i % colors.length]}
              strokeWidth={2} dot={{ r: 3 }} />
          ))}
        </LineChart>
      )
    }

    return (
      <AreaChart {...commonProps}>
        <defs>
          {dataKeys.map((key, i) => (
            <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors[i % colors.length]} stopOpacity={0.2} />
              <stop offset="95%" stopColor={colors[i % colors.length]} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey={xKey} tick={{ fontSize: 12, fill: '#94a3b8' }} />
        <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend />
        {dataKeys.map((key, i) => (
          <Area key={key} type="monotone" dataKey={key}
            stroke={colors[i % colors.length]} strokeWidth={2}
            fill={`url(#grad-${key})`} />
        ))}
      </AreaChart>
    )
  }

  return (
    <div>
      {title && <p className="text-sm font-medium text-slate-500 mb-3">{title}</p>}
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  )
}
