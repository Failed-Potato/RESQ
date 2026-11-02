import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, BellRing, MapPin, Radio, Siren } from 'lucide-react'

const demoIncidents = [
  { title: 'Road closure', place: 'Demo: Sector 17, Chandigarh', time: '8 min ago', type: 'Caution', tone: 'amber' },
  { title: 'Weather notice', place: 'Demo: Mall Road, Shimla', time: '24 min ago', type: 'Advisory', tone: 'blue' },
]

export default function IncidentPreview({ isSosDemoActive, onToggleSosDemo }) {
  const [activeFilter, setActiveFilter] = useState('All updates')

  const visibleIncidents = activeFilter === 'All updates'
    ? demoIncidents
    : demoIncidents.filter((incident) => incident.type === activeFilter)

  return (
    <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="grid items-center gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
        <motion.div
          initial={{ opacity: 0, x: -18 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55 }}
        >
          <p className="eyebrow">A CLEARER PICTURE</p>
          <h2 className="mt-4 max-w-lg text-3xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-4xl">
            Useful context.
            <br />
            <span className="text-slate-500">Without the noise.</span>
          </h2>
          <p className="mt-5 max-w-md text-sm leading-7 text-slate-400 sm:text-base">
            RESQ is designed to bring important safety information into one calm, approachable view. Explore the interactions below—every location and update is illustrative demo content.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onToggleSosDemo}
              className={isSosDemoActive ? 'button-outline !border-red-400/30 !text-red-200' : 'button-primary'}
            >
              <Siren size={16} />
              {isSosDemoActive ? 'Reset SOS demo' : 'Try SOS demo'}
            </button>
          </div>
          {isSosDemoActive && (
            <div role="status" className="mt-4 rounded-xl border border-red-400/20 bg-red-400/[0.07] p-4 text-sm text-red-100">
              <span className="font-semibold">Simulation active.</span> No alert was sent and no emergency service was contacted.
            </div>
          )}
          <div className="mt-8 flex gap-5 text-xs text-slate-500">
            <span className="inline-flex items-center gap-2"><Radio size={14} className="text-slate-400" /> Concept interface</span>
            <span className="inline-flex items-center gap-2"><MapPin size={14} className="text-slate-400" /> Sample locations</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="rounded-[24px] border border-white/[0.08] bg-[#0d1523] p-4 shadow-2xl shadow-black/20 sm:p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.07] pb-5">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <BellRing size={16} className="text-red-300" /> Community updates
              </div>
              <p className="mt-1 text-xs text-slate-500">DEMO FEED · SAMPLE REGION</p>
            </div>
            <div className="flex rounded-lg border border-white/[0.08] bg-[#080e18] p-1">
              {['All updates', 'Caution', 'Advisory'].map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  aria-pressed={activeFilter === filter}
                  className={`rounded-md px-2.5 py-1.5 text-[10px] transition sm:px-3 sm:text-[11px] ${
                    activeFilter === filter ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-2">
            {visibleIncidents.map((incident, index) => (
              <motion.div
                layout
                key={incident.title}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                className="flex items-center gap-4 border-b border-white/[0.06] py-5 last:border-0"
              >
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  incident.tone === 'amber' ? 'bg-amber-400/10 text-amber-300' : 'bg-sky-400/10 text-sky-300'
                }`}>
                  {incident.tone === 'amber' ? <MapPin size={18} /> : <BellRing size={17} />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-slate-200">{incident.title}</p>
                    <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[9px] text-slate-400">{incident.type}</span>
                  </div>
                  <p className="mt-1 truncate text-xs text-slate-500">{incident.place}</p>
                </div>
                <span className="shrink-0 text-[10px] text-slate-600">{incident.time}</span>
              </motion.div>
            ))}
            {visibleIncidents.length === 0 && (
              <p className="py-8 text-center text-sm text-slate-500">No sample updates in this category.</p>
            )}
          </div>
          <div className="mt-2 flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-[11px] text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
            This preview is not connected to live incident data.
            <ArrowUpRight size={13} className="ml-auto shrink-0" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
