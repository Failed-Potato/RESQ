import { CircleMarker, Popup, useMap } from 'react-leaflet'
import { useEffect } from 'react'
import { indiaMapRegions, northernIndiaHighlights } from '../data/indiaLocations.js'

export const INDIA_MAP_OVERVIEW = [31.6, 78.4]
export const INDIA_MAP_OVERVIEW_ZOOM = 5.4

export function IndiaRegionSelector({ value, onChange, className = '' }) {
  return (
    <label className={`flex items-center gap-2 ${className}`}>
      <span className="shrink-0 text-[8px] font-medium text-slate-500">Explore India</span>
      <select aria-label="Explore an India region" value={value} onChange={(event) => onChange(event.target.value)} className="h-8 min-w-0 max-w-[190px] rounded-lg border border-white/[0.08] bg-[#080e18] px-2 text-[9px] text-slate-300 outline-none focus:border-red-300/40">
        {indiaMapRegions.map((region) => <option key={region.value} value={region.value}>{region.label}</option>)}
      </select>
    </label>
  )
}

export function IndiaRegionFocus({ value }) {
  const map = useMap()

  useEffect(() => {
    const region = indiaMapRegions.find((item) => item.value === value)
    if (region) map.flyTo(region.coordinates, region.zoom, { duration: 0.55 })
  }, [map, value])

  return null
}

export function NorthernIndiaHighlights() {
  return northernIndiaHighlights.map((region) => (
    <CircleMarker
      key={region.label}
      center={region.coordinates}
      radius={7}
      pathOptions={{ color: '#fcd34d', weight: 2, fillColor: '#f59e0b', fillOpacity: 0.48 }}
    >
      <Popup>{region.label}<br />Regional focus point · not a state boundary</Popup>
    </CircleMarker>
  ))
}

