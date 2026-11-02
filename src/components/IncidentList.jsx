import { Activity, CarFront, CloudRain, Flame, Search, ShieldAlert, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { formatIncidentTime, incidentCategories, incidentStatuses } from '../data/incidents.js'
import { indiaStates } from '../data/indiaLocations.js'

const severityClasses = {
  Critical: 'bg-red-400/10 text-red-200',
  High: 'bg-orange-400/10 text-orange-200',
  Moderate: 'bg-amber-300/10 text-amber-200',
  Low: 'bg-sky-300/10 text-sky-200',
}

const statusClasses = {
  Active: 'bg-red-400/10 text-red-300',
  Monitoring: 'bg-amber-300/10 text-amber-200',
  Resolved: 'bg-emerald-400/10 text-emerald-300',
}

const categoryIcons = {
  Medical: Activity,
  Fire: Flame,
  Traffic: CarFront,
  'Road Accident': CarFront,
  Weather: CloudRain,
  Flood: CloudRain,
  Cyclone: CloudRain,
  Earthquake: ShieldAlert,
  Landslide: ShieldAlert,
  Infrastructure: Zap,
  'Public Safety': ShieldAlert,
}

const categoryIconClasses = {
  Medical: 'bg-rose-400/10 text-rose-200',
  Fire: 'bg-orange-400/10 text-orange-200',
  Traffic: 'bg-amber-300/10 text-amber-200',
  Weather: 'bg-sky-300/10 text-sky-200',
  Infrastructure: 'bg-violet-300/10 text-violet-200',
}

export function IncidentCard({ incident, isSelected, onSelect }) {
  const CategoryIcon = categoryIcons[incident.category] || ShieldAlert

  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 7 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 12 }}
      transition={{ duration: 0.18 }}
      type="button"
      onClick={onSelect}
      aria-pressed={isSelected}
      className={`w-full rounded-xl border p-3.5 text-left transition ${
        isSelected
          ? 'border-red-400/30 bg-red-400/[0.06]'
          : 'border-white/[0.06] bg-[#0a111d] hover:border-white/[0.14] hover:bg-white/[0.035]'
      }`}
    >
      <div className="flex items-start gap-3">
        <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${categoryIconClasses[incident.category] || 'bg-white/[0.05] text-slate-300'}`}>
          <CategoryIcon size={16} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="truncate text-xs font-semibold text-slate-100">{incident.title}</span>
            <span className={`rounded-full px-2 py-0.5 text-[9px] font-medium ${severityClasses[incident.severity]}`}>
              {incident.severity}
            </span>
          </div>
          <p className="mt-1.5 truncate text-[11px] text-slate-500">{incident.location}</p>
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <span className="text-[10px] text-slate-400">{incident.category}</span>
            <span className="text-slate-700" aria-hidden="true">·</span>
            <span className={`rounded-full px-2 py-0.5 text-[9px] font-medium ${statusClasses[incident.status]}`}>
              {incident.status}
            </span>
            <span className="ml-auto text-[10px] text-slate-600">{formatIncidentTime(incident.reportedAt)}</span>
          </div>
        </div>
      </div>
    </motion.button>
  )
}

export default function IncidentList({
  incidents,
  visibleIncidents = incidents,
  selectedIncidentId,
  onSelectIncident,
  search,
  onSearchChange,
  category,
  onCategoryChange,
  status,
  onStatusChange,
  allIncidents = incidents,
  state,
  onStateChange,
  district,
  onDistrictChange,
}) {
  const observedStates = [...new Set(allIncidents.map((incident) => incident.state).filter(Boolean))]
  const stateOptions = [...new Set([...indiaStates, ...observedStates])].sort((left, right) => left.localeCompare(right, 'en-IN'))
  const districtOptions = [...new Set(allIncidents
    .filter((incident) => state === 'All states / UTs' || incident.state === state)
    .map((incident) => incident.district)
    .filter(Boolean))].sort((left, right) => left.localeCompare(right, 'en-IN'))

  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[#0d1523] p-4 sm:p-5" aria-labelledby="incident-list-title">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 id="incident-list-title" className="text-sm font-semibold text-white">Incident reports</h2>
          <p className="mt-1 text-[11px] text-slate-500">{visibleIncidents.length} of {incidents.length} matching reports</p>
        </div>
        <span className="font-mono text-[11px] tabular-nums text-slate-500">{visibleIncidents.length} shown</span>
      </div>

      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        <label>
          <span className="sr-only">Filter by Indian state or Union Territory</span>
          <select value={state} onChange={(event) => onStateChange(event.target.value)} aria-label="Filter by Indian state or Union Territory" className="h-9 w-full rounded-lg border border-white/[0.08] bg-[#080e18] px-3 text-[10px] text-slate-300 outline-none focus:border-red-400/40">
            <option value="All states / UTs">All states / UTs</option>
            {stateOptions.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label>
          <span className="sr-only">Filter by district</span>
          <select value={district} onChange={(event) => onDistrictChange(event.target.value)} aria-label="Filter by district" className="h-9 w-full rounded-lg border border-white/[0.08] bg-[#080e18] px-3 text-[10px] text-slate-300 outline-none focus:border-red-400/40">
            <option value="All districts">All districts</option>
            {districtOptions.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-[minmax(0,1fr)_145px]">
        <label className="relative block">
          <span className="sr-only">Search incidents</span>
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search reports or locations"
            className="h-10 w-full rounded-lg border border-white/[0.08] bg-[#080e18] pl-9 pr-3 text-xs text-white outline-none transition placeholder:text-slate-600 focus:border-red-400/40"
          />
        </label>
        <label>
          <span className="sr-only">Filter by category</span>
          <select
            value={category}
            onChange={(event) => onCategoryChange(event.target.value)}
            className="h-10 w-full rounded-lg border border-white/[0.08] bg-[#080e18] px-3 text-xs text-slate-300 outline-none focus:border-red-400/40"
          >
            {incidentCategories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
      </div>

      <div className="mt-3 flex gap-1 overflow-x-auto border-b border-white/[0.06] pb-2" aria-label="Filter by report status">
        {incidentStatuses.map((item) => {
          const count = item === 'All reports'
            ? incidents.length
            : item === 'Open reports'
              ? incidents.filter((incident) => incident.status !== 'Resolved').length
            : incidents.filter((incident) => incident.status === item).length
          return (
            <button
              key={item}
              type="button"
              onClick={() => onStatusChange(item)}
              aria-pressed={status === item}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[9px] font-medium transition ${
                status === item ? 'bg-white/[0.08] text-white' : 'text-slate-500 hover:bg-white/[0.04] hover:text-slate-300'
              }`}
            >
              {item}<span className="text-[8px] tabular-nums text-slate-600">{count}</span>
            </button>
          )
        })}
      </div>

      <div className="mt-3 max-h-[360px] space-y-2 overflow-y-auto pr-1">
        {visibleIncidents.length ? visibleIncidents.map((incident) => (
          <IncidentCard
            key={incident.id}
            incident={incident}
            isSelected={incident.id === selectedIncidentId}
            onSelect={() => onSelectIncident(incident.id)}
          />
        )) : (
          <p className="rounded-xl border border-dashed border-white/10 px-4 py-8 text-center text-xs text-slate-500">
            No simulated reports match the current search and status filters.
          </p>
        )}
      </div>
    </section>
  )
}
