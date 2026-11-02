import { useEffect, useMemo, useRef } from 'react'
import L from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { ArrowUpRight, LocateFixed, Minus, Plus } from 'lucide-react'
import { formatIndianEventTime } from '../data/earthquakeFeed.js'
import { INDIA_MAP_OVERVIEW, INDIA_MAP_OVERVIEW_ZOOM, IndiaRegionFocus, IndiaRegionSelector, NorthernIndiaHighlights } from './IndiaMapControls.jsx'

function getMagnitudeBand(magnitude) {
  if (magnitude >= 6) return 'high'
  if (magnitude >= 4.5) return 'moderate'
  return 'low'
}

function createEarthquakeIcon(event, isSelected) {
  const magnitudeBand = getMagnitudeBand(event.magnitude)
  const selected = isSelected ? ' quake-marker-selected' : ''
  const pulse = isSelected ? '<span class="quake-marker-pulse" aria-hidden="true"></span>' : ''

  return L.divIcon({
    className: 'quake-marker-wrapper',
    html: `<span class="quake-marker quake-marker-${magnitudeBand}${selected}"><span class="quake-marker-core"></span>${pulse}</span>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -13],
  })
}

function MapController({ mapRef, selectedEvent }) {
  const map = useMap()

  useEffect(() => {
    mapRef.current = map
    return () => {
      mapRef.current = null
    }
  }, [map, mapRef])

  useEffect(() => {
    if (selectedEvent) map.flyTo(selectedEvent.coordinates, Math.max(map.getZoom(), 7), { duration: 0.55 })
  }, [map, selectedEvent])

  return null
}

function EventInspector({ event }) {
  if (!event) {
    return (
      <div className="flex min-h-[190px] flex-col justify-center rounded-xl border border-dashed border-white/[0.08] p-4 text-center">
        <p className="text-[10px] font-semibold text-slate-300">Select a catalogue event</p>
        <p className="mt-1 text-[9px] leading-4 text-slate-600">Choose a marker or a filtered event card to inspect its source details.</p>
      </div>
    )
  }

  return (
    <article className="rounded-xl border border-violet-300/[0.12] bg-[#080e18]/70 p-4" aria-live="polite" aria-labelledby="selected-earthquake-title">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[8px] font-semibold uppercase tracking-[0.13em] text-violet-200/75">Selected source event</p>
          <h3 id="selected-earthquake-title" className="mt-1 text-sm font-semibold text-white">{event.place}</h3>
        </div>
        <span className={`shrink-0 rounded-lg border px-2.5 py-1.5 font-mono text-xs font-bold ${
          getMagnitudeBand(event.magnitude) === 'high'
            ? 'border-red-300/15 bg-red-300/[0.07] text-red-200'
            : getMagnitudeBand(event.magnitude) === 'moderate'
              ? 'border-amber-300/15 bg-amber-300/[0.07] text-amber-100'
              : 'border-emerald-300/15 bg-emerald-300/[0.06] text-emerald-200'
        }`}>M {event.magnitude.toFixed(1)}</span>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-3">
        <div><dt className="text-[8px] uppercase tracking-wider text-slate-600">Depth</dt><dd className="mt-1 text-[10px] text-slate-200">{event.depthKm} km</dd></div>
        <div><dt className="text-[8px] uppercase tracking-wider text-slate-600">Magnitude type</dt><dd className="mt-1 text-[10px] text-slate-200">{event.magnitudeType || 'Not provided'}</dd></div>
        <div><dt className="text-[8px] uppercase tracking-wider text-slate-600">Origin time</dt><dd className="mt-1 text-[10px] text-slate-200">{formatIndianEventTime(event.timestamp)} IST</dd></div>
        <div><dt className="text-[8px] uppercase tracking-wider text-slate-600">Coordinates</dt><dd className="mt-1 font-mono text-[9px] text-slate-200">{event.coordinates[0].toFixed(3)}, {event.coordinates[1].toFixed(3)}</dd></div>
      </dl>
      {event.eventUrl && (
        <a href={event.eventUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1.5 border-t border-white/[0.06] pt-3 text-[9px] font-semibold text-violet-200 transition hover:text-white">
          Open source event record <ArrowUpRight size={11} />
        </a>
      )}
      <p className="mt-2 text-[8px] leading-4 text-slate-600">{event.source}. Catalogue observation only; it is not an alert or an early-warning prediction.</p>
    </article>
  )
}

export default function SeismicVisualization({ events, selectedEventId, onSelectEvent, region, onRegionChange }) {
  const mapRef = useRef(null)
  const selectedEvent = events.find((event) => event.id === selectedEventId) || null
  const markers = useMemo(() => events.map((event) => ({
    event,
    isSelected: event.id === selectedEventId,
    icon: createEarthquakeIcon(event, event.id === selectedEventId),
  })), [events, selectedEventId])

  function resetView() {
    const map = mapRef.current
    if (!map) return
    if (selectedEvent) map.flyTo(selectedEvent.coordinates, INDIA_MAP_OVERVIEW_ZOOM, { duration: 0.5 })
    else map.flyTo(INDIA_MAP_OVERVIEW, INDIA_MAP_OVERVIEW_ZOOM, { duration: 0.5 })
  }

  return (
    <section className="seismic-workspace command-panel mb-5 overflow-hidden" aria-labelledby="seismic-map-title">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-4 sm:px-5">
        <div>
          <h2 id="seismic-map-title" className="text-sm font-semibold text-white">India-region seismic catalogue</h2>
          <p className="mt-1 text-[8px] text-slate-500">SOURCE EVENTS · OPENSTREETMAP · PAN AND ZOOM THE MAP</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <IndiaRegionSelector value={region} onChange={onRegionChange} />
          <button type="button" onClick={resetView} className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-white/[0.08] px-2.5 text-[9px] text-slate-300 transition hover:bg-white/[0.04]" aria-label="Reset seismic map view">
            <LocateFixed size={12} /> Reset view
          </button>
        </div>
      </div>

      <div className="grid gap-3 p-3 sm:p-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(270px,0.7fr)]">
        <div className="min-w-0">
          <div className="relative h-[380px] overflow-hidden rounded-xl border border-white/[0.06] sm:h-[500px]">
            <MapContainer center={INDIA_MAP_OVERVIEW} zoom={INDIA_MAP_OVERVIEW_ZOOM} scrollWheelZoom zoomControl className="resq-leaflet-map" aria-label="Interactive India-region earthquake catalogue map. Markers show sourced USGS events, not simulated incidents.">
              <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <IndiaRegionFocus value={region} />
              <NorthernIndiaHighlights />
              <MapController mapRef={mapRef} selectedEvent={selectedEvent} />
              {markers.map(({ event, isSelected, icon }) => (
                <Marker
                  key={event.id}
                  position={event.coordinates}
                  icon={icon}
                  title={`USGS source event: magnitude ${event.magnitude.toFixed(1)} · ${event.place}`}
                  eventHandlers={{ click: () => onSelectEvent(event.id) }}
                >
                  <Popup>
                    <strong>USGS catalogue event · M {event.magnitude.toFixed(1)}</strong><br />
                    {event.place}<br />
                    {event.depthKm} km deep · {formatIndianEventTime(event.timestamp)} IST<br />
                    Supplementary source record, not a RESQ incident.
                    {isSelected && <><br />Selected event</>}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
            <div className="pointer-events-none absolute bottom-2 left-2 z-[400] flex flex-wrap gap-1.5">
              <span className="rounded-md border border-white/10 bg-[#080d18]/90 px-2 py-1 text-[8px] text-slate-300">USGS supplementary catalogue</span>
              <span className="rounded-md border border-white/10 bg-[#080d18]/90 px-2 py-1 text-[8px] text-amber-100">Pulsing marker is a selection highlight only · no wavefront</span>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 px-1 text-[8px] text-slate-500" aria-label="Earthquake marker magnitude legend">
            <span className="inline-flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-emerald-300" />M &lt; 4.5</span>
            <span className="inline-flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-amber-300" />M 4.5–5.9</span>
            <span className="inline-flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-red-300" />M ≥ 6.0</span>
            <span>Marker size and color are visual encodings, not a hazard classification.</span>
          </div>
        </div>
        <div className="min-w-0">
          <EventInspector event={selectedEvent} />
          <div className="mt-3 flex items-center justify-between gap-2 rounded-lg border border-white/[0.06] bg-[#080e18]/65 px-3 py-2">
            <span className="text-[8px] text-slate-500">Map zoom</span>
            <span className="flex gap-1">
              <button type="button" onClick={() => mapRef.current?.zoomIn()} aria-label="Zoom seismic map in" className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-white/[0.08] text-slate-300 transition hover:bg-white/[0.06]"><Plus size={12} /></button>
              <button type="button" onClick={() => mapRef.current?.zoomOut()} aria-label="Zoom seismic map out" className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-white/[0.08] text-slate-300 transition hover:bg-white/[0.06]"><Minus size={12} /></button>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
