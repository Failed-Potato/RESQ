import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, ArrowRight, Camera, Check, LoaderCircle, MapPin, ShieldAlert, X } from 'lucide-react'
import { createCompressedPhoto } from '../data/photoAttachment.js'

const hazardOptions = [
  { value: 'unsafe-road', en: 'Unsafe road or obstruction', hi: 'असुरक्षित सड़क या अवरोध', category: 'Traffic', severity: 'Moderate' },
  { value: 'streetlight', en: 'Broken streetlight', hi: 'खराब स्ट्रीट लाइट', category: 'Infrastructure', severity: 'Low' },
  { value: 'exposed-wire', en: 'Exposed or fallen wire', hi: 'खुला या गिरा हुआ तार', category: 'Infrastructure', severity: 'High' },
  { value: 'blocked-walkway', en: 'Blocked walkway or access', hi: 'अवरुद्ध पैदल मार्ग या पहुँच', category: 'Infrastructure', severity: 'Moderate' },
  { value: 'water-leak', en: 'Water leak or damaged pipe', hi: 'पानी का रिसाव या क्षतिग्रस्त पाइप', category: 'Infrastructure', severity: 'Moderate' },
  { value: 'waterlogging', en: 'Waterlogging or local flooding', hi: 'जलभराव या स्थानीय बाढ़', category: 'Flood', severity: 'High' },
  { value: 'landslide', en: 'Landslide or slope debris', hi: 'भूस्खलन या ढलान का मलबा', category: 'Landslide', severity: 'High' },
  { value: 'other', en: 'Other community hazard', hi: 'अन्य सामुदायिक खतरा', category: 'Infrastructure', severity: 'Moderate' },
]

export default function CommunitySafetyReport({ location, onSubmit, language = 'en' }) {
  const [hazardType, setHazardType] = useState(hazardOptions[0].value)
  const [severity, setSeverity] = useState('Moderate')
  const [description, setDescription] = useState('')
  const [address, setAddress] = useState('')
  const [pinCode, setPinCode] = useState('')
  const [photo, setPhoto] = useState(null)
  const [isCompressing, setIsCompressing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [submittedReference, setSubmittedReference] = useState('')
  const hazard = hazardOptions.find((item) => item.value === hazardType) || hazardOptions[0]

  async function handlePhotoChange(event) {
    const file = event.target.files?.[0]
    if (!file) return

    setError('')
    setIsCompressing(true)
    try {
      setPhoto(await createCompressedPhoto(file))
    } catch (photoError) {
      setPhoto(null)
      setError(photoError.message)
    } finally {
      setIsCompressing(false)
      event.target.value = ''
    }
  }

  function handleHazardChange(event) {
    const nextHazardType = event.target.value
    const nextHazard = hazardOptions.find((item) => item.value === nextHazardType)
    if (!nextHazard) throw new Error(`Unknown community hazard type "${nextHazardType}".`)
    setHazardType(nextHazardType)
    setSeverity(nextHazard.severity)
  }

  function submitReport(event) {
    event.preventDefault()
    if (isSubmitting) return

    setError('')
    setIsSubmitting(true)
    try {
      const incident = onSubmit({
        category: hazard.category,
        title: hazard.en,
        severity,
        status: 'Active',
        location: location.label,
        state: location.state,
        district: location.district,
        address: address.trim(),
        pinCode,
        coordinates: location.coordinates,
        summary: description.trim(),
        source: 'Simulated community safety report',
        reporterType: 'citizen',
        reportKind: 'community-safety',
        communityHazardType: hazardType,
        assignedUnit: 'Unassigned',
        reportedAt: Date.now(),
        photo,
      })
      if (!incident?.trackingId) throw new Error('The community report could not be saved.')
      setSubmittedReference(incident.trackingId)
      setDescription('')
      setAddress('')
      setPinCode('')
      setPhoto(null)
    } catch (submitError) {
      setError(submitError.message || 'The report could not be saved in this browser.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="community-report" className="relative overflow-hidden rounded-2xl border border-sky-300/[0.12] bg-[linear-gradient(145deg,rgba(16,34,48,0.82),rgba(12,18,31,0.98)_60%)] p-4 sm:p-5" aria-labelledby="community-report-title">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-sky-300/10 bg-sky-300/[0.07] text-sky-200"><ShieldAlert size={17} /></span>
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-sky-200/75">Community safety · simulated</p>
            <h2 id="community-report-title" className="mt-1 text-sm font-semibold text-white">{language === 'hi' ? 'स्थानीय खतरे की रिपोर्ट करें' : 'Report a neighbourhood hazard'}</h2>
            <p className="mt-1 text-[9px] leading-4 text-slate-500">Creates a report in the existing command-centre incident queue.</p>
          </div>
        </div>
        <span className="rounded-md border border-amber-300/10 bg-amber-300/[0.04] px-2 py-1 text-[7px] font-semibold uppercase tracking-wider text-amber-100/80">Not monitored · no dispatch</span>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/[0.06] bg-[#080e18]/60 px-3 py-2">
        <span className="flex min-w-0 items-center gap-1.5 truncate text-[9px] text-slate-300"><MapPin size={11} className="shrink-0 text-red-200" />{location.label}</span>
        <button type="button" onClick={() => document.getElementById('location-picker-title')?.scrollIntoView({ behavior: 'smooth', block: 'center' })} className="shrink-0 text-[8px] font-semibold text-sky-200/80 transition hover:text-white">Change map pin</button>
      </div>

      {submittedReference && (
        <AnimatePresence mode="wait">
          <motion.div key={submittedReference} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-emerald-300/10 bg-emerald-300/[0.04] px-3 py-2" role="status">
            <span className="text-[9px] text-emerald-100/80">Added to the shared incident store.</span>
            <a href={`/dashboard?incident=${encodeURIComponent(submittedReference)}`} className="inline-flex items-center gap-1 font-mono text-[9px] font-semibold text-emerald-200 hover:text-white">{submittedReference} · view queue <ArrowRight size={11} /></a>
          </motion.div>
        </AnimatePresence>
      )}

      <form className="mt-3 space-y-3" onSubmit={submitReport}>
        <div className="grid gap-2 sm:grid-cols-2">
          <label>
            <span className="mb-1 block text-[8px] font-medium text-slate-400">{language === 'hi' ? 'खतरे का प्रकार' : 'Hazard type'}</span>
            <select value={hazardType} onChange={handleHazardChange} className="dashboard-field h-9 text-[9px]">
              {hazardOptions.map((option) => <option key={option.value} value={option.value}>{option[language]}</option>)}
            </select>
          </label>
          <label>
            <span className="mb-1 block text-[8px] font-medium text-slate-400">{language === 'hi' ? 'अनुमानित तात्कालिकता' : 'Perceived urgency'}</span>
            <select value={severity} onChange={(event) => setSeverity(event.target.value)} className="dashboard-field h-9 text-[9px]">
              <option value="Low">Low · informational</option>
              <option value="Moderate">Moderate · needs attention</option>
              <option value="High">High · urgent concern</option>
              <option value="Critical">Critical · immediate danger</option>
            </select>
          </label>
        </div>
        <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_130px]">
          <label>
            <span className="mb-1 block text-[8px] font-medium text-slate-400">{language === 'hi' ? 'मकान / सड़क / क्षेत्र का पता' : 'House / street / locality address'}</span>
            <input required maxLength={140} value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Indian address" className="dashboard-field h-9 text-[9px]" />
          </label>
          <label>
            <span className="mb-1 block text-[8px] font-medium text-slate-400">{language === 'hi' ? 'पिन कोड' : 'PIN code'}</span>
            <input required inputMode="numeric" autoComplete="postal-code" pattern="[1-9][0-9]{5}" maxLength={6} value={pinCode} onChange={(event) => setPinCode(event.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="6-digit PIN" className="dashboard-field h-9 font-mono text-[9px] tracking-wider" />
          </label>
        </div>
        <label className="block">
          <span className="mb-1 block text-[8px] font-medium text-slate-400">What did you observe?</span>
          <textarea required minLength={8} maxLength={500} rows={3} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Describe the hazard and nearby landmarks. Do not include names or personal information." className="dashboard-field h-auto resize-y py-2.5 text-[9px] leading-4" />
        </label>
        <label className="block">
          <span className="mb-1 block text-[8px] font-medium text-slate-400">Photo evidence · optional, stored in this browser</span>
          <span className="flex min-h-9 items-center gap-2 rounded-lg border border-dashed border-white/[0.1] bg-[#080e18]/60 px-2.5 py-2">
            {isCompressing ? <LoaderCircle size={13} className="animate-spin text-sky-200" /> : <Camera size={13} className="text-slate-500" />}
            <span className="min-w-0 flex-1 truncate text-[8px] text-slate-500">{isCompressing ? 'Compressing image…' : photo ? `${photo.name} · ${(photo.size / 1024).toFixed(0)} KB` : 'JPG, PNG, or WebP · up to 10 MB before compression'}</span>
            {photo && <Check size={12} className="text-emerald-200" />}
            <input type="file" accept="image/jpeg,image/png,image/webp" disabled={isCompressing} onChange={handlePhotoChange} aria-label="Upload community hazard photo" className="sr-only" />
          </span>
          {photo && (
            <span className="mt-2 flex items-center gap-2">
              <img src={photo.dataUrl} alt="Selected community hazard photo preview" className="h-10 w-12 rounded-md object-cover" />
              <button type="button" onClick={() => setPhoto(null)} className="inline-flex items-center gap-1 text-[8px] text-slate-500 hover:text-white"><X size={11} />Remove photo</button>
            </span>
          )}
        </label>
        {error && <p role="alert" className="flex items-start gap-1.5 rounded-lg border border-red-300/10 bg-red-300/[0.04] p-2 text-[8px] leading-4 text-red-100"><AlertCircle size={11} className="mt-0.5 shrink-0" />{error}</p>}
        <button type="submit" disabled={isSubmitting || isCompressing} className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-sky-300/15 bg-sky-300/[0.075] text-[9px] font-semibold text-sky-100 transition hover:bg-sky-300/[0.12] disabled:cursor-wait disabled:opacity-50">
          {isSubmitting ? <LoaderCircle size={12} className="animate-spin" /> : <ShieldAlert size={12} />}
          Add sample hazard report
        </button>
        <p className="text-center text-[8px] leading-4 text-slate-600">This creates an unverified prototype record. For immediate help in India, call 112 directly.</p>
      </form>
    </section>
  )
}
