import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import { CircleMarker, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { LocateFixed, Layers2 } from 'lucide-react'
import { INDIA_MAP_OVERVIEW, INDIA_MAP_OVERVIEW_ZOOM, IndiaRegionFocus, IndiaRegionSelector, NorthernIndiaHighlights } from './IndiaMapControls.jsx'

const severityMarkerClasses = {
  Critical: 'incident-marker-critical',
  High: 'incident-marker-high',
  Moderate: 'incident-marker-moderate',
  Low: 'incident-marker-low',
}

function createIncidentIcon(incident, isSelected) {
  const markerClass = severityMarkerClasses[incident.severity] || severityMarkerClasses.Moderate
  const statusClass = incident.status === 'Resolved'
    ? ' incident-marker-resolved'
    : incident.status === 'Monitoring'
      ? ' incident-marker-monitoring'
      : ''
  const selectedClass = isSelected ? ' incident-marker-selected' : ''

  return L.divIcon({
    className: 'incident-marker-wrapper',
    html: `<span class="incident-marker ${markerClass}${statusClass}${selectedClass}"><span></span></span>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  })
}

function SelectedIncidentFocus({ incident }) {
  const map = useMap()

  useEffect(() => {
    if (incident) {
      map.flyTo(incident.coordinates, Math.max(map.getZoom(), 14), { duration: 0.6 })
    }
  }, [incident, map])

  return null
}

export default function IncidentMap({ incidents, selectedIncidentId, onSelectIncident }) {
  const mapRef = useRef(null)
  const [showDensity, setShowDensity] = useState(false)
  const [region, setRegion] = useState('north')
  const selectedIncident = incidents.find((incident) => incident.id === selectedIncidentId)

  return (
    <section className="command-panel w-full min-w-0 overflow-hidden" aria-labelledby="map-title">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-4 sm:px-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 id="map-title" className="text-sm font-semibold text-white">Geospatial incident view</h2>
            <span className="rounded-full border border-white/[0.07] px-2 py-0.5 text-[8px] font-semibold uppercase tracking-wider text-slate-500">{incidents.length} visible</span>
          </div>
          <p className="mt-1 text-[10px] text-slate-500">INDIA · OPENSTREETMAP · SIMULATED REPORTS</p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <IndiaRegionSelector value={region} onChange={setRegion} />
          <button
            type="button"
            aria-pressed={showDensity}
            onClick={() => setShowDensity((visible) => !visible)}
            className={`inline-flex h-8 items-center gap-2 rounded-lg border px-2.5 text-[10px] font-medium transition ${
              showDensity ? 'border-red-300/20 bg-red-300/[0.08] text-red-100' : 'border-white/[0.08] bg-white/[0.02] text-slate-400 hover:text-white'
            }`}
          >
            <Layers2 size={13} /> Density
          </button>
          <button
            type="button"
            onClick={() => {
              if (!mapRef.current) return
              mapRef.current.flyToBounds(incidents.map((incident) => incident.coordinates), { padding: [48, 48], maxZoom: 14, duration: 0.6 })
            }}
            disabled={!incidents.length}
            className="inline-flex h-8 items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.02] px-2.5 text-[10px] font-medium text-slate-400 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <LocateFixed size={13} /> Fit reports
          </button>
        </div>
      </div>
      <div className="relative h-[390px] sm:h-[500px]">
        <MapContainer
          center={INDIA_MAP_OVERVIEW}
          zoom={INDIA_MAP_OVERVIEW_ZOOM}
          scrollWheelZoom
          className="resq-leaflet-map"
          aria-label="Map of simulated emergency incidents across India"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapReady mapRef={mapRef} />
          <IndiaRegionFocus value={region} />
          <NorthernIndiaHighlights />
          {showDensity && incidents.map((incident) => (
            <CircleMarker
              key={`density-${incident.id}`}
              center={incident.coordinates}
              radius={incident.severity === 'Critical' ? 26 : incident.severity === 'High' ? 21 : 16}
              pathOptions={{ color: '#fb7185', weight: 1, fillColor: '#ef4444', fillOpacity: 0.13 }}
              interactive={false}
            />
          ))}
          {incidents.map((incident) => (
            <Marker
              key={incident.id}
              position={incident.coordinates}
              icon={createIncidentIcon(incident, incident.id === selectedIncidentId)}
              eventHandlers={{ click: () => onSelectIncident(incident.id) }}
              title={`${incident.severity} ${incident.category}: ${incident.title}`}
              alt={`${incident.severity} severity, ${incident.category}, ${incident.title}`}
            >
              <Popup>
                <div className="min-w-[155px]">
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-rose-300">{incident.severity} · {incident.category}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-100">{incident.title}</p>
                  <p className="mt-1 text-[10px] text-slate-400">{incident.location}</p>
                  <button type="button" className="mt-2 text-[10px] font-semibold text-rose-300 hover:text-rose-200" onClick={() => onSelectIncident(incident.id)}>
                    Open sample report →
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
          <SelectedIncidentFocus incident={selectedIncident} />
        </MapContainer>
        <div className="pointer-events-none absolute bottom-3 left-3 right-3 z-[400] flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-lg border border-white/10 bg-[#080d18]/90 px-3 py-2 text-[9px] text-slate-300 shadow-lg backdrop-blur">SIMULATION · gold circles are regional focus points, not boundaries</span>
          <span className="flex max-w-full flex-wrap items-center justify-end gap-x-3 gap-y-1 rounded-lg border border-white/10 bg-[#080d18]/90 px-3 py-2 text-[9px] text-slate-300 shadow-lg backdrop-blur">
            <span className="inline-flex items-center gap-1.5"><i className="h-1.5 w-1.5 rounded-full bg-red-400" />Active · high</span>
            <span className="inline-flex items-center gap-1.5"><i className="h-1.5 w-1.5 rounded-full bg-violet-400" />Monitoring</span>
            <span className="inline-flex items-center gap-1.5"><i className="h-1.5 w-1.5 rounded-full bg-amber-400" />Active · moderate</span>
            <span className="inline-flex items-center gap-1.5"><i className="h-1.5 w-1.5 rounded-full bg-sky-400" />Active · low</span>
            <span className="inline-flex items-center gap-1.5"><i className="h-1.5 w-1.5 rounded-full bg-slate-400" />Resolved</span>
          </span>
        </div>
      </div>
    </section>
  )
}

function MapReady({ mapRef }) {
  const map = useMap()

  useEffect(() => {
    mapRef.current = map
    return () => {
      mapRef.current = null
    }
  }, [map, mapRef])

  return null
}
