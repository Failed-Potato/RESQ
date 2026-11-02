import { useSyncExternalStore } from 'react'
import { initialIncidents } from './incidents.js'

const STORAGE_KEY = 'resq:incidents:v1'
const listeners = new Set()
const legacySeedIds = new Set(['RQ-1042', 'RQ-1041', 'RQ-1040', 'RQ-1039', 'RQ-1038', 'RQ-1037', 'RQ-1036', 'RQ-1035', 'RQ-1034', 'RQ-1033'])
let incidents = loadIncidents()

function createSeedIncidents() {
  return initialIncidents.map((incident) => ({
    ...incident,
    trackingId: incident.id,
    activity: [{
      id: `${incident.id}-received`,
      title: 'Report received',
      details: incident.source,
      at: incident.reportedAt,
    }],
  }))
}

function localizeStoredSeedIncidents(value) {
  const savedById = new Map(value.filter((incident) => legacySeedIds.has(incident.id)).map((incident) => [incident.id, incident]))
  const hasLegacySeeds = value.some((incident) => {
    const seed = initialIncidents.find((item) => item.id === incident.id)
    return legacySeedIds.has(incident.id) && (!seed || incident.location !== seed.location)
  })
  if (!hasLegacySeeds) return value

  const currentSeeds = createSeedIncidents().map((seed) => {
    const saved = savedById.get(seed.id)
    if (!saved) return seed

    return {
      ...saved,
      ...seed,
      status: saved.status,
      intelligence: saved.intelligence,
      activity: (saved.activity || seed.activity).map((entry, index) => (
        index === 0
          ? { ...entry, details: seed.source }
          : entry
      )),
    }
  })

  return [
    ...currentSeeds,
    ...value.filter((incident) => !legacySeedIds.has(incident.id)),
  ]
}

function validateIncidents(value) {
  if (!Array.isArray(value) || value.some((incident) => (
    !incident
    || typeof incident.id !== 'string'
    || typeof incident.title !== 'string'
    || typeof incident.status !== 'string'
    || !Array.isArray(incident.coordinates)
    || incident.coordinates.length !== 2
  ))) {
    throw new Error('Stored incident data is invalid. The RESQ local incident store could not be loaded.')
  }

  return value
}

function loadIncidents() {
  if (typeof window === 'undefined') return createSeedIncidents()

  const saved = window.localStorage.getItem(STORAGE_KEY)
  if (saved === null) {
    const seed = createSeedIncidents()
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seed))
    return seed
  }

  const validated = validateIncidents(JSON.parse(saved))
  const localized = localizeStoredSeedIncidents(validated)
  if (localized !== validated) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(localized))
  }
  return localized
}

function readCurrentIncidents() {
  if (typeof window === 'undefined') return incidents

  const saved = window.localStorage.getItem(STORAGE_KEY)
  return saved === null
    ? createSeedIncidents()
    : localizeStoredSeedIncidents(validateIncidents(JSON.parse(saved)))
}

function publish(nextIncidents) {
  const validIncidents = validateIncidents(nextIncidents)

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(validIncidents))
  }

  incidents = validIncidents
  listeners.forEach((listener) => listener())
}

function subscribe(listener) {
  listeners.add(listener)
  if (typeof window === 'undefined') return () => listeners.delete(listener)

  function handleStorage(event) {
    if (event.key !== STORAGE_KEY && event.key !== null) return

    try {
      incidents = event.newValue === null
        ? createSeedIncidents()
        : validateIncidents(JSON.parse(event.newValue))
      listeners.forEach((subscriber) => subscriber())
    } catch (error) {
      console.error('Unable to synchronize RESQ incident data from another tab.', error)
    }
  }

  window.addEventListener('storage', handleStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', handleStorage)
  }
}

function nextIncidentId() {
  const nextNumber = incidents.reduce((maximum, incident) => {
    const matches = incident.id.match(/\d+/g)
    const number = matches ? Number(matches[matches.length - 1]) : 0
    return Math.max(maximum, number)
  }, 0) + 1

  return `RQ-${nextNumber}`
}

export function getIncidents() {
  return incidents
}

export function useIncidents() {
  return useSyncExternalStore(subscribe, getIncidents, getIncidents)
}

export function createIncident(report) {
  incidents = readCurrentIncidents()
  const id = nextIncidentId()
  const receivedAt = report.reportedAt || Date.now()
  const incident = {
    ...report,
    id,
    trackingId: id,
    reportedAt: receivedAt,
    status: report.status || 'Active',
    assignedUnit: report.assignedUnit || 'Unassigned',
    activity: [{
      id: `${id}-received`,
      title: report.source === 'Simulated command centre entry'
        ? 'Sample report created'
        : report.source === 'Simulated citizen SOS'
          ? 'Simulated SOS started'
          : 'Citizen report received',
      details: 'Added to the shared RESQ prototype store. No emergency service was contacted.',
      at: receivedAt,
    }],
  }

  publish([incident, ...incidents])
  return incident
}

export function updateIncidentStatus(incidentId, status) {
  incidents = readCurrentIncidents()
  const at = Date.now()
  const incident = incidents.find((item) => item.id === incidentId)
  if (!incident) throw new Error(`Incident "${incidentId}" was not found.`)

  publish(incidents.map((item) => (
    item.id === incidentId
      ? {
          ...item,
          status,
          activity: [...(item.activity || []), {
            id: `${incidentId}-status-${at}`,
            title: status === 'Resolved' ? 'Report marked resolved' : 'Report reopened',
            details: 'Status changed in the shared RESQ simulation. No response team was contacted.',
            at,
          }],
        }
      : item
  )))
}

export function assignIncidentUnit(incidentId, assignedUnit) {
  incidents = readCurrentIncidents()
  const at = Date.now()
  const incident = incidents.find((item) => item.id === incidentId)
  if (!incident) throw new Error(`Incident "${incidentId}" was not found.`)

  publish(incidents.map((item) => (
    item.id === incidentId
      ? {
          ...item,
          assignedUnit,
          activity: [...(item.activity || []), {
            id: `${incidentId}-unit-${at}`,
            title: assignedUnit === 'Unassigned' ? 'Demo unit unassigned' : 'Demo unit assigned',
            details: assignedUnit === 'Unassigned'
              ? 'No simulated response unit is assigned.'
              : `${assignedUnit} assigned for workflow preview.`,
            at,
          }],
        }
      : item
  )))
}

export function addIncidentNote(incidentId, note) {
  incidents = readCurrentIncidents()
  const at = Date.now()
  const incident = incidents.find((item) => item.id === incidentId)
  if (!incident) throw new Error(`Incident "${incidentId}" was not found.`)

  publish(incidents.map((item) => (
    item.id === incidentId
      ? {
          ...item,
          activity: [...(item.activity || []), {
            id: `${incidentId}-note-${at}`,
            title: 'Response note added',
            details: note,
            at,
          }],
        }
      : item
  )))
}

export function updateIncidentIntelligence(incidentId, intelligence) {
  incidents = readCurrentIncidents()
  if (!incidents.some((item) => item.id === incidentId)) {
    throw new Error(`Incident "${incidentId}" was not found.`)
  }

  publish(incidents.map((item) => (
    item.id === incidentId ? { ...item, intelligence } : item
  )))
}

export function reviewIncidentIntelligence(incidentId, intelligence, assessment) {
  incidents = readCurrentIncidents()
  const incident = incidents.find((item) => item.id === incidentId)
  if (!incident) throw new Error(`Incident "${incidentId}" was not found.`)

  const categories = ['Medical', 'Fire', 'Road Accident', 'Traffic', 'Weather', 'Infrastructure', 'Earthquake', 'Landslide', 'Flood', 'Cyclone', 'Public Safety', 'Other']
  const severities = ['Critical', 'High', 'Moderate', 'Low']
  if (!severities.includes(assessment.severity)) throw new Error('Choose a valid incident severity.')
  if (assessment.category && !categories.includes(assessment.category)) {
    throw new Error('Choose a valid incident category.')
  }

  const at = Date.now()
  publish(incidents.map((item) => (
    item.id === incidentId
      ? {
          ...item,
          category: assessment.category || item.category,
          severity: assessment.severity,
          intelligence: { ...intelligence, reviewedAt: at },
          activity: [...(item.activity || []), {
            id: `${incidentId}-ai-review-${at}`,
            title: 'Advisory AI assessment reviewed',
            details: 'A human operator reviewed and applied the suggested category/severity. No response team was contacted.',
            at,
          }],
        }
      : item
  )))
}

export function resetIncidents() {
  publish(createSeedIncidents())
}
