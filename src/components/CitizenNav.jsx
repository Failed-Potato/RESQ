import { useState } from 'react'
import { Activity, ArrowLeft, BookOpenCheck, LayoutDashboard, Menu, X } from 'lucide-react'
import ThemeToggle from './ThemeToggle.jsx'

export default function CitizenNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="resq-nav sticky top-0 z-[500] border-b border-white/[0.07] bg-[#080d18]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-7">
        <a href="/" className="flex items-center gap-2.5" aria-label="RESQ home">
          <span className="resq-brand-mark flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-red-400 to-rose-600 text-white shadow-lg shadow-red-950/30">
            <Activity size={19} strokeWidth={2.5} />
          </span>
          <span>
            <span className="block text-[16px] font-bold leading-4 tracking-[0.17em] text-white">RESQ</span>
            <span className="mt-1 block text-[8px] font-semibold tracking-[0.18em] text-slate-500">CITIZEN PORTAL</span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 xl:flex" aria-label="Citizen portal navigation">
          <a href="#report" className="rounded-lg px-3 py-2 text-[11px] font-medium text-slate-400 transition hover:bg-white/[0.04] hover:text-white">Report</a>
          <a href="#tracking" className="rounded-lg px-3 py-2 text-[11px] font-medium text-slate-400 transition hover:bg-white/[0.04] hover:text-white">Track</a>
          <a href="#assistant" className="rounded-lg px-3 py-2 text-[11px] font-medium text-slate-400 transition hover:bg-white/[0.04] hover:text-white">AI safety guide</a>
          <a href="#safety" className="rounded-lg px-3 py-2 text-[11px] font-medium text-slate-400 transition hover:bg-white/[0.04] hover:text-white">Safety & contacts</a>
          <a href="/safety" className="rounded-lg px-3 py-2 text-[11px] font-medium text-slate-400 transition hover:bg-white/[0.04] hover:text-white">Knowledge centre</a>
          <a href="/disaster" className="rounded-lg px-3 py-2 text-[11px] font-medium text-slate-400 transition hover:bg-white/[0.04] hover:text-white">Disaster demo</a>
          <a href="/facilities" className="rounded-lg px-3 py-2 text-[11px] font-medium text-slate-400 transition hover:bg-white/[0.04] hover:text-white">Facilities</a>
        </nav>

        <div className="flex items-center gap-2">
          <a href="/dashboard" className="hidden items-center gap-1.5 rounded-lg border border-white/[0.08] px-3 py-2 text-[10px] font-medium text-slate-400 transition hover:border-white/[0.16] hover:text-white sm:inline-flex">
            <LayoutDashboard size={13} /> Command centre
          </a>
          <a href="/" className="hidden items-center gap-1.5 rounded-lg px-2.5 py-2 text-[10px] font-medium text-slate-500 transition hover:bg-white/5 hover:text-white lg:inline-flex">
            <ArrowLeft size={13} /> Home
          </a>
          <ThemeToggle />
          <button
            type="button"
            className="rounded-lg p-2 text-slate-300 transition hover:bg-white/10 xl:hidden"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? 'Close portal menu' : 'Open portal menu'}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <nav className="absolute left-0 right-0 top-full border-b border-white/10 bg-[#0c1422] p-4 shadow-xl xl:hidden" aria-label="Mobile citizen portal navigation">
          <div className="mx-auto grid max-w-md gap-1">
            {[
              ['Report an incident', '#report'],
              ['Track a report', '#tracking'],
              ['AI safety guide', '#assistant'],
              ['Safety guides & emergency contacts', '#safety'],
              ['Public safety knowledge centre', '/safety'],
              ['Disaster management demo', '/disaster'],
              ['Nearby facilities demo', '/facilities'],
              ['Command centre', '/dashboard'],
              ['RESQ home', '/'],
            ].map(([label, href]) => (
              <a key={href} href={href} onClick={() => setIsMenuOpen(false)} className="rounded-lg px-3 py-3 text-xs text-slate-300 transition hover:bg-white/5 hover:text-white">
                {label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
