import { useEffect, useMemo, useRef, useState } from 'react'
import { Activity, Plus, RotateCcw, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import DashboardNav from './components/DashboardNav.jsx'
import DashboardStats from './components/DashboardStats.jsx'
import DashboardNotifications from './components/DashboardNotifications.jsx'
import IncidentIntelligencePanel from './components/IncidentIntelligencePanel.jsx'
import IncidentAnalytics from './components/IncidentAnalytics.jsx'
import IncidentDetail from './components/IncidentDetail.jsx'
import IncidentList from './components/IncidentList.jsx'
import IncidentMap from './components/IncidentMap.jsx'
import NewIncidentDialog from './components/NewIncidentDialog.jsx'
import { initialIncidents, initialNotifications } from './data/incidents.js'
import {
  addIncidentNote,
  assignIncidentUnit,
  createIncident,
  reviewIncidentIntelligence,
  resetIncidents,
  updateIncidentIntelligence,
  updateIncidentStatus,
  useIncidents,
} from './data/incidentStore.js'

export default function Dashboard() {
  const incidents = useIncidents()
  const [notifications, setNotifications] = useState(initialNotifications)
  const [selectedIncidentId, setSelectedIncidentId] = useState(initialIncidents[0].id)
  const [search, setSearch] = useState(() => new URLSearchParams(window.location.search).get('incident') || '')
  const [category, setCategory] = useState('All categories')
  const [status, setStatus] = useState('All reports')
  const [stateFilter, setStateFilter] = useState('All states / UTs')
  const [districtFilter, setDistrictFilter] = useState('All districts')
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false)
  const notificationSequence = useRef(0)

  useEffect(() => {
    document.title = 'RESQ — Emergency Command Centre'
  }, [])

  const matchingIncidents = useMemo(() => {
    const query = search.trim().toLowerCase()

    return incidents.filter((incident) => {
      const matchesCategory = category === 'All categories' || incident.category === category
      const matchesState = stateFilter === 'All states / UTs' || incident.state === stateFilter
      const matchesDistrict = districtFilter === 'All districts' || incident.district === districtFilter
      const searchableText = [
        incident.id,
        incident.title,
        incident.category,
        incident.severity,
        incident.status,
        incident.location,
        incident.state,
        incident.district,
        incident.address,
        incident.summary,
        incident.assignedUnit,
      ].join(' ').toLowerCase()

      return matchesCategory && matchesState && matchesDistrict && (!query || searchableText.includes(query))
    })
  }, [category, districtFilter, incidents, search, stateFilter])

  const filteredIncidents = useMemo(() => matchingIncidents.filter((incident) => {
    if (status === 'Open reports') return incident.status !== 'Resolved'
    if (status !== 'All reports') return incident.status === status
    return true
  }), [matchingIncidents, status])

  useEffect(() => {
    if (!filteredIncidents.some((incident) => incident.id === selectedIncidentId)) {
      setSelectedIncidentId(filteredIncidents[0]?.id ?? null)
    }
  }, [filteredIncidents, selectedIncidentId])

  const selectedIncident = incidents.find((incident) => incident.id === selectedIncidentId) ?? null

  function createNotificationId() {
    notificationSequence.current += 1
    return `demo-notice-${notificationSequence.current}`
  }

  function addNotification(title, message, tone = 'red') {
    setNotifications((current) => [{
      id: createNotificationId(),
      title,
      message,
      time: 'Just now',
      tone,
    }, ...current].slice(0, 8))
  }

  function handleStatusChange(incidentId, nextStatus) {
    const incident = incidents.find((item) => item.id === incidentId)
    if (!incident) throw new Error(`Cannot update missing incident "${incidentId}".`)

    updateIncidentStatus(incidentId, nextStatus)
    addNotification(
      `Sample report ${nextStatus.toLowerCase()}`,
      `${incident.id} · ${incident.title} is now marked ${nextStatus.toLowerCase()}.`,
      nextStatus === 'Resolved' ? 'blue' : 'red',
    )
  }

  function handleAssignUnit(incidentId, assignedUnit) {
    const incident = incidents.find((item) => item.id === incidentId)
    if (!incident) throw new Error(`Cannot assign a unit to missing incident "${incidentId}".`)

    assignIncidentUnit(incidentId, assignedUnit)
    addNotification(
      assignedUnit === 'Unassigned' ? 'Demo unit unassigned' : 'Demo unit assigned',
      `${incident.id} · ${assignedUnit}. This does not notify a real response team.`,
      'blue',
    )
  }

  function handleAddNote(incidentId, note) {
    const incident = incidents.find((item) => item.id === incidentId)
    if (!incident) throw new Error(`Cannot add a note to missing incident "${incidentId}".`)

    addIncidentNote(incidentId, note)
    addNotification('Sample timeline updated', `A note was added to ${incident.id}. No dispatch message was sent.`, 'blue')
  }

  function handleSaveIntelligence(incidentId, analysis) {
    updateIncidentIntelligence(incidentId, analysis)
  }

  function handleReviewIntelligence(incidentId, analysis, assessment) {
    reviewIncidentIntelligence(incidentId, analysis, assessment)
    addNotification(
      'AI suggestions reviewed',
      `${incidentId} · advisory category and severity confirmed by a human operator.`,
      'blue',
    )
  }

  function handleCreateIncident(report) {
    const incident = createIncident(report)
    setSelectedIncidentId(incident.id)
    setSearch('')
    setCategory('All categories')
    setStatus('All reports')
    setStateFilter('All states / UTs')
    setDistrictFilter('All districts')
    addNotification('Sample report added', `${incident.id} · ${incident.title} added to the simulated triage queue.`, 'red')
  }

  function handleResetSimulation() {
    resetIncidents()
    setNotifications(initialNotifications)
    setSelectedIncidentId(initialIncidents[0].id)
    setSearch('')
    setCategory('All categories')
    setStatus('All reports')
    setStateFilter('All states / UTs')
    setDistrictFilter('All districts')
    addNotification('Simulation reset', 'Sample reports and statuses are back to their starting state.', 'blue')
  }

  function handleStatusFilter(nextStatus) {
    setStatus(nextStatus)
  }

  function handleCategoryFilter(nextCategory) {
    setCategory(nextCategory)
    setStatus('All reports')
  }

  return (
    <div className="command-shell ops-shell min-h-screen text-white">
      <DashboardNav />
      <main className="mx-auto max-w-[1600px] px-4 pb-8 pt-6 sm:px-7 sm:pt-8">
        <motion.section
          id="command"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="page-intro command-intro mb-6 flex flex-col justify-between gap-5 lg:flex-row lg:items-end"
        >
          <div className="min-w-0">
            <div className="mb-3 inline-flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.17em] text-slate-500">
              <span className="text-red-300">RESQ / OPS</span>
              <span className="text-slate-700">/</span>
              <span>India · demo operations</span>
              <span className="rounded border border-amber-300/15 bg-amber-300/[0.05] px-1.5 py-0.5 text-[8px] tracking-[0.12em] text-amber-200">SIMULATION</span>
            </div>
            <h1 className="text-[clamp(1.7rem,4vw,2.7rem)] font-semibold leading-tight tracking-[-0.055em] text-white">
              Emergency command centre
            </h1>
            <p className="mt-2 max-w-2xl text-xs leading-5 text-slate-500 sm:text-sm">
              One coordinated view for incident triage, situational awareness, and response workflow rehearsal.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={handleResetSimulation} className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 text-[10px] font-medium text-slate-400 transition hover:border-white/[0.15] hover:text-white">
              <RotateCcw size={13} /> Reset simulation
            </button>
            <button type="button" onClick={() => setIsReportDialogOpen(true)} className="button-primary !min-h-10 !rounded-xl !px-3.5 !text-[11px]">
              <Plus size={15} /> Create sample report
            </button>
          </div>
        </motion.section>

        <DashboardStats incidents={incidents} status={status} onStatusChange={handleStatusFilter} />

        <div className="mt-4 grid items-start gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.8fr)]">
          <div className="min-w-0 space-y-4">
            <div id="map">
              <IncidentMap
                incidents={filteredIncidents}
                selectedIncidentId={selectedIncidentId}
                onSelectIncident={setSelectedIncidentId}
              />
            </div>
            <div id="analytics">
              <IncidentAnalytics incidents={matchingIncidents} onCategoryChange={handleCategoryFilter} />
            </div>
          </div>

          <div className="min-w-0 space-y-4">
            <div id="queue">
              <IncidentList
                incidents={matchingIncidents}
                allIncidents={incidents}
                visibleIncidents={filteredIncidents}
                selectedIncidentId={selectedIncidentId}
                onSelectIncident={setSelectedIncidentId}
                search={search}
                onSearchChange={setSearch}
                category={category}
                onCategoryChange={handleCategoryFilter}
                status={status}
                onStatusChange={handleStatusFilter}
                state={stateFilter}
                onStateChange={(value) => {
                  setStateFilter(value)
                  setDistrictFilter('All districts')
                }}
                district={districtFilter}
                onDistrictChange={setDistrictFilter}
              />
            </div>
            <IncidentDetail
              incident={selectedIncident}
              onStatusChange={handleStatusChange}
              onAssignUnit={handleAssignUnit}
              onAddNote={handleAddNote}
            />
            <IncidentIntelligencePanel
              incident={selectedIncident}
              incidents={incidents}
              onSave={handleSaveIntelligence}
              onApply={handleReviewIntelligence}
            />
            <DashboardNotifications
              notifications={notifications}
              onDismiss={(id) => setNotifications((current) => current.filter((item) => item.id !== id))}
              onDismissAll={() => setNotifications([])}
              onGenerate={() => addNotification(
                'Command centre test alert',
                'This animated notification is a simulation preview, not a dispatch or public alert.',
              )}
            />
          </div>
        </div>

        <footer className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-white/[0.06] pt-4 text-[9px] text-slate-600 sm:flex-row">
          <span className="inline-flex items-center gap-1.5"><ShieldCheck size={12} className="text-emerald-400/70" /> Training interface · All incidents, assignments, and alerts are simulated.</span>
          <span className="inline-flex items-center gap-1.5"><Activity size={11} /> OpenStreetMap contributors · no live emergency dispatch connection</span>
        </footer>
      </main>
      <NewIncidentDialog
        isOpen={isReportDialogOpen}
        onClose={() => setIsReportDialogOpen(false)}
        onSubmit={handleCreateIncident}
      />
    </div>
  )
}
