import { useEffect, useRef, useState } from 'react'
import { Activity, CheckCircle2, Clock3, MapPin, MessageSquareText, RotateCcw, ShieldCheck, UserRound } from 'lucide-react'
import { formatIncidentDate, formatIncidentTime, responseUnits } from '../data/incidents.js'

const severityClasses = {
  Critical: 'bg-red-400/10 text-red-200',
  High: 'bg-orange-400/10 text-orange-200',
  Moderate: 'bg-amber-300/10 text-amber-200',
  Low: 'bg-sky-300/10 text-sky-200',
}

export default function IncidentDetail({ incident, onStatusChange, onAssignUnit, onAddNote }) {
  const [showUpdate, setShowUpdate] = useState(false)
  const [note, setNote] = useState('')
  const updateTimeout = useRef(null)

  useEffect(() => {
    setShowUpdate(false)
    setNote('')
    return () => window.clearTimeout(updateTimeout.current)
  }, [incident?.id])

  if (!incident) {
    return (
      <section className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-white/[0.08] bg-[#0d1523] p-6 text-center">
        <ShieldCheck size={24} className="text-slate-600" />
        <h2 className="mt-3 text-sm font-semibold text-slate-300">No incident selected</h2>
        <p className="mt-1 text-xs text-slate-500">Adjust your search or category filter to view a sample report.</p>
      </section>
    )
  }

  const activity = (incident.activity?.length
    ? incident.activity
    : [{ id: `${incident.id}-reported`, title: 'Report received', details: incident.source, at: incident.reportedAt }]
  ).slice(-3).reverse()

  function updateStatus() {
    onStatusChange(incident.id, incident.status === 'Resolved' ? 'Active' : 'Resolved')
    setShowUpdate(true)
    window.clearTimeout(updateTimeout.current)
    updateTimeout.current = window.setTimeout(() => setShowUpdate(false), 3500)
  }

  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[#0d1523] p-4 sm:p-5" aria-labelledby="incident-detail-title">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-red-300">Selected report · {incident.id}</p>
          <h2 id="incident-detail-title" className="mt-2 text-base font-semibold leading-snug text-white">{incident.title}</h2>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium ${severityClasses[incident.severity]}`}>
          {incident.severity}
        </span>
      </div>

      <div className="mt-4 grid gap-2 text-[11px] text-slate-400 sm:grid-cols-2">
        <span className="inline-flex items-center gap-2"><MapPin size={13} className="text-slate-500" />{incident.location}</span>
        <span className="inline-flex items-center gap-2"><Clock3 size={13} className="text-slate-500" />{formatIncidentDate(incident.reportedAt)}</span>
      </div>
      {(incident.state || incident.district || incident.address || incident.pinCode) && (
        <div className="mt-2 rounded-lg border border-white/[0.05] bg-[#090f19] px-3 py-2 text-[9px] leading-4 text-slate-500">
          {[incident.address, incident.district, incident.state, incident.pinCode].filter(Boolean).join(' · ')}
        </div>
      )}
      <p className="mt-4 text-xs leading-5 text-slate-400">{incident.summary}</p>
      {incident.photo?.dataUrl && (
        <a
          href={incident.photo.dataUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-3 flex w-fit max-w-full items-center gap-3 rounded-xl border border-white/[0.07] bg-[#090f19] p-2 transition hover:border-white/[0.15]"
        >
          <img src={incident.photo.dataUrl} alt={`Citizen-submitted image for ${incident.title}`} className="h-14 w-16 rounded-lg object-cover" />
          <span>
            <span className="block text-[10px] font-medium text-slate-300">Citizen-submitted image</span>
            <span className="mt-1 block max-w-[190px] truncate text-[9px] text-slate-600">{incident.photo.name} · open full image</span>
          </span>
        </a>
      )}
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <label className="block rounded-xl border border-white/[0.06] bg-[#090f19] p-3">
          <span className="mb-1.5 flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wider text-slate-600"><UserRound size={11} /> Assigned demo unit</span>
          <select
            value={incident.assignedUnit || 'Unassigned'}
            onChange={(event) => onAssignUnit(incident.id, event.target.value)}
            className="w-full bg-transparent text-[11px] font-medium text-slate-200 outline-none"
            aria-label="Assign response unit"
          >
            <option value="Unassigned">Unassigned</option>
            {responseUnits.map((unit) => <option key={unit} value={unit}>{unit}</option>)}
          </select>
        </label>
        <div className="rounded-xl border border-white/[0.06] bg-[#090f19] p-3">
          <span className="mb-1.5 flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wider text-slate-600"><Activity size={11} /> Response state</span>
          <span className="text-[11px] font-medium text-slate-200">{incident.status}</span>
          <span className="ml-2 text-[9px] text-slate-600">· {incident.category}</span>
        </div>
      </div>

      <div className="mt-4 border-t border-white/[0.06] pt-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">Response timeline</h3>
          <span className="text-[9px] text-slate-600">SIMULATED ACTIVITY</span>
        </div>
        <ol className="space-y-3">
          {activity.map((entry, index) => (
              <li key={entry.id} className="flex gap-2.5">
                <span className={`relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                  index === 0 ? 'bg-red-400/10 text-red-300' : 'bg-white/[0.05] text-slate-500'
                }`}>
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {index < activity.length - 1 && <span className="absolute left-1/2 top-5 h-3 w-px -translate-x-1/2 bg-white/10" />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                    <p className="text-[10px] font-medium text-slate-300">{entry.title}</p>
                    <time className="text-[9px] text-slate-600">{formatIncidentTime(entry.at)}</time>
                  </div>
                  <p className="mt-0.5 break-words text-[9px] leading-4 text-slate-600">{entry.details}</p>
                </div>
              </li>
            ))}
        </ol>
      </div>

      <form
        className="mt-4 flex gap-2 border-t border-white/[0.06] pt-4"
        onSubmit={(event) => {
          event.preventDefault()
          if (!note.trim()) return
          onAddNote(incident.id, note.trim())
          setNote('')
        }}
      >
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">Add a simulated response note</span>
          <MessageSquareText size={13} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
          <input value={note} onChange={(event) => setNote(event.target.value)} maxLength={140} placeholder="Add a demo response note…" className="dashboard-field h-9 pl-9 text-[10px]" />
        </label>
        <button type="submit" disabled={!note.trim()} className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 text-[10px] font-semibold text-slate-300 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-40">Add note</button>
      </form>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] pt-4">
        <span className="text-[10px] text-slate-600">{incident.source} · demo only</span>
        <button
          type="button"
          onClick={updateStatus}
          className={incident.status === 'Resolved'
            ? 'button-outline !min-h-9 !rounded-lg !px-3 !text-[11px]'
            : 'button-primary !min-h-9 !rounded-lg !px-3 !text-[11px]'}
        >
          {incident.status === 'Resolved' ? <RotateCcw size={13} /> : <CheckCircle2 size={13} />}
          {incident.status === 'Resolved' ? 'Reopen demo report' : 'Mark resolved'}
        </button>
      </div>
      {showUpdate && (
        <p role="status" className="mt-3 text-[11px] text-emerald-300">
          Demo report status updated. No response team was contacted.
        </p>
      )}
    </section>
  )
}
