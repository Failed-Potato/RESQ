import { useState } from 'react'
import { Activity, BookOpenCheck, LayoutDashboard, Map, Menu, Shield, UserRound, X } from 'lucide-react'
import ThemeToggle from './ThemeToggle.jsx'

const links = [
  { label: 'Knowledge centre', href: '/safety', icon: BookOpenCheck },
  { label: 'Disaster management', href: '/disaster', icon: Shield },
  { label: 'Nearby facilities', href: '/facilities', icon: Map },
]

export default function PublicSafetyNav({ current }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="resq-nav sticky top-0 z-[500] border-b border-white/[0.07] bg-[#080d18]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[68px] max-w-[1500px] items-center justify-between gap-3 px-4 sm:px-7">
        <a href="/" className="flex shrink-0 items-center gap-2.5" aria-label="RESQ home">
          <span className="resq-brand-mark flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-red-400 to-rose-600 text-white shadow-lg shadow-red-950/30"><Activity size={19} strokeWidth={2.5} /></span>
          <span>
            <span className="block text-[16px] font-bold leading-4 tracking-[0.17em] text-white">RESQ</span>
            <span className="mt-1 block text-[8px] font-semibold tracking-[0.16em] text-slate-500">PUBLIC SAFETY</span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Public safety navigation">
          {links.map(({ label, href, icon: Icon }) => (
            <a key={href} href={href} aria-current={current === href ? 'page' : undefined} className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[10px] font-medium transition ${
              current === href ? 'border border-white/[0.08] bg-white/[0.05] text-white' : 'text-slate-500 hover:bg-white/[0.04] hover:text-slate-200'
            }`}>
              <Icon size={13} />{label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <a href="/citizen" className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] px-2.5 py-2 text-[9px] font-medium text-slate-400 transition hover:border-white/[0.16] hover:text-white"><UserRound size={12} />Citizen portal</a>
          <a href="/dashboard" className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] px-2.5 py-2 text-[9px] font-medium text-slate-400 transition hover:border-white/[0.16] hover:text-white"><LayoutDashboard size={12} />Command centre</a>
        </div>
        <ThemeToggle />
        <button type="button" className="rounded-lg p-2 text-slate-300 transition hover:bg-white/10 lg:hidden" aria-label={isOpen ? 'Close public safety menu' : 'Open public safety menu'} aria-expanded={isOpen} onClick={() => setIsOpen((open) => !open)}>
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {isOpen && (
        <nav className="absolute left-0 right-0 top-full border-b border-white/10 bg-[#0c1422] p-3 shadow-xl lg:hidden" aria-label="Mobile public safety navigation">
          <div className="mx-auto grid max-w-2xl gap-1 sm:grid-cols-2">
            {links.map(({ label, href, icon: Icon }) => (
              <a key={href} href={href} onClick={() => setIsOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-3 text-xs text-slate-300 transition hover:bg-white/5 hover:text-white">
                <Icon size={14} />{label}
              </a>
            ))}
            <a href="/citizen" onClick={() => setIsOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-3 text-xs text-slate-300 transition hover:bg-white/5 hover:text-white"><UserRound size={14} />Citizen portal</a>
            <a href="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-3 text-xs text-slate-300 transition hover:bg-white/5 hover:text-white"><LayoutDashboard size={14} />Command centre</a>
          </div>
        </nav>
      )}
    </header>
  )
}
