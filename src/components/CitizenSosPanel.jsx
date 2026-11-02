import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Check, PhoneCall, Siren, X } from 'lucide-react'

export default function CitizenSosPanel({ location, onCreate, onTrack, language = 'en' }) {
  const [isOpen, setIsOpen] = useState(false)
  const [createdIncident, setCreatedIncident] = useState(null)
  const [error, setError] = useState('')

  function close() {
    setIsOpen(false)
    setCreatedIncident(null)
    setError('')
  }

  function createSos() {
    try {
      const incident = onCreate({
        category: 'Medical',
        title: 'Citizen SOS · simulated request',
        severity: 'High',
        status: 'Active',
        location: location.label,
        state: location.state,
        district: location.district,
        coordinates: location.coordinates,
        summary: 'A simulated SOS workflow was initiated by a citizen. This report is not sent to emergency services.',
        source: 'Simulated citizen SOS',
        reporterType: 'citizen',
        assignedUnit: 'Unassigned',
        reportedAt: Date.now(),
      })
      if (!incident) throw new Error('The simulated SOS could not be saved.')
      setError('')
      setCreatedIncident(incident)
    } catch (saveError) {
      setError(`Unable to save the demo report: ${saveError.message}`)
    }
  }

  return (
    <>
      <section className="relative overflow-hidden rounded-2xl border border-red-300/15 bg-[linear-gradient(145deg,rgba(81,28,40,0.42),rgba(17,21,34,0.96)_55%)] p-4 sm:p-5" aria-labelledby="citizen-sos-title">
        <div className="pointer-events-none absolute -right-12 -top-14 h-40 w-40 rounded-full bg-red-500/[0.12] blur-3xl" />
        <div className="relative">
          <div className="flex items-start justify-between gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-300/15 bg-red-300/[0.08] text-red-200">
              <Siren size={19} />
            </span>
            <span className="rounded-full border border-amber-300/15 bg-amber-300/[0.06] px-2 py-1 text-[8px] font-semibold uppercase tracking-wider text-amber-200">Demo only</span>
          </div>
          <h2 id="citizen-sos-title" className="mt-4 text-base font-semibold text-white">{language === 'hi' ? 'SOS प्रक्रिया' : 'SOS workflow'}</h2>
          <p className="mt-1.5 text-[10px] leading-5 text-slate-400">{language === 'hi' ? 'उच्च प्राथमिकता वाली नमूना रिपोर्ट बनाने की प्रक्रिया देखें। कोई कॉल या डिस्पैच नहीं होगा।' : 'Preview the steps for creating a high-priority simulated report. No call or dispatch will be made.'}</p>
          <div className="mt-3 flex items-start gap-2 rounded-lg border border-white/[0.06] bg-black/10 p-2.5 text-[9px] leading-4 text-slate-500">
            <PhoneCall size={12} className="mt-0.5 shrink-0 text-amber-300" />
            <span>{language === 'hi' ? <>तत्काल सहायता के लिए भारत में <a href="tel:112" className="font-semibold text-amber-200 underline">112 पर सीधे कॉल करें</a>। इस पोर्टल की निगरानी नहीं होती।</> : <>Need immediate help in India? <a href="tel:112" className="font-semibold text-amber-200 underline">Call 112 directly</a>. This portal is not monitored.</>}</span>
          </div>
          <button type="button" onClick={() => setIsOpen(true)} className="button-critical mt-4 w-full !min-h-10 !rounded-xl !px-3 !text-[11px]">
            <Siren size={15} /> {language === 'hi' ? 'नमूना SOS शुरू करें' : 'Start simulated SOS'}
          </button>
        </div>
      </section>

      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#030711]/85 p-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) close()
          }}
        >
          <motion.section
            role="dialog"
            aria-modal="true"
            aria-labelledby="sos-dialog-title"
            className="w-full max-w-md rounded-2xl border border-red-300/15 bg-[#0e1726] p-5 shadow-2xl shadow-black/50 sm:p-7"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-amber-200">Simulation · no emergency call</p>
                <h2 id="sos-dialog-title" className="mt-2 text-lg font-semibold text-white">{createdIncident ? (language === 'hi' ? 'नमूना SOS रिपोर्ट बनी' : 'SOS simulation created') : (language === 'hi' ? 'नमूना SOS देखें' : 'Review simulated SOS')}</h2>
              </div>
              {!createdIncident && <button type="button" onClick={close} aria-label="Close dialog" className="rounded-lg p-2 text-slate-500 hover:bg-white/5 hover:text-white"><X size={17} /></button>}
            </div>

            {createdIncident ? (
              <div className="mt-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300"><Check size={19} /></span>
                <p className="mt-4 text-xs leading-5 text-slate-300">{language === 'hi' ? 'प्राथमिकता वाली नमूना रिपोर्ट साझा कमांड-सेंटर सूची में है। किसी से संपर्क नहीं किया गया।' : 'A sample priority report is now in the shared command-centre queue. No one has been contacted.'}</p>
                <p className="mt-4 rounded-xl border border-white/[0.07] bg-[#090f19] px-3 py-3 text-center font-mono text-lg font-semibold tracking-wider text-white">{createdIncident.trackingId}</p>
                <button type="button" onClick={() => { onTrack(createdIncident.trackingId); close() }} className="button-primary mt-4 w-full">
                  {language === 'hi' ? 'नमूना रिपोर्ट ट्रैक करें' : 'Track demo report'} <ArrowRight size={14} />
                </button>
                <button type="button" onClick={close} className="mt-2 w-full rounded-lg py-2 text-[10px] text-slate-500 hover:text-white">Close</button>
              </div>
            ) : (
              <div className="mt-4">
                <div className="rounded-xl border border-white/[0.07] bg-[#090f19] p-3">
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-600">Sample location</p>
                  <p className="mt-1 text-xs text-slate-200">{location.label}</p>
                </div>
                <p className="mt-4 text-[11px] leading-5 text-slate-400">{language === 'hi' ? 'आगे बढ़ने पर इस ब्राउज़र के साझा RESQ प्रोटोटाइप डेटा में काल्पनिक उच्च-प्राथमिकता चिकित्सा रिपोर्ट बनेगी। इससे कॉल नहीं होगी, सहायता दल को सूचना नहीं मिलेगी और आपातकालीन सेवाओं से संपर्क नहीं होगा।' : 'Continuing creates a fictional high-priority medical report in this browser’s shared RESQ prototype data. This does not place a phone call, alert responders, or contact emergency services.'}</p>
                {error && <p role="alert" className="mt-3 rounded-lg border border-red-400/15 bg-red-400/[0.05] p-3 text-[10px] leading-4 text-red-200">{error}</p>}
                <button type="button" onClick={createSos} className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-red-500 text-xs font-semibold text-white transition hover:bg-red-400">
                  <Siren size={15} /> {language === 'hi' ? 'नमूना SOS रिपोर्ट बनाएँ' : 'Create simulated SOS report'}
                </button>
                <button type="button" onClick={close} className="mt-2 w-full rounded-lg py-2 text-[10px] text-slate-500 hover:text-white">Cancel</button>
              </div>
            )}
          </motion.section>
        </motion.div>
      )}
    </>
  )
}
