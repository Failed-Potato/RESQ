import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, CheckCircle2, Clock3, MapPin, Search, ShieldCheck } from 'lucide-react'
import { formatIncidentDate } from '../data/incidents.js'

function statusPresentation(status, language) {
  if (status === 'Resolved') return { label: language === 'hi' ? 'समाधान हुआ' : 'Resolved', detail: language === 'hi' ? 'कमांड सेंटर डेमो में यह रिपोर्ट समाधान के रूप में दर्ज है।' : 'The command-centre demo marks this report resolved.', color: 'text-emerald-300', bg: 'bg-emerald-300' }
  if (status === 'Monitoring') return { label: language === 'hi' ? 'समीक्षा में' : 'Under review', detail: language === 'hi' ? 'कमांड सेंटर कार्यप्रवाह में इस नमूना रिपोर्ट की समीक्षा हो रही है।' : 'This sample report is being reviewed in the command-centre workflow.', color: 'text-amber-200', bg: 'bg-amber-300' }
  return { label: language === 'hi' ? 'प्राप्त हुई' : 'Received', detail: language === 'hi' ? 'यह नमूना रिपोर्ट कमांड सेंटर सूची में दिखाई देती है।' : 'This sample report is visible in the command-centre queue.', color: 'text-red-200', bg: 'bg-red-400' }
}

export default function CitizenTracking({ incidents, initialTrackingId = '', onTracking, language = 'en' }) {
  const [query, setQuery] = useState(initialTrackingId)
  const [activeId, setActiveId] = useState(initialTrackingId)
  const [hasSearched, setHasSearched] = useState(Boolean(initialTrackingId))

  useEffect(() => {
    if (!initialTrackingId) return
    setQuery(initialTrackingId)
    setActiveId(initialTrackingId)
    setHasSearched(true)
  }, [initialTrackingId])

  const incident = useMemo(() => (
    incidents.find((item) => item.trackingId?.toLowerCase() === activeId.trim().toLowerCase()
      || item.id.toLowerCase() === activeId.trim().toLowerCase())
  ), [activeId, incidents])
  const status = incident ? statusPresentation(incident.status, language) : null
  const citizenReports = incidents
    .filter((item) => item.reporterType === 'citizen')
    .slice(0, 4)

  function searchTracking(event) {
    event.preventDefault()
    const normalized = query.trim().toUpperCase()
    setActiveId(normalized)
    setHasSearched(true)
    onTracking?.(normalized)
  }

  return (
    <section id="tracking" className="command-panel scroll-mt-24 p-4 sm:p-5" aria-labelledby="tracking-title">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-300/[0.09] text-sky-200"><Search size={16} /></span>
        <div>
          <h2 id="tracking-title" className="text-sm font-semibold text-white">{language === 'hi' ? 'रिपोर्ट की स्थिति देखें' : 'Track a report'}</h2>
          <p className="mt-1 text-[9px] leading-4 text-slate-500">{language === 'hi' ? 'जमा करने के बाद मिला संदर्भ दर्ज करें। स्थिति कमांड सेंटर डेमो से सिंक होती है।' : 'Enter the reference shown after submitting. Status syncs with the command-centre demo.'}</p>
        </div>
      </div>

      <form className="mt-4 flex gap-2" onSubmit={searchTracking}>
        <label className="min-w-0 flex-1">
          <span className="sr-only">Incident tracking ID</span>
          <input required value={query} onChange={(event) => setQuery(event.target.value)} placeholder={language === 'hi' ? 'जैसे RQ-1043' : 'e.g. RQ-1043'} className="dashboard-field h-10 font-mono uppercase tracking-wider" />
        </label>
        <button type="submit" className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 text-[10px] font-semibold text-slate-200 transition hover:bg-white/[0.08]">
          {language === 'hi' ? 'ट्रैक करें' : 'Track'} <ArrowRight size={13} />
        </button>
      </form>

      {hasSearched && (
        incident ? (
          <article className="mt-4 rounded-xl border border-white/[0.07] bg-[#090f19] p-3.5" aria-live="polite">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-mono text-[9px] font-semibold tracking-wider text-slate-500">{incident.trackingId || incident.id}</p>
                <h3 className="mt-1 text-xs font-semibold text-slate-100">{incident.title}</h3>
              </div>
              <span className={`inline-flex items-center gap-1.5 rounded-full border border-white/[0.06] px-2.5 py-1 text-[9px] font-semibold ${status.color}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${status.bg}`} />{status.label}
              </span>
            </div>
            <p className="mt-2 text-[10px] leading-4 text-slate-500">{status.detail}</p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 border-t border-white/[0.06] pt-3 text-[9px] text-slate-500">
              <span className="inline-flex items-center gap-1.5"><MapPin size={11} />{incident.location}</span>
              <span className="inline-flex items-center gap-1.5"><Clock3 size={11} />{formatIncidentDate(incident.reportedAt)}</span>
            </div>
            {incident.activity?.length > 0 && (
              <div className="mt-3 flex items-start gap-2 rounded-lg bg-white/[0.025] px-2.5 py-2">
                <CheckCircle2 size={12} className="mt-0.5 shrink-0 text-emerald-300/80" />
                <p className="min-w-0 text-[9px] leading-4 text-slate-400">
                  Latest update: {incident.activity[incident.activity.length - 1].title}
                  <span className="block text-slate-600">{formatIncidentDate(incident.activity[incident.activity.length - 1].at)}</span>
                </p>
              </div>
            )}
          </article>
        ) : (
          <p role="status" className="mt-4 rounded-xl border border-amber-300/10 bg-amber-300/[0.035] p-3 text-[10px] leading-4 text-amber-100/80">
            No report matches that reference in this browser’s shared prototype data.
          </p>
        )
      )}

      {citizenReports.length > 0 && (
        <div className="mt-4 border-t border-white/[0.06] pt-3">
          <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-600">Recent reports on this device</p>
          <div className="flex flex-wrap gap-1.5">
            {citizenReports.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => {
                  setQuery(item.trackingId || item.id)
                  setActiveId(item.trackingId || item.id)
                  setHasSearched(true)
                  onTracking?.(item.trackingId || item.id)
                }}
                className={`rounded-md border px-2 py-1.5 font-mono text-[9px] transition ${
                  activeId === item.id ? 'border-red-300/20 bg-red-300/[0.06] text-red-100' : 'border-white/[0.06] text-slate-400 hover:border-white/[0.12] hover:text-white'
                }`}
              >
                {item.trackingId || item.id}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="mt-3 flex items-center gap-1.5 text-[9px] text-slate-600"><ShieldCheck size={11} />{language === 'hi' ? 'केवल प्रोटोटाइप स्थिति; वास्तविक सेवा अपडेट नहीं।' : 'Prototype status only; not a live service update.'}</p>
    </section>
  )
}
