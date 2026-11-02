import { useEffect, useState } from 'react'
import { ArrowDown, ArrowRight, ArrowUpRight, HeartHandshake, PhoneCall, ShieldCheck, Siren } from 'lucide-react'
import { motion } from 'framer-motion'
import CitizenLocationPicker, { sampleLocations } from './components/CitizenLocationPicker.jsx'
import CitizenNav from './components/CitizenNav.jsx'
import CitizenAssistant from './components/CitizenAssistant.jsx'
import CitizenReportForm from './components/CitizenReportForm.jsx'
import CitizenSafetyGuides from './components/CitizenSafetyGuides.jsx'
import CitizenSosPanel from './components/CitizenSosPanel.jsx'
import CitizenTracking from './components/CitizenTracking.jsx'
import CommunitySafetyReport from './components/CommunitySafetyReport.jsx'
import { createIncident, useIncidents } from './data/incidentStore.js'

export default function CitizenPortal() {
  const incidents = useIncidents()
  const [location, setLocation] = useState(sampleLocations[0])
  const [language, setLanguage] = useState('en')
  const [trackingReference, setTrackingReference] = useState('')
  const [storageError, setStorageError] = useState('')

  useEffect(() => {
    document.title = 'RESQ — Citizen Portal'
  }, [])

  function createReport(report) {
    try {
      const incident = createIncident(report)
      setStorageError('')
      setTrackingReference(incident.trackingId)
      return incident
    } catch (error) {
      setStorageError(`Unable to save this report in this browser: ${error.message}`)
      throw error
    }
  }

  function startReport() {
    document.getElementById('report')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function showSosWorkflow() {
    document.getElementById('citizen-sos-title')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <div className="command-shell min-h-screen text-white">
      <CitizenNav />
      <main className="mx-auto max-w-[1440px] px-4 pb-10 pt-6 sm:px-7 sm:pt-9">
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="page-intro citizen-intro relative mb-7 overflow-hidden rounded-[22px] border border-white/[0.07] bg-[linear-gradient(115deg,rgba(17,26,42,0.98),rgba(17,21,34,0.94)_65%,rgba(55,23,36,0.54))] px-5 py-7 sm:px-8 sm:py-9"
        >
          <div className="citizen-intro-decoration pointer-events-none absolute -right-10 -top-32 h-80 w-80 rounded-full bg-red-500/[0.08] blur-[90px]" />
          <div className="relative grid items-end gap-6 lg:grid-cols-[1fr_auto]">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                <span className="text-red-300">RESQ / COMMUNITY</span>
                <span className="text-slate-700">/</span>
                <span className="rounded border border-amber-300/15 bg-amber-300/[0.05] px-1.5 py-0.5 text-[8px] tracking-[0.12em] text-amber-200">SIMULATION · NOT MONITORED</span>
              </div>
              <h1 className="max-w-2xl text-[clamp(2rem,5vw,3.35rem)] font-semibold leading-[1.05] tracking-[-0.06em] text-white">
                {language === 'hi' ? <>ज़रूरत के समय, <span className="text-slate-500">सही अगला कदम।</span></> : <>A clearer next step,<span className="text-slate-500"> when it matters.</span></>}
              </h1>
              <p className="mt-4 max-w-xl text-xs leading-6 text-slate-400 sm:text-sm">
                {language === 'hi' ? 'नमूना घटना साझा करें, स्थान चुनें और RESQ कमांड सेंटर प्रोटोटाइप में उसकी स्थिति देखें।' : 'Share a sample incident, choose a location, and follow its status through the RESQ command-centre prototype.'}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={startReport} className="button-primary !min-h-10 !rounded-xl !px-3.5 !text-[10px]">
                {language === 'hi' ? 'रिपोर्ट बनाएँ' : 'Create a report'} <ArrowRight size={14} />
              </button>
              <button type="button" onClick={showSosWorkflow} className="button-outline !min-h-10 !rounded-xl !px-3.5 !text-[10px]">
                <Siren size={14} /> {language === 'hi' ? 'नमूना SOS' : 'SOS demo'}
              </button>
              <a href="tel:112" className="button-critical !min-h-10 !rounded-xl !px-3.5 !text-[10px]">
                <PhoneCall size={14} /> {language === 'hi' ? '112 पर कॉल करें' : 'Call 112'}
              </a>
              <a href="#tracking" className="button-outline !min-h-10 !rounded-xl !px-3.5 !text-[10px]">
                {language === 'hi' ? 'रिपोर्ट की स्थिति देखें' : 'Track a report'} <ArrowDown size={14} />
              </a>
            </div>
          </div>
          <label className="relative mt-5 inline-flex items-center gap-2 text-[9px] text-slate-400">
            <span>{language === 'hi' ? 'भाषा' : 'Language'}</span>
            <select value={language} onChange={(event) => setLanguage(event.target.value)} aria-label="Portal language" className="h-8 rounded-lg border border-white/[0.1] bg-[#080e18] px-2 text-[9px] text-slate-200 outline-none focus:border-red-300/40">
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
            </select>
          </label>
          <div className="relative mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/[0.07] pt-4 text-[9px] text-slate-500">
            <span className="inline-flex items-center gap-1.5"><ShieldCheck size={12} className="text-emerald-300/80" />{language === 'hi' ? 'इस डिवाइस पर साझा प्रोटोटाइप डेटा' : 'Shared prototype data on this device'}</span>
            <span className="inline-flex items-center gap-1.5"><HeartHandshake size={12} className="text-red-300/80" />{language === 'hi' ? 'किसी वास्तविक सहायता दल से संपर्क नहीं होता' : 'No real responder is contacted'}</span>
            <span className="inline-flex items-center gap-1.5"><ArrowUpRight size={12} />{language === 'hi' ? 'वास्तविक सहायता के लिए इस डेमो का उपयोग न करें' : 'Never use this demo to request help'}</span>
          </div>
        </motion.section>

        {storageError && (
          <p role="alert" className="mb-4 rounded-xl border border-red-400/20 bg-red-400/[0.06] p-3 text-xs leading-5 text-red-100">
            {storageError} Your report was not saved; try removing the photograph or submitting without it.
          </p>
        )}

        {trackingReference && (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-300/15 bg-emerald-300/[0.045] px-4 py-3">
            <p className="text-[11px] text-emerald-100">Your sample report was added to the shared incident store.</p>
            <a href="#tracking" className="font-mono text-[11px] font-semibold tracking-wider text-emerald-200 hover:text-white">{trackingReference} · track status</a>
          </div>
        )}

        <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.13fr)_minmax(360px,0.87fr)]">
          <div className="min-w-0 space-y-4">
            <CitizenLocationPicker location={location} onChange={setLocation} language={language} />
            <CitizenReportForm location={location} incidents={incidents} onSubmit={createReport} language={language} />
            <CommunitySafetyReport location={location} onSubmit={createReport} language={language} />
          </div>
          <aside className="min-w-0 space-y-4">
            <CitizenSosPanel
              location={location}
              onCreate={createReport}
              onTrack={setTrackingReference}
              language={language}
            />
            <CitizenAssistant />
            <CitizenTracking
              incidents={incidents}
              initialTrackingId={trackingReference}
              onTracking={setTrackingReference}
              language={language}
            />
            <CitizenSafetyGuides language={language} />
          </aside>
        </div>

        <footer className="mt-7 flex flex-col items-center justify-between gap-2 border-t border-white/[0.06] pt-4 text-center text-[9px] text-slate-600 sm:flex-row sm:text-left">
          <span>RESQ citizen portal · Prototype interactions and incident records are simulated.</span>
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
            <a href="/safety" className="text-slate-500 transition hover:text-white">Safety knowledge centre</a>
            <a href="/disaster" className="text-slate-500 transition hover:text-white">Disaster demo</a>
            <a href="/facilities" className="text-slate-500 transition hover:text-white">Facility map</a>
            <a href="/dashboard" className="text-slate-500 transition hover:text-white">Command centre →</a>
          </div>
        </footer>
      </main>
    </div>
  )
}
