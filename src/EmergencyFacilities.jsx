import { useEffect, useMemo, useState } from 'react'
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Building2, Cross, Flame, MapPin, Navigation, Search, Shield, Siren } from 'lucide-react'
import PublicSafetyNav from './components/PublicSafetyNav.jsx'
import { INDIA_MAP_OVERVIEW, INDIA_MAP_OVERVIEW_ZOOM, IndiaRegionFocus, IndiaRegionSelector, NorthernIndiaHighlights } from './components/IndiaMapControls.jsx'
import { demonstrationFacilities, facilityCategories, getOpenStreetMapDirectionsUrl, getOpenStreetMapLocationUrl } from './data/publicSafetyData.js'

const facilityIcons = { hospital: Cross, police: Shield, fire: Flame }

function FacilityFocus({ facility }) {
  const map = useMap()

  useEffect(() => {
    if (facility) map.flyTo(facility.coordinates, 15, { duration: 0.5 })
  }, [facility, map])

  return null
}

export default function EmergencyFacilities() {
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(demonstrationFacilities[0].id)
  const [region, setRegion] = useState('north')

  useEffect(() => {
    document.title = 'RESQ — Nearby Facilities Demo'
  }, [])

  const visibleFacilities = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase()
    return demonstrationFacilities.filter((facility) => (
      (category === 'all' || facility.category === category)
      && (!normalizedQuery || `${facility.name} ${facility.neighborhood} ${facility.category}`.toLocaleLowerCase().includes(normalizedQuery))
    ))
  }, [category, query])

  useEffect(() => {
    if (!visibleFacilities.some((facility) => facility.id === selectedId)) {
      setSelectedId(visibleFacilities[0]?.id || '')
    }
  }, [selectedId, visibleFacilities])

  const selectedFacility = visibleFacilities.find((facility) => facility.id === selectedId) || visibleFacilities[0]

  return (
    <div className="command-shell min-h-screen text-white">
      <PublicSafetyNav current="/facilities" />
      <main className="mx-auto max-w-[1440px] px-4 pb-10 pt-6 sm:px-7 sm:pt-9">
        <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="page-intro facilities-intro mb-6 overflow-hidden rounded-[22px] border border-white/[0.07] bg-[linear-gradient(115deg,rgba(17,26,42,0.98),rgba(17,21,34,0.94)_65%,rgba(55,23,36,0.54))] p-5 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div className="max-w-3xl">
              <p className="mb-3 inline-flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-sky-200"><Building2 size={13} /> Nearby emergency facilities · demo</p>
              <h1 className="text-[clamp(2rem,5vw,3.3rem)] font-semibold leading-[1.05] tracking-[-0.06em] text-white">Explore the map<span className="text-slate-500">, verify before you go.</span></h1>
              <p className="mt-4 max-w-2xl text-xs leading-6 text-slate-400 sm:text-sm">Browse illustrative map points for hospitals, police, and fire facilities across India. These are not verified locations, and no service, hours, capacity, or availability is represented.</p>
            </div>
            <span className="rounded-lg border border-amber-300/20 bg-amber-300/[0.06] px-3 py-2 text-[9px] font-semibold uppercase tracking-wider text-amber-100">All markers are DEMO</span>
          </div>
        </motion.section>

        <div className="mb-4 grid gap-2 sm:grid-cols-[minmax(200px,1fr)_auto]">
          <label className="relative">
            <span className="sr-only">Search demo facilities</span>
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search demo facility markers" className="dashboard-field h-10 pl-9" />
          </label>
          <div className="flex gap-1.5 overflow-x-auto pb-1" aria-label="Filter facilities by type">
            {facilityCategories.map((item) => <button key={item.value} type="button" aria-pressed={category === item.value} onClick={() => setCategory(item.value)} className={`shrink-0 rounded-lg border px-3 py-2 text-[9px] font-medium transition ${category === item.value ? 'border-sky-300/20 bg-sky-300/[0.08] text-sky-100' : 'border-white/[0.07] text-slate-500 hover:bg-white/[0.04] hover:text-white'}`}>{item.label}</button>)}
          </div>
        </div>

        <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(340px,0.75fr)]">
          <section className="command-panel min-w-0 overflow-hidden" aria-labelledby="facility-map-title">
            <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-4 sm:px-5">
              <div><h2 id="facility-map-title" className="text-sm font-semibold text-white">Facility demonstration map</h2><p className="mt-1 text-[9px] text-slate-500">INDIA · OPENSTREETMAP · ILLUSTRATIVE ONLY</p></div>
              <div className="flex flex-wrap items-center justify-end gap-2">
                <IndiaRegionSelector value={region} onChange={setRegion} />
                <span className="rounded-md border border-white/[0.07] px-2 py-1 text-[8px] text-slate-400">{visibleFacilities.length} markers</span>
              </div>
            </div>
            <div className="relative h-[390px] sm:h-[520px]">
              <MapContainer center={INDIA_MAP_OVERVIEW} zoom={INDIA_MAP_OVERVIEW_ZOOM} scrollWheelZoom className="resq-leaflet-map" aria-label="Map of unverified demonstration emergency facilities across India">
                <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <IndiaRegionFocus value={region} />
                <NorthernIndiaHighlights />
                {visibleFacilities.map((facility) => {
                  const color = facility.category === 'hospital' ? '#fb7185' : facility.category === 'police' ? '#60a5fa' : '#fbbf24'
                  return <CircleMarker key={facility.id} center={facility.coordinates} radius={facility.id === selectedFacility?.id ? 9 : 7} pathOptions={{ color: '#fff', weight: 2, fillColor: color, fillOpacity: 0.95 }} eventHandlers={{ click: () => setSelectedId(facility.id) }}>
                    <Popup><span className="font-semibold">{facility.name}</span><br />DEMO · unverified</Popup>
                  </CircleMarker>
                })}
                <FacilityFocus facility={selectedFacility} />
              </MapContainer>
              <span className="pointer-events-none absolute bottom-3 left-3 z-[400] rounded-lg border border-white/10 bg-[#080d18]/90 px-3 py-2 text-[8px] text-amber-100 shadow-lg backdrop-blur">DEMO DATA · locations and services are unverified</span>
            </div>
          </section>

          <aside className="min-w-0 space-y-4">
            <section className="command-panel p-4 sm:p-5" aria-labelledby="facility-list-title">
              <div className="mb-3 flex items-center justify-between gap-2"><div><p className="text-[9px] font-semibold uppercase tracking-wider text-sky-200">Directory · demo data</p><h2 id="facility-list-title" className="mt-1 text-sm font-semibold text-white">Map markers</h2></div><Siren size={16} className="text-slate-500" /></div>
              <div className="max-h-[370px] space-y-2 overflow-y-auto pr-1">
                <AnimatePresence mode="popLayout">
                  {visibleFacilities.map((facility) => {
                    const Icon = facilityIcons[facility.category] || MapPin
                    const active = facility.id === selectedFacility?.id
                    return <motion.button key={facility.id} layout initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -5 }} type="button" aria-pressed={active} onClick={() => setSelectedId(facility.id)} className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition ${active ? 'border-sky-300/20 bg-sky-300/[0.045]' : 'border-white/[0.055] bg-[#080e18]/55 hover:border-white/[0.12]'}`}>
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-slate-300"><Icon size={15} /></span>
                      <span className="min-w-0 flex-1"><span className="block text-[9px] font-semibold text-slate-100">{facility.name}</span><span className="mt-1 block text-[8px] leading-4 text-slate-500">{facility.neighborhood}</span></span>
                    </motion.button>
                  })}
                </AnimatePresence>
                {visibleFacilities.length === 0 && <p className="rounded-xl border border-dashed border-white/[0.08] p-5 text-center text-[9px] text-slate-500">No demo markers match. Adjust the search or category.</p>}
              </div>
            </section>

            <AnimatePresence mode="wait">
              {selectedFacility && <motion.section key={selectedFacility.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="command-panel p-4 sm:p-5" aria-labelledby="facility-detail-title">
                <p className="text-[8px] font-semibold uppercase tracking-wider text-amber-200">Unverified demonstration record</p>
                <h2 id="facility-detail-title" className="mt-1 text-sm font-semibold text-white">{selectedFacility.name}</h2>
                <p className="mt-1 text-[9px] text-slate-500">{selectedFacility.neighborhood}</p>
                <p className="mt-3 text-[9px] leading-5 text-slate-400">{selectedFacility.details}</p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <a href={getOpenStreetMapLocationUrl(selectedFacility.coordinates)} target="_blank" rel="noreferrer" className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-white/[0.08] px-2 text-[8px] font-medium text-slate-300 transition hover:bg-white/[0.04]"><MapPin size={12} />View on OSM <ArrowUpRight size={10} /></a>
                  <a href={getOpenStreetMapDirectionsUrl(selectedFacility.coordinates)} target="_blank" rel="noreferrer" className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-white/[0.08] px-2 text-[8px] font-medium text-slate-300 transition hover:bg-white/[0.04]"><Navigation size={12} />Route preview <ArrowUpRight size={10} /></a>
                </div>
                <p className="mt-3 text-center text-[8px] leading-4 text-slate-600">Route preview uses a fixed demonstration origin. Verify locations and conditions independently.</p>
              </motion.section>}
            </AnimatePresence>
          </aside>
        </div>
      </main>
    </div>
  )
}
