const minutesAgo = (minutes) => Date.now() - minutes * 60 * 1000

const simulatedSource = 'Simulated India demonstration report · not an actual emergency'

export const initialIncidents = [
  {
    id: 'RQ-1042',
    category: 'Medical',
    title: 'Simulated medical assistance request',
    severity: 'High',
    status: 'Active',
    location: 'Sector 17, Chandigarh',
    state: 'Chandigarh',
    district: 'Chandigarh',
    reportedAt: minutesAgo(8),
    coordinates: [30.7415, 76.7821],
    summary: 'SIMULATION ONLY: A fictional request for medical assistance near Sector 17. No patient or service response is real.',
    source: simulatedSource,
    assignedUnit: 'Demo medical team 02',
  },
  {
    id: 'RQ-1041',
    category: 'Traffic',
    title: 'Simulated road obstruction',
    severity: 'Moderate',
    status: 'Monitoring',
    location: 'Phase 7, Mohali',
    state: 'Punjab',
    district: 'Mohali (S.A.S. Nagar)',
    reportedAt: minutesAgo(23),
    coordinates: [30.7046, 76.7179],
    summary: 'SIMULATION ONLY: A fictional road obstruction for workflow demonstration. This is not a traffic advisory.',
    source: simulatedSource,
    assignedUnit: 'Demo traffic team 01',
  },
  {
    id: 'RQ-1040',
    category: 'Landslide',
    title: 'Simulated hillside road hazard',
    severity: 'High',
    status: 'Active',
    location: 'Shimla, Himachal Pradesh',
    state: 'Himachal Pradesh',
    district: 'Shimla',
    reportedAt: minutesAgo(38),
    coordinates: [31.1048, 77.1734],
    summary: 'SIMULATION ONLY: A fictional hillside access hazard used to rehearse reporting and review. No slide or road closure is reported.',
    source: simulatedSource,
    assignedUnit: 'Unassigned',
  },
  {
    id: 'RQ-1039',
    category: 'Weather',
    title: 'Simulated severe-weather notice',
    severity: 'Moderate',
    status: 'Resolved',
    location: 'Dharamshala, Kangra',
    state: 'Himachal Pradesh',
    district: 'Kangra',
    reportedAt: minutesAgo(72),
    coordinates: [32.219, 76.3234],
    summary: 'SIMULATION ONLY: A fictional weather scenario for dashboard testing. This is not an IMD warning.',
    source: simulatedSource,
    assignedUnit: 'Demo weather desk',
  },
  {
    id: 'RQ-1038',
    category: 'Flood',
    title: 'Simulated urban waterlogging report',
    severity: 'Moderate',
    status: 'Monitoring',
    location: 'Dehradun, Uttarakhand',
    state: 'Uttarakhand',
    district: 'Dehradun',
    reportedAt: minutesAgo(145),
    coordinates: [30.3165, 78.0322],
    summary: 'SIMULATION ONLY: A fictional waterlogging scenario for preparedness workflow rehearsal. No live flood condition is implied.',
    source: simulatedSource,
    assignedUnit: 'Unassigned',
  },
  {
    id: 'RQ-1037',
    category: 'Road Accident',
    title: 'Simulated road accident report',
    severity: 'High',
    status: 'Resolved',
    location: 'New Delhi, Delhi',
    state: 'Delhi',
    district: 'New Delhi',
    reportedAt: minutesAgo(190),
    coordinates: [28.6139, 77.209],
    summary: 'SIMULATION ONLY: A fictional road accident report for operator workflow practice. No collision or injury is being reported.',
    source: simulatedSource,
    assignedUnit: 'Demo traffic team 02',
  },
  {
    id: 'RQ-1036',
    category: 'Infrastructure',
    title: 'Simulated public-utility hazard',
    severity: 'Moderate',
    status: 'Monitoring',
    location: 'Mumbai, Maharashtra',
    state: 'Maharashtra',
    district: 'Mumbai City',
    reportedAt: minutesAgo(218),
    coordinates: [19.076, 72.8777],
    summary: 'SIMULATION ONLY: A fictional infrastructure report for demonstration. No utility outage or service issue is confirmed.',
    source: simulatedSource,
    assignedUnit: 'Unassigned',
  },
  {
    id: 'RQ-1035',
    category: 'Earthquake',
    title: 'Simulated earthquake preparedness exercise',
    severity: 'Low',
    status: 'Active',
    location: 'Guwahati, Kamrup Metropolitan',
    state: 'Assam',
    district: 'Kamrup Metropolitan',
    reportedAt: minutesAgo(256),
    coordinates: [26.1445, 91.7362],
    summary: 'SIMULATION ONLY: This is a preparedness exercise marker, not an earthquake event. See the separate sourced earthquake feed for catalogued events.',
    source: simulatedSource,
    assignedUnit: 'Demo preparedness desk',
  },
]

export const initialNotifications = [
  {
    id: 'notice-1',
    title: 'New simulated medical report',
    message: 'A fictional sample report was added in Chandigarh.',
    time: '8 min ago',
    tone: 'red',
  },
  {
    id: 'notice-2',
    title: 'Weather notice resolved',
    message: 'The simulated Dharamshala weather scenario is marked resolved.',
    time: '1 hr ago',
    tone: 'blue',
  },
]

export const incidentCategories = [
  'All categories',
  'Medical',
  'Fire',
  'Road Accident',
  'Traffic',
  'Flood',
  'Earthquake',
  'Cyclone',
  'Landslide',
  'Weather',
  'Infrastructure',
  'Public Safety',
  'Other',
]

export const incidentStatuses = ['All reports', 'Open reports', 'Active', 'Monitoring', 'Resolved']

export const responseUnits = [
  'Demo medical team 01',
  'Demo medical team 02',
  'Demo fire unit 01',
  'Demo traffic team 01',
  'Demo traffic team 02',
  'Demo traffic team 03',
  'Demo disaster desk',
  'Demo weather desk',
]

export const incidentTrend = [
  { time: '00', count: 2 },
  { time: '02', count: 1 },
  { time: '04', count: 3 },
  { time: '06', count: 2 },
  { time: '08', count: 4 },
  { time: '10', count: 3 },
  { time: '12', count: 7 },
  { time: '14', count: 5 },
  { time: '16', count: 8 },
  { time: '18', count: 6 },
  { time: '20', count: 4 },
  { time: '22', count: 5 },
]

export function formatIncidentTime(timestamp) {
  const minutes = Math.max(0, Math.floor((Date.now() - timestamp) / 60000))

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes} min ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hr${hours === 1 ? '' : 's'} ago`

  return `${Math.floor(hours / 24)} day${hours >= 48 ? 's' : ''} ago`
}

export function formatIncidentDate(timestamp) {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata',
  }).format(timestamp)
}
