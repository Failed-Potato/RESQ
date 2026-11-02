import { motion } from 'framer-motion'
import { ArrowRight, HeartHandshake } from 'lucide-react'

export default function SafetyCallout({ onRequestAccess }) {
  return (
    <section id="approach" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.55 }}
        className="relative overflow-hidden rounded-[26px] border border-white/[0.09] bg-[#101a29] px-6 py-10 sm:px-10 sm:py-14 lg:px-14"
      >
        <div className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full bg-red-500/[0.12] blur-[90px]" />
        <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-xl">
            <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-red-300/15 bg-red-300/[0.08] text-red-200">
              <HeartHandshake size={20} />
            </span>
            <p className="eyebrow">BUILT WITH CARE</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white sm:text-3xl">
              Calm, clear, and centered on people.
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-7 text-slate-400">
              RESQ is a product concept, not an emergency service. If you need urgent help, contact your local emergency services directly.
            </p>
          </div>
          <button type="button" onClick={onRequestAccess} className="button-primary shrink-0">
            Follow the journey <ArrowRight size={16} />
          </button>
        </div>
      </motion.div>
    </section>
  )
}
