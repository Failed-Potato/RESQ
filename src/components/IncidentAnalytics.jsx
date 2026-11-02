import { useMemo, useState } from 'react'
import { ArrowDownRight, ArrowUpRight, BarChart3 } from 'lucide-react'
import { motion } from 'framer-motion'
import { incidentCategories } from '../data/incidents.js'
const ranges = {
  '6H': { label: 'Last 6 hours', values: [1, 2, 2, 4, 3, 5, 4, 7, 6, 8, 5, 7] },
  '24H': { label: 'Last 24 hours', values: [2, 1, 3, 2, 4, 3, 7, 5, 8, 6, 4, 5] },
  '7D': { label: 'Last 7 days', values: [4, 6, 5, 8, 7, 10, 9, 6, 8, 11, 9, 12] },
}

const categoryColors = {
  Medical: '#fb7185',
  Fire: '#f97316',
  Traffic: '#fbbf24',
  'Road Accident': '#f59e0b',
  Weather: '#38bdf8',
  Cyclone: '#60a5fa',
  Flood: '#22d3ee',
  Earthquake: '#c084fc',
  Landslide: '#a3a3a3',
  Infrastructure: '#a78bfa',
  'Public Safety': '#34d399',
  Other: '#94a3b8',
}

function TrendChart({ incidents, range }) {
  const values = ranges[range].values
  const width = 560
  const height = 152
  const padding = { top: 14, right: 12, bottom: 24, left: 20 }
  const max = Math.max(...values) + 2
  const points = values.map((value, index) => ({
    x: padding.left + index * (width - padding.left - padding.right) / (values.length - 1),
    y: padding.top + (max - value) * (height - padding.top - padding.bottom) / max,
    value,
  }))
  const line = points.map((point, index) => `${index ? 'L' : 'M'} ${point.x} ${point.y}`).join(' ')
  const area = `${line} L ${points.at(-1).x} ${height - padding.bottom} L ${points[0].x} ${height - padding.bottom} Z`
  const labels = range === '7D'
    ? ['6 days ago', '4 days ago', '2 days ago', 'Now']
    : range === '6H'
      ? ['−6h', '−4.5h', '−3h', '−1.5h', 'Now']
      : ['00:00', '06:00', '12:00', '18:00', 'Now']

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between text-[9px] text-slate-600">
        <span>REPORT VOLUME</span>
        <span>{incidents.length} reports in current queue</span>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="mt-2 h-36 w-full overflow-visible" role="img" aria-label={`${ranges[range].label} simulated incident trend`}>
        <defs>
          <linearGradient id="incident-trend-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--resq-chart-line)" stopOpacity=".20" />
            <stop offset="100%" stopColor="var(--resq-chart-line)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 1, 2].map((lineIndex) => {
          const y = padding.top + lineIndex * (height - padding.top - padding.bottom) / 2
          return <line key={lineIndex} x1={padding.left} x2={width - padding.right} y1={y} y2={y} stroke="var(--resq-chart-grid)" />
        })}
        <path d={area} fill="url(#incident-trend-fill)" />
        <motion.path
          key={range}
          d={line}
          fill="none"
          stroke="var(--resq-chart-line)"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0.6 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.75, ease: 'easeOut' }}
        />
        {points.map((point, index) => (
          <g key={index}>
            <circle cx={point.x} cy={point.y} r={index === points.length - 1 ? 4 : 2.5} fill={index === points.length - 1 ? 'var(--resq-chart-line)' : 'var(--resq-chart-point)'} stroke="var(--resq-surface)" strokeWidth="2" />
            {index === points.length - 1 && <text x={point.x - 4} y={point.y - 12} fill="var(--resq-chart-label)" textAnchor="end" fontSize="10" fontWeight="600">{point.value}</text>}
          </g>
        ))}
        {labels.map((label, index) => (
          <text key={label} x={padding.left + index * (width - padding.left - padding.right) / (labels.length - 1)} y={height - 5} fill="var(--resq-chart-axis)" textAnchor={index === 0 ? 'start' : index === labels.length - 1 ? 'end' : 'middle'} fontSize="9">{label}</text>
        ))}
      </svg>
    </div>
  )
}

export default function IncidentAnalytics({ incidents, onCategoryChange }) {
  const [range, setRange] = useState('24H')
  const categoryCounts = useMemo(() => (
    incidentCategories.filter((category) => category !== 'All categories').map((category) => ({
      category,
      count: incidents.filter((incident) => incident.category === category).length,
      color: categoryColors[category] || '#94a3b8',
    }))
  ), [incidents])
  const highestCount = Math.max(1, ...categoryCounts.map((item) => item.count))
  const activeCount = incidents.filter((incident) => incident.status !== 'Resolved').length

  return (
    <section className="command-panel ops-analytics p-4 sm:p-5" aria-labelledby="analytics-title">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-400/[0.08] text-red-300"><BarChart3 size={17} /></span>
          <div>
            <h2 id="analytics-title" className="text-sm font-semibold text-white">Situation trends</h2>
            <p className="mt-1 text-[10px] text-slate-500">Illustrative reporting patterns · simulated</p>
          </div>
        </div>
        <div className="flex rounded-lg border border-white/[0.07] bg-[#080e18] p-1" aria-label="Trend time range">
          {Object.keys(ranges).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setRange(item)}
              aria-pressed={range === item}
              className={`rounded-md px-2.5 py-1.5 text-[9px] font-semibold transition ${range === item ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <TrendChart incidents={incidents} range={range} />

      <div className="mt-3 grid gap-5 border-t border-white/[0.06] pt-4 sm:grid-cols-[1fr_auto]">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">By category</p>
            <p className="text-[9px] text-slate-600">Select to filter queue</p>
          </div>
          <div className="space-y-2.5">
            {categoryCounts.map(({ category, count, color }) => (
              <button
                type="button"
                key={category}
                onClick={() => onCategoryChange(category)}
                className="group grid w-full grid-cols-[88px_1fr_20px] items-center gap-2 text-left"
                aria-label={`Filter incidents by ${category}`}
              >
                <span className="text-[10px] text-slate-400 transition group-hover:text-white">{category}</span>
                <span className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <motion.span
                    className="block h-full rounded-full"
                    style={{ backgroundColor: color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${count / highestCount * 100}%` }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                  />
                </span>
                <span className="text-right text-[10px] tabular-nums text-slate-500">{count}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex min-w-[105px] flex-col justify-center border-l border-white/[0.06] pl-5">
          <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-500">Active share</p>
          <div className="mt-2 flex items-center gap-1.5">
            <span className="text-2xl font-semibold tracking-tight text-white">{incidents.length ? Math.round(activeCount / incidents.length * 100) : 0}%</span>
            {activeCount >= incidents.length / 2
              ? <ArrowUpRight size={14} className="text-amber-300" />
              : <ArrowDownRight size={14} className="text-emerald-300" />}
          </div>
          <p className="mt-1 max-w-[105px] text-[9px] leading-4 text-slate-600">of current reports are open or monitoring</p>
        </div>
      </div>
    </section>
  )
}
