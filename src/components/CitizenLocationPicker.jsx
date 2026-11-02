import { useEffect, useState } from 'react'
import { CircleMarker, MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Crosshair, MapPin } from 'lucide-react'
import { INDIA_MAP_OVERVIEW, INDIA_MAP_OVERVIEW_ZOOM, IndiaRegionFocus, IndiaRegionSelector, NorthernIndiaHighlights } from './IndiaMapControls.jsx'
import { districtSuggestionsByState, getRegionForState, indiaCityLocations, indiaMapRegions, indiaStates } from '../data/indiaLocations.js'

export const sampleLocations = indiaCityLocations

function LocationClickHandler({ location, onChange }) {
  useMapEvents({
    click(event) {
      onChange({
        ...location,
        label: `Map pin · ${event.latlng.lat.toFixed(5)}, ${event.latlng.lng.toFixed(5)} · ${location.state}, India`,
        coordinates: [event.latlng.lat, event.latlng.lng],
      })
    },
  })

  return null
}

function KeepLocationInView({ coordinates }) {
  const map = useMap()

  useEffect(() => {
    map.flyTo(coordinates, Math.max(map.getZoom(), 14), { duration: 0.45 })
  }, [coordinates, map])

  return null
}

export default function CitizenLocationPicker({ location, onChange, language = 'en' }) {
  const [region, setRegion] = useState(getRegionForState(location.state)?.value || 'north')
  const [isCustomDistrict, setIsCustomDistrict] = useState(false)
  const districts = districtSuggestionsByState[location.state] || []

  function choosePreset(event) {
    const preset = sampleLocations.find((item) => item.label === event.target.value)
    if (preset) {
      const stateRegion = getRegionForState(preset.state)
      setRegion(stateRegion?.value || 'north')
      setIsCustomDistrict(false)
      onChange({ ...location, ...preset })
    }
  }

  function chooseRegion(value) {
    setRegion(value)
    const regionItem = indiaMapRegions.find((item) => item.value === value)
    if (!regionItem?.state) return
    setIsCustomDistrict(false)
    onChange({
      ...location,
      state: regionItem.state,
      district: '',
      city: '',
      label: `${regionItem.state}, India`,
      coordinates: regionItem.coordinates,
    })
  }

  function chooseState(event) {
    const state = event.target.value
    const stateRegion = getRegionForState(state)
    if (!stateRegion) throw new Error(`Unknown Indian state or union territory "${state}".`)
    setRegion(stateRegion.value)
    setIsCustomDistrict(false)
    onChange({
      ...location,
      state,
      district: '',
      city: '',
      label: `${state}, India`,
      coordinates: stateRegion.coordinates,
    })
  }

  return (
    <section className="rounded-2xl border border-white/[0.07] bg-[#0b1320] p-3.5 sm:p-4" aria-labelledby="location-picker-title">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 id="location-picker-title" className="text-[11px] font-semibold text-slate-200">{language === 'hi' ? 'स्थान कहाँ है?' : 'Where is the location?'}</h3>
          <p className="mt-1 text-[9px] text-slate-600">{language === 'hi' ? 'भारतीय राज्य/ज़िला चुनें या मानचित्र पर पिन लगाएँ।' : 'Select an Indian state/district or place a pin on the map.'}</p>
        </div>
        <IndiaRegionSelector value={region} onChange={chooseRegion} />
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <label>
          <span className="mb-1 block text-[8px] font-medium text-slate-400">{language === 'hi' ? 'राज्य / केंद्रशासित प्रदेश' : 'State / Union Territory'}</span>
          <select aria-label="State or Union Territory" value={location.state} onChange={chooseState} className="dashboard-field h-9 text-[9px]">
            {indiaStates.map((state) => <option key={state} value={state}>{state}</option>)}
          </select>
        </label>
        <label>
          <span className="mb-1 block text-[8px] font-medium text-slate-400">{language === 'hi' ? 'ज़िला' : 'District'}</span>
          <select aria-label="District" value={isCustomDistrict ? '__other' : location.district || ''} onChange={(event) => {
            const isOther = event.target.value === '__other'
            setIsCustomDistrict(isOther)
            onChange({ ...location, district: isOther ? '' : event.target.value })
          }} className="dashboard-field h-9 text-[9px]">
            <option value="">Select district…</option>
            {districts.map((district) => <option key={district} value={district}>{district}</option>)}
            <option value="__other">Other / not listed</option>
          </select>
        </label>
        {isCustomDistrict && (
          <label>
            <span className="mb-1 block text-[8px] font-medium text-slate-400">{language === 'hi' ? 'ज़िले का नाम लिखें' : 'Enter district name'}</span>
            <input aria-label="Enter district name" value={location.district} onChange={(event) => onChange({ ...location, district: event.target.value })} maxLength={70} placeholder="District" className="dashboard-field h-9 text-[9px]" />
          </label>
        )}
      </div>
      <label className="mt-2 block">
        <span className="mb-1 block text-[8px] font-medium text-slate-400">{language === 'hi' ? 'शहर / क्षेत्र का नमूना' : 'Sample city or area'}</span>
        <span className="relative block">
          <MapPin size={12} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <select aria-label="Choose Indian sample city" value={sampleLocations.some((item) => item.label === location.label) ? location.label : ''} onChange={choosePreset} className="h-9 w-full appearance-none rounded-lg border border-white/[0.08] bg-[#080e18] pl-8 pr-2 text-[9px] text-slate-300 outline-none focus:border-red-400/40">
            <option value="">Map pin or selected area</option>
            {sampleLocations.map((item) => <option key={item.label} value={item.label}>{item.label}</option>)}
          </select>
        </span>
      </label>
      <div className="relative mt-3 h-[205px] overflow-hidden rounded-xl border border-white/[0.06]">
        <MapContainer center={INDIA_MAP_OVERVIEW} zoom={INDIA_MAP_OVERVIEW_ZOOM} scrollWheelZoom className="resq-leaflet-map" aria-label="Select an incident location on an India map">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <IndiaRegionFocus value={region} />
          <NorthernIndiaHighlights />
          <KeepLocationInView coordinates={location.coordinates} />
          <LocationClickHandler location={location} onChange={onChange} />
          <CircleMarker center={location.coordinates} radius={9} pathOptions={{ color: '#fff', weight: 2, fillColor: '#ef4444', fillOpacity: 0.95 }} />
        </MapContainer>
        <span className="pointer-events-none absolute bottom-2 left-2 z-[400] inline-flex max-w-[90%] items-center gap-1.5 truncate rounded-md border border-white/10 bg-[#080d18]/90 px-2 py-1.5 text-[9px] text-slate-200">
          <Crosshair size={11} className="shrink-0 text-red-300" />{location.label}
        </span>
      </div>
    </section>
  )
}
