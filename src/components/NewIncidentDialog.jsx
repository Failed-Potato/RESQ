import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, MapPin, X } from 'lucide-react'
import { incidentCategories } from '../data/incidents.js'
import { districtSuggestionsByState, getRegionForState, indiaStates } from '../data/indiaLocations.js'

export default function NewIncidentDialog({ isOpen, onClose, onSubmit }) {
  const titleInput = useRef(null)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Medical')
  const [severity, setSeverity] = useState('Moderate')
  const [location, setLocation] = useState('')
  const [state, setState] = useState('Punjab')
  const [district, setDistrict] = useState('')
  const [summary, setSummary] = useState('')

  useEffect(() => {
    if (!isOpen) return undefined

    const previousFocus = document.activeElement
    titleInput.current?.focus()

    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      if (previousFocus instanceof HTMLElement && document.contains(previousFocus)) {
        previousFocus.focus()
      }
    }
  }, [isOpen, onClose])

  function closeDialog() {
    setTitle('')
    setCategory('Medical')
    setSeverity('Moderate')
    setLocation('')
    setState('Punjab')
    setDistrict('')
    setSummary('')
    onClose()
  }

  function handleSubmit(event) {
    event.preventDefault()
    onSubmit({
      category,
      title: title.trim(),
      severity,
      status: 'Active',
      location: location.trim(),
      state,
      district: district.trim(),
      reportedAt: Date.now(),
      coordinates: getRegionForState(state)?.coordinates || getRegionForState('Punjab').coordinates,
      summary: summary.trim(),
      source: 'Simulated command centre entry',
      assignedUnit: 'Unassigned',
    })
    closeDialog()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#030711]/80 p-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeDialog()
          }}
        >
          <motion.section
            role="dialog"
            aria-modal="true"
            aria-labelledby="new-incident-title"
            className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0e1726] p-5 shadow-2xl shadow-black/50 sm:p-7"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-red-300">India demo only · no dispatch</p>
                <h2 id="new-incident-title" className="mt-2 text-xl font-semibold text-white">Create sample report</h2>
                <p className="mt-1 text-xs leading-5 text-slate-500">Add a fictional report to the map and triage queue.</p>
              </div>
              <button type="button" aria-label="Close dialog" onClick={closeDialog} className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-medium text-slate-300">Report title</span>
                <input ref={titleInput} required maxLength={70} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Road obstruction" className="dashboard-field" />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-medium text-slate-300">Category</span>
                  <select value={category} onChange={(event) => setCategory(event.target.value)} className="dashboard-field">
                    {incidentCategories.filter((item) => item !== 'All categories').map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-medium text-slate-300">Demo severity</span>
                  <select value={severity} onChange={(event) => setSeverity(event.target.value)} className="dashboard-field">
                    {['Low', 'Moderate', 'High', 'Critical'].map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>
              </div>
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-medium text-slate-300">Sample location</span>
                <span className="relative block">
                  <MapPin size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input required maxLength={80} value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Street, locality, or Indian landmark" className="dashboard-field pl-9" />
                </span>
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-medium text-slate-300">State / Union Territory</span>
                  <select value={state} onChange={(event) => { setState(event.target.value); setDistrict('') }} className="dashboard-field">
                    {indiaStates.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-medium text-slate-300">District</span>
                  <input list="command-district-options" maxLength={70} value={district} onChange={(event) => setDistrict(event.target.value)} placeholder="Select or enter district" className="dashboard-field" />
                  <datalist id="command-district-options">{(districtSuggestionsByState[state] || []).map((item) => <option key={item} value={item} />)}</datalist>
                </label>
              </div>
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-medium text-slate-300">Situation notes</span>
                <textarea required maxLength={240} rows={3} value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="Add concise demo context. Do not enter real personal information." className="dashboard-field resize-y py-3" />
              </label>
              <button type="submit" className="button-primary w-full">
                Add to simulation <ArrowRight size={15} />
              </button>
              <p className="text-center text-[10px] leading-4 text-slate-600">The pin uses the selected Indian state’s illustrative centre; it is not a verified address.</p>
            </form>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
