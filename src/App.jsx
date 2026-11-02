import { lazy, Suspense, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check, X } from 'lucide-react'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import IncidentPreview from './components/IncidentPreview.jsx'
import FeatureGrid from './components/FeatureGrid.jsx'
import SafetyCallout from './components/SafetyCallout.jsx'
import Footer from './components/Footer.jsx'

const Dashboard = lazy(() => import('./Dashboard.jsx'))
const CitizenPortal = lazy(() => import('./CitizenPortal.jsx'))
const SafetyKnowledgeCentre = lazy(() => import('./SafetyKnowledgeCentre.jsx'))
const DisasterManagement = lazy(() => import('./DisasterManagement.jsx'))
const EmergencyFacilities = lazy(() => import('./EmergencyFacilities.jsx'))

function AccessModal({ onClose }) {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) onClose()
        }}
      >
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="access-title"
          className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 shadow-2xl shadow-slate-900/20 sm:p-9"
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 rounded-full p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
          {submitted ? (
            <div className="py-5 text-center">
              <span className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">
                <Check size={23} />
              </span>
              <h2 id="access-title" className="text-2xl font-semibold text-slate-900">
                Thanks for your interest.
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                This is a visual prototype. No email was sent or stored.
              </p>
              <button type="button" className="button-primary mt-7" onClick={onClose}>
                Back to RESQ
              </button>
            </div>
          ) : (
            <>
              <p className="eyebrow">EARLY ACCESS</p>
              <h2 id="access-title" className="mt-3 text-2xl font-semibold text-slate-900">
                Help shape a safer experience.
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                RESQ is in concept development. Leave an email to preview the sign-up
                interaction—this demo does not transmit or save your details.
              </p>
              <form className="mt-7" onSubmit={handleSubmit}>
                <label htmlFor="access-email" className="mb-2 block text-sm font-medium text-slate-700">
                  Email address
                </label>
                <input
                  id="access-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-rose-700 focus:ring-2 focus:ring-rose-700/10"
                />
                <button type="submit" className="button-primary mt-4 w-full">
                  Preview sign-up <ArrowRight size={16} />
                </button>
                <p className="mt-3 text-center text-xs text-slate-500">
                  Demo only · no message will be sent
                </p>
              </form>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  const [isAccessOpen, setIsAccessOpen] = useState(false)
  const [isSosDemoActive, setIsSosDemoActive] = useState(false)
  const pathname = window.location.pathname.replace(/\/+$/, '')

  const publicSafetyPages = {
    '/safety': <SafetyKnowledgeCentre />,
    '/disaster': <DisasterManagement />,
    '/facilities': <EmergencyFacilities />,
  }

  if (pathname === '/dashboard' || pathname === '/citizen' || publicSafetyPages[pathname]) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-[#f2f5f4]" aria-label="Loading RESQ page" />}>
        {pathname === '/dashboard'
          ? <Dashboard />
          : pathname === '/citizen'
            ? <CitizenPortal />
            : publicSafetyPages[pathname]}
      </Suspense>
    )
  }

  return (
    <div className="landing-shell min-h-screen overflow-hidden text-slate-900">
      <Navbar onRequestAccess={() => setIsAccessOpen(true)} />
      <main>
        <Hero onRequestAccess={() => setIsAccessOpen(true)} />
        <IncidentPreview
          isSosDemoActive={isSosDemoActive}
          onToggleSosDemo={() => setIsSosDemoActive((active) => !active)}
        />
        <FeatureGrid />
        <SafetyCallout onRequestAccess={() => setIsAccessOpen(true)} />
      </main>
      <Footer />
      {isAccessOpen && <AccessModal onClose={() => setIsAccessOpen(false)} />}
    </div>
  )
}
