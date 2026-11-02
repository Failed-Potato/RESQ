import { Activity, CheckCircle2, Siren } from 'lucide-react'
import { motion } from 'framer-motion'

const cards = [
  { key: 'total', label: 'Total incidents', icon: Activity, tone: 'slate' },
  { key: 'active', label: 'Active incidents', icon: Siren, tone: 'red' },
  { key: 'resolved', label: 'Resolved incidents', icon: CheckCircle2, tone: 'green' },
]

const toneClasses = {
  slate: 'bg-slate-400/10 text-slate-300',
  red: 'bg-red-400/10 text-red-300',
  green: 'bg-emerald-400/10 text-emerald-300',
}

export default function DashboardStats({ incidents, status, onStatusChange }) {
  const values = {
    total: incidents.length,
    active: incidents.filter((incident) => incident.status !== 'Resolved').length,
    resolved: incidents.filter((incident) => incident.status === 'Resolved').length,
  }
  const filters = { total: 'All reports', active: 'Open reports', resolved: 'Resolved' }

  return (
    <section className="ops-stats grid grid-cols-1 gap-3 sm:grid-cols-3" aria-label="Incident statistics">
      {cards.map(({ key, label, icon: Icon, tone }) => (
        <button
          key={key}
          type="button"
          onClick={() => onStatusChange(filters[key])}
          aria-pressed={status === filters[key]}
          className={`ops-stat ops-stat-${key} group flex min-w-0 items-center gap-3 rounded-2xl border p-3.5 text-left transition sm:gap-4 sm:p-5 ${
            status === filters[key]
              ? 'border-red-300/25 bg-red-300/[0.06]'
              : 'border-white/[0.07] bg-[#0d1523] hover:border-white/[0.14] hover:bg-[#111b2b]'
          }`}
        >
          <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${toneClasses[tone]}`}>
            <Icon size={19} />
          </span>
          <div className="min-w-0">
            <motion.p key={values[key]} initial={{ opacity: 0.4, y: 4 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-semibold tracking-tight tabular-nums text-white">{values[key]}</motion.p>
            <p className="mt-0.5 text-xs text-slate-500">{label}</p>
          </div>
        </button>
      ))}
    </section>
  )
}
