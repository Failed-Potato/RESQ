import { useCallback, useEffect, useState } from 'react'
import { ArrowUpRight, CircleAlert, ExternalLink, RefreshCw, RadioTower } from 'lucide-react'
import { motion } from 'framer-motion'
import {
  EARTHQUAKE_TIME_RANGES,
  fetchIndiaEarthquakeEvents,
  formatIndianEventTime,
  NCS_EARTHQUAKE_URL,
  NCS_HOME_URL,
  USGS_EARTHQUAKE_SOURCE,
} from '../data/earthquakeFeed.js'

export function useIndiaEarthquakeFeed() {
  const [events, setEvents] = useState([])
  const [fetchedAt, setFetchedAt] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const currentEvents = await fetchIndiaEarthquakeEvents()
      setEvents(currentEvents)
      setFetchedAt(Date.now())
    } catch (feedError) {
      setError(feedError.message || 'The supplementary earthquake feed could not be loaded.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
    const intervalId = window.setInterval(refresh, 5 * 60 * 1000)
    return () => window.clearInterval(intervalId)
  }, [refresh])

  return { events, fetchedAt, isLoading, error, refresh }
}

export default function IndiaEarthquakeFeed({
  feed,
  events,
  selectedEventId,
  onSelectEvent,
  minimumMagnitude,
  onMinimumMagnitudeChange,
  timeRangeHours,
  onTimeRangeChange,
}) {
  const selectedEvent = events.find((event) => event.id === selectedEventId)

  return (
    <section className="mb-5 overflow-hidden rounded-2xl border border-violet-300/[0.12] bg-[linear-gradient(145deg,rgba(28,27,51,0.68),rgba(12,18,31,0.98)_65%)]" aria-labelledby="india-earthquake-feed-title">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/[0.06] p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-300/[0.09] text-violet-200"><RadioTower size={16} /></span>
          <div>
            <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-violet-200">Earthquake catalogue · separate from simulated incidents</p>
            <h2 id="india-earthquake-feed-title" className="mt-1 text-sm font-semibold text-white">India-region earthquake events</h2>
            <p className="mt-1 max-w-3xl text-[9px] leading-4 text-slate-500">NCS, Government of India, is the primary Indian source. A reliable machine-readable current NCS feed could not be confirmed, so these retrieved records are explicitly supplementary USGS global-catalogue results in an India-region bounding box.</p>
          </div>
        </div>
        <button type="button" onClick={feed.refresh} disabled={feed.isLoading} className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-white/[0.08] px-2.5 text-[9px] font-medium text-slate-300 transition hover:bg-white/[0.04] disabled:cursor-wait disabled:opacity-50">
          <RefreshCw size={12} className={feed.isLoading ? 'animate-spin' : ''} />{feed.isLoading ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      <div className="grid gap-3 p-4 sm:p-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(245px,0.65fr)]">
        <div>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <p className="text-[8px] font-semibold uppercase tracking-wider text-slate-500">{USGS_EARTHQUAKE_SOURCE} · source query: last 30 days · magnitude ≥ 2.5</p>
            {feed.fetchedAt && <p className="text-[8px] text-slate-600">Retrieved {formatIndianEventTime(feed.fetchedAt)} IST</p>}
          </div>
          {feed.error && <p role="alert" className="mb-2 flex items-start gap-1.5 rounded-lg border border-amber-300/10 bg-amber-300/[0.035] p-2 text-[8px] leading-4 text-amber-100/80"><CircleAlert size={11} className="mt-0.5 shrink-0" />{feed.error}{feed.fetchedAt ? ' Showing the last successfully retrieved source records.' : ' No earthquake records are being fabricated or shown as a fallback.'}</p>}
          {feed.isLoading && feed.events.length === 0 ? (
            <div className="flex min-h-20 items-center gap-2 rounded-xl border border-white/[0.05] bg-[#080e18]/50 p-3 text-[9px] text-slate-500"><RefreshCw size={12} className="animate-spin" />Fetching sourced records…</div>
          ) : feed.events.length > 0 ? (
            <>
              <div className="mb-3 grid gap-3 rounded-xl border border-white/[0.05] bg-[#080e18]/55 p-3 sm:grid-cols-[minmax(160px,1fr)_auto] sm:items-end">
                <label className="block">
                  <span className="mb-1.5 flex items-center justify-between text-[8px] font-medium text-slate-400">
                    <span>Minimum magnitude</span>
                    <span className="font-mono text-violet-100">M {minimumMagnitude.toFixed(1)}+</span>
                  </span>
                  <input
                    type="range"
                    min="2.5"
                    max="7"
                    step="0.1"
                    value={minimumMagnitude}
                    onChange={(event) => onMinimumMagnitudeChange(Number(event.target.value))}
                    aria-label="Minimum earthquake magnitude"
                    className="w-full accent-violet-300"
                  />
                </label>
                <div>
                  <span className="mb-1.5 block text-[8px] font-medium text-slate-400">Event time window</span>
                  <div className="flex gap-1" role="group" aria-label="Filter earthquake events by time">
                    {EARTHQUAKE_TIME_RANGES.map((range) => (
                      <button
                        key={range.value}
                        type="button"
                        aria-pressed={timeRangeHours === range.value}
                        onClick={() => onTimeRangeChange(range.value)}
                        className={`rounded-md border px-2 py-1.5 font-mono text-[8px] font-semibold transition ${
                          timeRangeHours === range.value
                            ? 'border-violet-300/25 bg-violet-300/[0.1] text-violet-100'
                            : 'border-white/[0.06] text-slate-500 hover:bg-white/[0.04] hover:text-slate-200'
                        }`}
                      >{range.label}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mb-2 flex items-center justify-between text-[8px] text-slate-500" aria-live="polite">
                <span>{events.length} of {feed.events.length} retrieved events match</span>
                <span>Filtered events sort newest first</span>
              </div>
              {events.length > 0 ? <div className="grid gap-2 sm:grid-cols-2">
              {events.slice(0, 8).map((event) => (
                <motion.button key={event.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} type="button" onClick={() => onSelectEvent(event.id)} aria-pressed={selectedEvent?.id === event.id} className={`rounded-xl border p-3 text-left transition ${selectedEvent?.id === event.id ? 'border-violet-300/25 bg-violet-300/[0.055]' : 'border-white/[0.055] bg-[#080e18]/55 hover:border-white/[0.12]'}`}>
                  <span className="flex items-center justify-between gap-2"><span className="text-[10px] font-semibold text-violet-100">M {event.magnitude.toFixed(1)}{event.magnitudeType ? ` · ${event.magnitudeType}` : ''}</span><span className="text-[8px] text-slate-500">{event.depthKm} km deep</span></span>
                  <span className="mt-1 block text-[9px] leading-4 text-slate-300">{event.place}</span>
                  <time className="mt-1 block text-[8px] text-slate-600">{formatIndianEventTime(event.timestamp)} IST</time>
                </motion.button>
              ))}
              </div> : <p className="rounded-xl border border-dashed border-white/[0.08] p-4 text-[9px] leading-4 text-slate-500">No retrieved events match these filters. Adjust the magnitude or time range; no demo events are substituted.</p>}
            </>
          ) : (
            !feed.isLoading && <p className="rounded-xl border border-dashed border-white/[0.08] p-4 text-[9px] leading-4 text-slate-500">The supplementary source returned no events for the queried region and time window. This is not a statement that no earthquakes occurred; consult NCS for official Indian information.</p>
          )}
        </div>

        <aside className="rounded-xl border border-white/[0.06] bg-[#080e18]/55 p-3">
          <p className="text-[8px] font-semibold uppercase tracking-wider text-slate-500">Official Indian sources</p>
          <a href={NCS_EARTHQUAKE_URL} target="_blank" rel="noreferrer" className="mt-2 flex items-center justify-between gap-2 rounded-lg border border-emerald-300/10 bg-emerald-300/[0.035] px-3 py-2.5 text-[9px] font-medium text-emerald-100 transition hover:bg-emerald-300/[0.07]">
            <span>National Centre for Seismology · RISEQ</span><ExternalLink size={11} />
          </a>
          <a href={NCS_HOME_URL} target="_blank" rel="noreferrer" className="mt-1.5 flex items-center justify-between gap-2 px-2 py-2 text-[8px] text-slate-400 transition hover:text-white">
            NCS, Government of India <ArrowUpRight size={10} />
          </a>
          {selectedEvent?.eventUrl && <a href={selectedEvent.eventUrl} target="_blank" rel="noreferrer" className="mt-1.5 flex items-center justify-between gap-2 border-t border-white/[0.06] px-2 pt-2 text-[8px] text-violet-200 transition hover:text-white">
            Open selected USGS source record <ArrowUpRight size={10} />
          </a>}
          <p className="mt-2 border-t border-white/[0.06] pt-2 text-[8px] leading-4 text-slate-600">USGS is an alternative supplementary global provider, not an NCS feed. Event coordinates, magnitude, depth, time, and source link are taken from the retrieved source response. These events are never inserted into the simulated incident store.</p>
        </aside>
      </div>
    </section>
  )
}
