import assert from 'node:assert/strict'
import test from 'node:test'
import { initialIncidents } from '../src/data/incidents.js'
import { buildIndiaEarthquakeFeedUrl, EARTHQUAKE_TIME_RANGES, fetchIndiaEarthquakeEvents, filterEarthquakeEvents, parseIndiaEarthquakeFeed } from '../src/data/earthquakeFeed.js'
import { districtSuggestionsByState, indiaCityLocations, indiaMapRegions } from '../src/data/indiaLocations.js'

test('India demo fixtures include the requested cities and remain explicitly simulated', () => {
  const expectedCities = ['Chandigarh', 'Mohali', 'Shimla', 'Dharamshala', 'Dehradun', 'Delhi', 'Mumbai', 'Guwahati']

  for (const city of expectedCities) {
    assert.ok(initialIncidents.some((incident) => incident.location.includes(city)), `Missing demo incident for ${city}`)
  }
  assert.ok(initialIncidents.every((incident) => incident.source.includes('Simulated')))
  assert.ok(initialIncidents.every((incident) => incident.summary.includes('SIMULATION ONLY')))
  assert.deepEqual(indiaCityLocations.map((location) => location.city), expectedCities)
})

test('India geography provides northern focus, regions, and district choices', () => {
  assert.deepEqual(indiaMapRegions.find((region) => region.value === 'north').coordinates, [31.6, 78.4])
  for (const state of ['Punjab', 'Himachal Pradesh', 'Uttarakhand', 'Jammu and Kashmir', 'Delhi']) {
    assert.ok(indiaMapRegions.some((region) => region.state === state), `Missing map region for ${state}`)
  }
  assert.ok(districtSuggestionsByState.Punjab.includes('Mohali (S.A.S. Nagar)'))
})

test('supplementary earthquake query uses India-region bounds and parses sourced event details', () => {
  const url = new URL(buildIndiaEarthquakeFeedUrl(Date.parse('2026-06-30T00:00:00Z')))
  assert.equal(url.origin, 'https://earthquake.usgs.gov')
  assert.equal(url.searchParams.get('minlatitude'), '6')
  assert.equal(url.searchParams.get('maxlatitude'), '37.5')
  assert.equal(url.searchParams.get('minlongitude'), '67')
  assert.equal(url.searchParams.get('maxlongitude'), '97.5')

  const events = parseIndiaEarthquakeFeed({
    type: 'FeatureCollection',
    features: [
      {
        id: 'source-event-1',
        properties: { mag: 4.2, time: 1_750_000_000_000, place: 'Test source location', url: 'https://example.test/event', magType: 'mb' },
        geometry: { type: 'Point', coordinates: [77.1, 31.2, 12.5] },
      },
      { id: 'invalid-event', properties: { mag: null }, geometry: { coordinates: [] } },
    ],
  })

  assert.equal(events.length, 1)
  assert.deepEqual(events[0], {
    id: 'source-event-1',
    magnitude: 4.2,
    place: 'Test source location',
    timestamp: 1_750_000_000_000,
    depthKm: 12.5,
    coordinates: [31.2, 77.1],
    eventUrl: 'https://example.test/event',
    magnitudeType: 'mb',
    source: 'USGS Earthquake Hazards Program · supplementary global catalogue',
  })
  assert.throws(() => parseIndiaEarthquakeFeed({ type: 'Feature', features: [] }), /invalid event collection/i)
})

test('earthquake feed reports network failures without inventing fallback records', async () => {
  await assert.rejects(
    fetchIndiaEarthquakeEvents(async () => ({ ok: false, status: 503 })),
    /HTTP 503/,
  )
})

test('earthquake magnitude and time filters are deterministic and newest-first', () => {
  const now = Date.parse('2026-11-02T00:00:00Z')
  const events = [
    { id: 'older', magnitude: 5.2, timestamp: now - 7 * 60 * 60 * 1000 },
    { id: 'recent-low', magnitude: 3.1, timestamp: now - 20 * 60 * 1000 },
    { id: 'recent-high', magnitude: 5.8, timestamp: now - 10 * 60 * 1000 },
    { id: 'future', magnitude: 6.1, timestamp: now + 60_000 },
  ]

  assert.deepEqual(filterEarthquakeEvents(events, { minimumMagnitude: 4.5, timeRangeHours: 1, now }).map((event) => event.id), ['recent-high'])
  assert.deepEqual(filterEarthquakeEvents(events, { minimumMagnitude: 2.5, timeRangeHours: 24, now }).map((event) => event.id), ['recent-high', 'recent-low', 'older'])
  assert.deepEqual(EARTHQUAKE_TIME_RANGES.map(({ value }) => value), [1, 6, 24, 168, 720])
  assert.throws(() => filterEarthquakeEvents(events, { minimumMagnitude: -1 }), /non-negative/)
  assert.throws(() => filterEarthquakeEvents(events, { timeRangeHours: 0 }), /positive/)
})

test('localizes legacy demo seeds but preserves citizen reports and their original locations', async () => {
  const originalWindow = globalThis.window
  const oldSeeds = [
    { ...initialIncidents[0], location: 'Chicago, Illinois', state: 'Illinois', coordinates: [41.88, -87.63], status: 'Resolved' },
    { ...initialIncidents[1], location: 'Chicago, Illinois', state: 'Illinois', coordinates: [41.89, -87.64] },
    { id: 'RQ-1034', title: 'Legacy sample', status: 'Active', coordinates: [41.88, -87.63], location: 'Chicago, Illinois' },
    {
      id: 'RQ-1043',
      trackingId: 'RQ-1043',
      title: 'Citizen-submitted historic report',
      status: 'Monitoring',
      location: 'Chicago, Illinois',
      state: 'Illinois',
      coordinates: [41.88, -87.63],
      reporterType: 'citizen',
    },
  ]
  let serialized = JSON.stringify(oldSeeds)
  let writes = 0
  const storage = {
    getItem(key) {
      return key === 'resq:incidents:v1' ? serialized : null
    },
    setItem(key, value) {
      if (key !== 'resq:incidents:v1') return
      serialized = value
      writes += 1
    },
  }
  globalThis.window = { localStorage: storage }

  try {
    const store = await import(`../src/data/incidentStore.js?india-test=${Date.now()}`)
    const migrated = store.getIncidents()
    const localizedSeed = migrated.find((incident) => incident.id === initialIncidents[0].id)
    const preservedCitizen = migrated.find((incident) => incident.id === 'RQ-1043')

    assert.equal(localizedSeed.location, initialIncidents[0].location)
    assert.equal(localizedSeed.status, 'Resolved')
    assert.equal(migrated.some((incident) => incident.id === 'RQ-1034'), false)
    assert.equal(preservedCitizen.location, 'Chicago, Illinois')
    assert.deepEqual(preservedCitizen.coordinates, [41.88, -87.63])
    assert.equal(writes, 1)
    store.getIncidents()
    assert.equal(writes, 1)

    const report = store.createIncident({
      category: 'Flood',
      title: 'Local waterlogging',
      status: 'Active',
      location: 'Sector 17, Chandigarh',
      state: 'Chandigarh',
      district: 'Chandigarh',
      address: 'Sector 17',
      pinCode: '160017',
      coordinates: [30.7415, 76.7821],
      summary: 'Waterlogging after heavy rain.',
      source: 'Simulated citizen report',
      reporterType: 'citizen',
    })
    assert.equal(report.state, 'Chandigarh')
    assert.equal(report.pinCode, '160017')
    store.updateIncidentStatus(report.id, 'Resolved')
    assert.equal(store.getIncidents().find((incident) => incident.id === report.id).status, 'Resolved')
  } finally {
    if (originalWindow === undefined) delete globalThis.window
    else globalThis.window = originalWindow
  }
})
