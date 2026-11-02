import { motion } from 'framer-motion'
import { ArrowDown, ArrowRight, ShieldCheck } from 'lucide-react'

export default function Hero({ onRequestAccess }) {
  return (
    <section id="top" className="relative">
      <div className="hero-glow pointer-events-none absolute inset-0" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-16 sm:px-8 sm:pt-24 lg:grid-cols-[1.03fr_0.97fr] lg:gap-10 lg:px-12 lg:pb-28 lg:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="max-w-2xl"
        >
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-red-400/20 bg-red-400/[0.07] px-3.5 py-2 text-[11px] font-semibold tracking-[0.13em] text-red-200">
            <span className="h-1.5 w-1.5 rounded-full bg-red-400 shadow-[0_0_10px_2px_rgba(248,113,113,0.5)]" />
            PUBLIC SAFETY · INDIA
          </div>
          <h1 className="max-w-[700px] text-[clamp(3.2rem,7.3vw,5.9rem)] font-semibold leading-[0.99] tracking-[-0.065em] text-white">
            Clarity when
            <br />
            <span className="text-slate-500">it matters</span>
            <span className="text-teal-700"> most.</span>
          </h1>
          <p className="mt-7 max-w-[500px] text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">
            A more thoughtful way to find safety information, understand what’s happening, and feel prepared to take the next step.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#platform" className="button-primary">
              Explore the platform <ArrowRight size={16} />
            </a>
            <button type="button" className="button-outline" onClick={onRequestAccess}>
              Discover RESQ
            </button>
          </div>
          <div className="mt-10 flex items-center gap-3 text-xs text-slate-500">
            <ShieldCheck size={16} className="text-emerald-300/80" />
            Concept preview · No emergency services are connected
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 26, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.75, delay: 0.12, ease: 'easeOut' }}
          className="relative mx-auto w-full max-w-[580px] lg:ml-auto"
        >
          <div className="absolute -inset-8 rounded-full bg-red-500/[0.07] blur-3xl" />
          <div className="relative rounded-[26px] border border-white/10 bg-[#0e1726]/90 p-3 shadow-2xl shadow-black/40 sm:p-4">
            <div className="flex items-center justify-between px-2 pb-3 pt-1">
              <div>
                <p className="text-xs font-medium text-slate-200">Situation overview</p>
                  <p className="mt-1 text-[10px] text-slate-500">SIMULATED REPORTS · INDIA</p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/15 bg-emerald-400/[0.07] px-2.5 py-1 text-[10px] font-medium text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                Preview
              </span>
            </div>
            <div className="map-preview relative h-[240px] overflow-hidden rounded-[18px] border border-white/[0.06] sm:h-[310px]">
              <div className="map-street map-street-one" />
              <div className="map-street map-street-two" />
              <div className="map-street map-street-three" />
              <div className="map-street map-street-four" />
              <div className="map-street map-street-five" />
              <div className="map-river" />
              <span className="map-label label-north">CHANDIGARH</span>
              <span className="map-label label-market">SECTOR 17</span>
              <span className="map-label label-park">MOHALI</span>
              <span className="map-marker marker-one"><i /></span>
              <span className="map-marker marker-two"><i /></span>
              <span className="map-marker marker-three"><i /></span>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-xl border border-white/10 bg-[#0a111de8] px-3.5 py-3 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-400/10 text-red-300">
                    <ShieldCheck size={16} />
                  </span>
                  <div>
                    <p className="text-[11px] font-medium text-slate-200">Sample incident map</p>
                    <p className="mt-0.5 text-[9px] text-slate-500">Illustrative locations only</p>
                  </div>
                </div>
                <ArrowDown size={15} className="rotate-[-45deg] text-slate-500" />
              </div>
            </div>
            <div className="flex items-center justify-between px-2 pb-1 pt-3">
              <span className="text-[10px] text-slate-500">Not live · Not for emergency use</span>
              <span className="text-[10px] font-medium tracking-wide text-slate-400">RESQ / PREVIEW</span>
            </div>
          </div>
        </motion.div>
      </div>
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="border-t border-white/[0.07]" />
      </div>
    </section>
  )
}
