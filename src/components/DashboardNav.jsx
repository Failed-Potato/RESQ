import { useEffect, useState } from 'react'
import { Activity, ArrowLeft, BarChart3, BookOpenCheck, BrainCircuit, Clock3, LayoutDashboard, ListChecks, Map, Menu, UserRound, X } from 'lucide-react'
import ThemeToggle from './ThemeToggle.jsx'

const navigation = [
  { label: 'Command', href: '#command', icon: LayoutDashboard },
  { label: 'Map', href: '#map', icon: Map },
  { label: 'Triage queue', href: '#queue', icon: ListChecks },
  { label: 'Situation trends', href: '#analytics', icon: BarChart3 },
  { label: 'AI review', href: '#ai-insights', icon: BrainCircuit },
]

export default function DashboardNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [localTime, setLocalTime] = useState(() => new Date().toLocaleTimeString('en-US', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }))

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setLocalTime(new Date().toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }))
    }, 30_000)

    return () => window.clearInterval(intervalId)
  }, [])

  return (
    <header className="resq-nav sticky top-0 z-[500] border-b border-white/[0.07] bg-[#080d18]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[68px] max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-7">
        <a href="/" className="flex items-center gap-2.5" aria-label="RESQ home">
          <span className="resq-brand-mark flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-red-400 to-rose-600 text-white shadow-lg shadow-red-950/30">
            <Activity size={19} strokeWidth={2.5} />
          </span>
          <span>
            <span className="block text-[16px] font-bold leading-4 tracking-[0.17em] text-white">RESQ</span>
            <span className="mt-1 block text-[8px] font-semibold tracking-[0.18em] text-slate-500">COMMAND CENTRE</span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 xl:flex" aria-label="Command centre navigation">
          {navigation.map(({ label, href, icon: Icon }, index) => (
            <a key={href} href={href} aria-current={index === 0 ? 'page' : undefined} className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[11px] font-medium transition ${
              index === 0 ? 'border border-white/[0.07] bg-white/[0.045] text-white' : 'text-slate-500 hover:bg-white/[0.04] hover:text-slate-200'
            }`}>
              <Icon size={13} /> {label}
            </a>
          ))}
          <a href="/safety" className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[10px] font-medium text-slate-500 transition hover:bg-white/[0.04] hover:text-slate-200"><BookOpenCheck size={13} />Safety centre</a>
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 border-r border-white/[0.08] pr-4 sm:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-40" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-amber-200">Simulation</span>
          </div>
          <div className="hidden items-center gap-1.5 text-slate-400 sm:flex" aria-label="India Standard Time interface clock">
            <Clock3 size={13} />
            <time className="font-mono text-[11px] tabular-nums text-slate-300">{localTime}</time>
            <span className="text-[8px] text-slate-600">IST</span>
          </div>
          <a href="/" className="hidden items-center gap-1.5 rounded-lg px-2.5 py-2 text-[10px] font-medium text-slate-500 transition hover:bg-white/5 hover:text-white sm:inline-flex">
            <ArrowLeft size={13} /> Home
          </a>
          <a href="/citizen" className="hidden items-center gap-1.5 rounded-lg border border-white/[0.08] px-2.5 py-2 text-[10px] font-medium text-slate-400 transition hover:border-white/[0.16] hover:text-white sm:inline-flex">
            <UserRound size={13} /> Citizen portal
          </a>
          <ThemeToggle />
          <button
            type="button"
            className="rounded-lg p-2 text-slate-300 transition hover:bg-white/10 xl:hidden"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {isMenuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <nav className="absolute left-0 right-0 top-full border-b border-white/10 bg-[#0c1422] p-4 shadow-xl xl:hidden" aria-label="Mobile command centre navigation">
          <div className="mx-auto grid max-w-3xl grid-cols-2 gap-2">
            {navigation.map(({ label, href, icon: Icon }) => (
              <a key={href} href={href} onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-3 text-xs text-slate-300 transition hover:bg-white/5 hover:text-white">
                <Icon size={14} /> {label}
              </a>
            ))}
            <a href="/safety" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-3 text-xs text-slate-300 transition hover:bg-white/5 hover:text-white"><BookOpenCheck size={14} />Safety knowledge centre</a>
            <a href="/disaster" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-3 text-xs text-slate-300 transition hover:bg-white/5 hover:text-white">Disaster management demo</a>
            <a href="/facilities" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-3 text-xs text-slate-300 transition hover:bg-white/5 hover:text-white">Nearby facilities demo</a>
            <a href="/citizen" className="col-span-2 flex items-center gap-2 rounded-lg px-3 py-3 text-xs text-slate-300 transition hover:bg-white/5 hover:text-white">
              <UserRound size={14} /> Citizen portal
            </a>
            <a href="/" className="col-span-2 flex items-center gap-2 rounded-lg px-3 py-3 text-xs text-slate-300 transition hover:bg-white/5 hover:text-white">
              <ArrowLeft size={14} /> Back to RESQ home
            </a>
          </div>
        </nav>
      )}
    </header>
  )
}
