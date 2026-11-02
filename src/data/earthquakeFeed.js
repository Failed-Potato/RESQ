export const USGS_EARTHQUAKE_API = 'https://earthquake.usgs.gov/fdsnws/event/1/query'
export const USGS_EARTHQUAKE_SOURCE = 'USGS Earthquake Hazards Program · supplementary global catalogue'
export const NCS_EARTHQUAKE_URL = 'https://riseq.seismo.gov.in/riseq/earthquake'
export const NCS_HOME_URL = 'https://seismo.gov.in/'

export const EARTHQUAKE_TIME_RANGES = [
  { value: 1, label: '1h' },
  { value: 6, label: '6h' },
  { value: 24, label: '24h' },
  { value: 168, label: '7d' },
  { value: 720, label: '30d' },
]

export function buildIndiaEarthquakeFeedUrl(now = Date.now()) {
  const startTime = new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  const params = new URLSearchParams({
    format: 'geojson',
    starttime: startTime,
    minlatitude: '6',
    maxlatitude: '37.5',
    minlongitude: '67',
    maxlongitude: '97.5',
    minmagnitude: '2.5',
    orderby: 'time',
    limit: '100',
  })

  return `${USGS_EARTHQUAKE_API}?${params.toString()}`
}

export function parseIndiaEarthquakeFeed(payload) {
  if (!payload || payload.type !== 'FeatureCollection' || !Array.isArray(payload.features)) {
    throw new Error('The supplementary earthquake source returned an invalid event collection.')
  }

  return payload.features.flatMap((feature) => {
    const properties = feature?.properties
    const coordinates = feature?.geometry?.coordinates
    if (
      typeof feature?.id !== 'string'
      || !properties
      || !Number.isFinite(properties.mag)
      || !Number.isFinite(properties.time)
      || !Array.isArray(coordinates)
      || coordinates.length < 3
      || !coordinates.slice(0, 3).every(Number.isFinite)
    ) return []

    return [{
      id: feature.id,
      magnitude: properties.mag,
      place: typeof properties.place === 'string' ? properties.place : 'Location not provided by source',
      timestamp: properties.time,
      depthKm: coordinates[2],
      coordinates: [coordinates[1], coordinates[0]],
      eventUrl: typeof properties.url === 'string' ? properties.url : '',
      magnitudeType: typeof properties.magType === 'string' ? properties.magType : '',
      source: USGS_EARTHQUAKE_SOURCE,
    }]
  })
}

export function filterEarthquakeEvents(events, { minimumMagnitude = 2.5, timeRangeHours = 24, now = Date.now() } = {}) {
  if (!Array.isArray(events)) throw new TypeError('Earthquake events must be an array.')
  if (!Number.isFinite(minimumMagnitude) || minimumMagnitude < 0) {
    throw new RangeError('Minimum magnitude must be a non-negative number.')
  }
  if (!Number.isFinite(timeRangeHours) || timeRangeHours <= 0) {
    throw new RangeError('Time range must be a positive number of hours.')
  }
  if (!Number.isFinite(now)) throw new TypeError('Current time must be a finite timestamp.')

  const cutoff = now - timeRangeHours * 60 * 60 * 1000
  return events
    .filter((event) => (
      Number.isFinite(event?.magnitude)
      && event.magnitude >= minimumMagnitude
      && Number.isFinite(event?.timestamp)
      && event.timestamp >= cutoff
      && event.timestamp <= now
    ))
    .sort((first, second) => second.timestamp - first.timestamp)
}

export async function fetchIndiaEarthquakeEvents(fetchImpl = globalThis.fetch, now = Date.now()) {
  if (typeof fetchImpl !== 'function') throw new Error('Fetch is unavailable in this browser.')

  const response = await fetchImpl(buildIndiaEarthquakeFeedUrl(now), {
    headers: { Accept: 'application/geo+json, application/json' },
  })
  if (!response.ok) throw new Error(`The supplementary earthquake source returned HTTP ${response.status}.`)

  return parseIndiaEarthquakeFeed(await response.json())
}

export function formatIndianEventTime(timestamp) {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata',
  }).format(timestamp)
}
