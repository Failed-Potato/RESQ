import { useEffect, useMemo, useRef, useState } from 'react'
import { Circle, CircleMarker, MapContainer, Popup, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { motion } from 'framer-motion'
import { AlertTriangle, ArrowUpRight, Check, ChevronRight, ClipboardCheck, Eye, EyeOff, MapPin, ShieldAlert } from 'lucide-react'
import PublicSafetyNav from './components/PublicSafetyNav.jsx'
import IndiaEarthquakeFeed, { useIndiaEarthquakeFeed } from './components/IndiaEarthquakeFeed.jsx'
import { INDIA_MAP_OVERVIEW, INDIA_MAP_OVERVIEW_ZOOM, IndiaRegionFocus, IndiaRegionSelector, NorthernIndiaHighlights } from './components/IndiaMapControls.jsx'
import SeismicVisualization from './components/SeismicVisualization.jsx'
import SimulatedSeismograph from './components/SimulatedSeismograph.jsx'
import { filterEarthquakeEvents } from './data/earthquakeFeed.js'
import { disasterCategories, disasterScenarios, evacuationChecklist } from './data/publicSafetyData.js'
import { useIncidents } from './data/incidentStore.js'

function ScenarioFocus({ scenario }) {
  const map = useMap()
  const initialRender = useRef(true)

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false
      return
    }
    if (scenario) map.flyTo(scenario.center, 9, { duration: 0.55 })
  }, [map, scenario])

  return null
}

export default function DisasterManagement() {
  const incidents = useIncidents()
  const earthquakeFeed = useIndiaEarthquakeFeed()
  const [category, setCategory] = useState('all')
  const [selectedId, setSelectedId] = useState(disasterScenarios[0].id)
  const [selectedEarthquakeId, setSelectedEarthquakeId] = useState('')
  const [minimumMagnitude, setMinimumMagnitude] = useState(2.5)
  const [timeRangeHours, setTimeRangeHours] = useState(24)
  const [region, setRegion] = useState('north')
  const [showZone, setShowZone] = useState(true)
  const [showIncidents, setShowIncidents] = useState(true)
  const [checked, setChecked] = useState([])

  useEffect(() => {
    document.title = 'RESQ — Disaster Management Demo'
  }, [])

  const visibleScenarios = useMemo(
    () => disasterScenarios.filter((scenario) => category === 'all' || scenario.category === category),
    [category],
  )
  const visibleEarthquakes = useMemo(
    () => filterEarthquakeEvents(earthquakeFeed.events, { minimumMagnitude, timeRangeHours }),
    [earthquakeFeed.events, minimumMagnitude, timeRangeHours],
  )

  useEffect(() => {
    if (!visibleScenarios.some((scenario) => scenario.id === selectedId)) {
      setSelectedId(visibleScenarios[0]?.id || '')
    }
  }, [selectedId, visibleScenarios])

  const selectedScenario = visibleScenarios.find((scenario) => scenario.id === selectedId) || visibleScenarios[0]
  const selectedEarthquake = visibleEarthquakes.find((event) => event.id === selectedEarthquakeId) || null
  useEffect(() => {
    if (selectedEarthquakeId && !selectedEarthquake) setSelectedEarthquakeId('')
  }, [selectedEarthquake, selectedEarthquakeId])
  const mappedIncidents = incidents.filter((incident) => (
    Array.isArray(incident.coordinates)
    && incident.coordinates.length === 2
    && incident.status !== 'Resolved'
  ))

  function chooseCategory(value) {
    setCategory(value)
    const firstScenario = disasterScenarios.find((scenario) => value === 'all' || scenario.category === value)
    setSelectedId(firstScenario?.id || '')
    setChecked([])
  }

  function toggleChecklist(index) {
    setChecked((items) => items.includes(index) ? items.filter((item) => item !== index) : [...items, index])
  }

  return (
    <div className="command-shell min-h-screen text-white">
      <PublicSafetyNav current="/disaster" />
      <main className="mx-auto max-w-[1440px] px-4 pb-10 pt-6 sm:px-7 sm:pt-9">
        <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="page-intro disaster-intro mb-6 overflow-hidden rounded-[22px] border border-white/[0.07] bg-[linear-gradient(115deg,rgba(17,26,42,0.98),rgba(17,21,34,0.94)_65%,rgba(55,23,36,0.54))] p-5 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div className="max-w-3xl">
              <p className="mb-3 inline-flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-amber-200"><AlertTriangle size={13} /> Disaster management · demo</p>
              <h1 className="text-[clamp(2rem,5vw,3.3rem)] font-semibold leading-[1.05] tracking-[-0.06em] text-white">Practice the plan<span className="text-slate-500">, not the panic.</span></h1>
              <p className="mt-4 max-w-2xl text-xs leading-6 text-slate-400 sm:text-sm">Explore tabletop hazard scenarios, rehearse preparedness actions, and view shared prototype reports. Nothing on this page is a live alert, assessed hazard zone, evacuation order, or shelter listing.</p>
            </div>
            <span className="rounded-lg border border-amber-300/20 bg-amber-300/[0.06] px-3 py-2 text-[9px] font-semibold uppercase tracking-wider text-amber-100">DEMO · not operational</span>
          </div>
        </motion.section>

        <IndiaEarthquakeFeed
          feed={earthquakeFeed}
          events={visibleEarthquakes}
          selectedEventId={selectedEarthquakeId}
          onSelectEvent={setSelectedEarthquakeId}
          minimumMagnitude={minimumMagnitude}
          onMinimumMagnitudeChange={setMinimumMagnitude}
          timeRangeHours={timeRangeHours}
          onTimeRangeChange={setTimeRangeHours}
        />

        <SeismicVisualization
          events={visibleEarthquakes}
          selectedEventId={selectedEarthquakeId}
          onSelectEvent={setSelectedEarthquakeId}
          region={region}
          onRegionChange={setRegion}
        />
        <SimulatedSeismograph />

        <div className="mb-4 flex gap-2 overflow-x-auto pb-1" aria-label="Filter disaster scenarios">
          {disasterCategories.map((item) => (
            <button key={item.value} type="button" aria-pressed={category === item.value} onClick={() => chooseCategory(item.value)} className={`shrink-0 rounded-lg border px-3 py-2 text-[9px] font-medium transition ${category === item.value ? 'border-red-300/20 bg-red-300/[0.08] text-red-100' : 'border-white/[0.07] text-slate-500 hover:bg-white/[0.04] hover:text-white'}`}>{item.label}</button>
          ))}
        </div>

        <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(340px,0.7fr)]">
          <section className="command-panel min-w-0 overflow-hidden" aria-labelledby="hazard-map-title">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-4 sm:px-5">
              <div>
                <h2 id="hazard-map-title" className="text-sm font-semibold text-white">Illustrative hazard visualization</h2>
                <p className="mt-1 text-[9px] text-slate-500">INDIA · OPENSTREETMAP · SCENARIO GEOMETRY ONLY</p>
              </div>
              <div className="flex gap-2">
                <IndiaRegionSelector value={region} onChange={setRegion} />
                <button type="button" aria-pressed={showZone} onClick={() => setShowZone((visible) => !visible)} className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-white/[0.08] px-2.5 text-[9px] text-slate-300 transition hover:bg-white/[0.04]">{showZone ? <Eye size={12} /> : <EyeOff size={12} />} Zone</button>
                <button type="button" aria-pressed={showIncidents} onClick={() => setShowIncidents((visible) => !visible)} className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-white/[0.08] px-2.5 text-[9px] text-slate-300 transition hover:bg-white/[0.04]">{showIncidents ? <Eye size={12} /> : <EyeOff size={12} />} Reports</button>
              </div>
            </div>
            <div className="relative h-[360px] sm:h-[480px]">
              <MapContainer center={INDIA_MAP_OVERVIEW} zoom={INDIA_MAP_OVERVIEW_ZOOM} scrollWheelZoom className="resq-leaflet-map" aria-label="Illustrative India map with simulated disaster scenarios, sourced earthquake events, and shared prototype reports">
                <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <IndiaRegionFocus value={region} />
                <NorthernIndiaHighlights />
                {selectedScenario && showZone && <Circle center={selectedScenario.center} radius={selectedScenario.radius} pathOptions={{ color: selectedScenario.color, weight: 2, dashArray: '7 6', fillColor: selectedScenario.color, fillOpacity: 0.17 }} />}
                {selectedScenario && <CircleMarker center={selectedScenario.center} radius={8} pathOptions={{ color: '#fff', weight: 2, fillColor: selectedScenario.color, fillOpacity: 1 }}><Popup><strong>{selectedScenario.title}</strong><br />DEMO scenario point · not a real alert</Popup></CircleMarker>}
                {showIncidents && mappedIncidents.map((incident) => (
                  <CircleMarker key={incident.id} center={incident.coordinates} radius={6} pathOptions={{ color: '#fff', weight: 1, fillColor: '#f87171', fillOpacity: 0.9 }}>
                    <Popup><strong>{incident.id} · {incident.title}</strong><br />Shared prototype incident · {incident.status}<br />No live response connection</Popup>
                  </CircleMarker>
                ))}
                {selectedScenario && <ScenarioFocus scenario={selectedScenario} />}
              </MapContainer>
              <div className="pointer-events-none absolute bottom-3 left-3 right-3 z-[400] flex flex-wrap items-center justify-between gap-2">
                <span className="rounded-lg border border-white/10 bg-[#080d18]/90 px-3 py-2 text-[8px] text-amber-100 shadow-lg backdrop-blur">SIMULATION · hazard zone is illustrative, not assessed</span>
                <span className="rounded-lg border border-white/10 bg-[#080d18]/90 px-3 py-2 text-[8px] text-slate-300 shadow-lg backdrop-blur">Simulated reports: {mappedIncidents.length} · Retrieved USGS events: {earthquakeFeed.events.length}</span>
              </div>
            </div>
            <div className="grid gap-2 border-t border-white/[0.06] p-3 sm:grid-cols-2">
              {visibleScenarios.map((scenario) => (
                <button key={scenario.id} type="button" onClick={() => { setSelectedId(scenario.id); setChecked([]) }} aria-pressed={scenario.id === selectedScenario?.id} className={`rounded-xl border p-3 text-left transition ${scenario.id === selectedScenario?.id ? 'border-white/15 bg-white/[0.045]' : 'border-white/[0.05] hover:bg-white/[0.025]'}`}>
                  <span className="flex items-center justify-between gap-2"><span className="text-[8px] font-semibold uppercase tracking-wider text-slate-500">{scenario.categoryLabel} · DEMO</span><ChevronRight size={13} className="text-slate-600" /></span>
                  <span className="mt-1 block text-[10px] font-semibold text-slate-200">{scenario.title}</span>
                </button>
              ))}
            </div>
          </section>

          <aside className="min-w-0 space-y-4">
            {selectedScenario && <motion.section key={selectedScenario.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="command-panel p-4 sm:p-5" aria-labelledby="scenario-detail-title">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-amber-200">{selectedScenario.categoryLabel} · scenario preview</p>
                    <h2 id="scenario-detail-title" className="mt-1 text-base font-semibold text-white">{selectedScenario.title}</h2>
                  </div>
                  <span className="shrink-0 rounded-md border border-amber-300/10 bg-amber-300/[0.04] px-2 py-1 text-[8px] text-amber-100">{selectedScenario.severity} · DEMO</span>
                </div>
                <p className="mt-3 text-[10px] leading-5 text-slate-400">{selectedScenario.description}</p>
                <div className="mt-3 rounded-xl border border-white/[0.06] bg-[#080e18]/65 p-3">
                  <p className="flex items-center gap-1.5 text-[8px] font-semibold uppercase tracking-wider text-slate-500"><MapPin size={11} />Illustrative area</p>
                  <p className="mt-1 text-[9px] text-slate-300">{selectedScenario.affectedArea}</p>
                  <p className="mt-2 text-[8px] leading-4 text-slate-600">{selectedScenario.responseFocus}</p>
                </div>
              </motion.section>}

            <section className="command-panel p-4 sm:p-5" aria-labelledby="evacuation-title">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-300/[0.08] text-red-200"><ShieldAlert size={16} /></span>
                <div><h2 id="evacuation-title" className="text-sm font-semibold text-white">Evacuation readiness</h2><p className="mt-1 text-[8px] leading-4 text-slate-500">Preparedness prompts only. No shelter or route availability is claimed.</p></div>
              </div>
              <div className="mt-3 space-y-1">
                {evacuationChecklist.map((item, index) => {
                  const isChecked = checked.includes(index)
                  return <button key={item} type="button" aria-pressed={isChecked} onClick={() => toggleChecklist(index)} className="flex w-full items-start gap-2.5 rounded-lg p-2 text-left transition hover:bg-white/[0.025]">
                    <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${isChecked ? 'border-emerald-300/50 bg-emerald-300/15 text-emerald-200' : 'border-white/15 text-transparent'}`}>{isChecked && <Check size={10} />}</span>
                    <span className={`text-[9px] leading-4 ${isChecked ? 'text-slate-500 line-through' : 'text-slate-300'}`}>{item}</span>
                  </button>
                })}
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-3">
                <span className="inline-flex items-center gap-1.5 text-[8px] text-slate-600"><ClipboardCheck size={11} />{checked.length}/{evacuationChecklist.length} prepared</span>
                <a href="/safety" className="inline-flex items-center gap-1 text-[8px] font-semibold text-red-200 hover:text-white">Safety guides <ArrowUpRight size={11} /></a>
              </div>
            </section>
            <a href="/facilities" className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.02] p-3 text-[9px] text-slate-300 transition hover:border-white/[0.14] hover:bg-white/[0.04]"><span>View demo emergency facility map</span><ChevronRight size={13} className="text-slate-500" /></a>
            <a href="https://ndma.gov.in/" target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-xl border border-emerald-300/10 bg-emerald-300/[0.025] p-3 text-[9px] text-emerald-100/80 transition hover:bg-emerald-300/[0.05]"><span>National Disaster Management Authority · official guidance</span><ChevronRight size={13} /></a>
          </aside>
        </div>
      </main>
    </div>
  )
}
