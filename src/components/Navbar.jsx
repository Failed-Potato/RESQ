import { useState } from 'react'
import { Activity, ArrowUpRight, BookOpenCheck, LayoutDashboard, Menu, UserRound, X } from 'lucide-react'
import ThemeToggle from './ThemeToggle.jsx'

const links = [
  { label: 'Platform', href: '#platform' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Our approach', href: '#approach' },
]

export default function Navbar({ onRequestAccess }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  function closeMenu() {
    setIsMenuOpen(false)
  }

  return (
    <header className="resq-nav relative z-30 border-b border-white/[0.06]">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        <a href="#top" className="flex items-center gap-2.5" aria-label="RESQ home">
          <span className="resq-brand-mark flex h-9 w-9 items-center justify-center rounded-xl bg-red-500 text-white shadow-lg shadow-red-950/30">
            <Activity size={20} strokeWidth={2.5} />
          </span>
          <span className="text-[19px] font-bold tracking-[0.17em] text-white">RESQ</span>
        </a>

        <nav className="hidden items-center gap-9 md:flex" aria-label="Main navigation">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="text-sm text-slate-400 transition hover:text-white">
              {link.label}
            </a>
          ))}
          <a href="/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white">
            <LayoutDashboard size={15} /> Dashboard
          </a>
          <a href="/citizen" className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white">
            <UserRound size={15} /> Citizen portal
          </a>
          <a href="/safety" className="hidden items-center gap-2 text-sm text-slate-400 transition hover:text-white lg:inline-flex">
            <BookOpenCheck size={15} /> Safety centre
          </a>
        </nav>

        <div className="hidden md:block">
          <button type="button" className="button-outline !px-4 !py-2.5" onClick={onRequestAccess}>
            Get early access <ArrowUpRight size={15} />
          </button>
        </div>

        <ThemeToggle />

        <button
          type="button"
          className="rounded-lg p-2 text-slate-300 transition hover:bg-white/10 md:hidden"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      {isMenuOpen && (
        <nav className="absolute left-0 right-0 top-full border-b border-white/10 bg-[#0c1422] p-5 shadow-xl md:hidden" aria-label="Mobile navigation">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="rounded-lg px-3 py-3 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/dashboard"
              onClick={closeMenu}
              className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              <LayoutDashboard size={15} /> Emergency dashboard
            </a>
            <a
              href="/citizen"
              onClick={closeMenu}
              className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              <UserRound size={15} /> Citizen portal
            </a>
            <a href="/safety" onClick={closeMenu} className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white">
              <BookOpenCheck size={15} /> Public safety knowledge centre
            </a>
            <a href="/disaster" onClick={closeMenu} className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white">
              Disaster management demo
            </a>
            <a href="/facilities" onClick={closeMenu} className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white">
              Nearby facilities demo
            </a>
            <button type="button" className="button-primary mt-2" onClick={() => { closeMenu(); onRequestAccess() }}>
              Get early access <ArrowUpRight size={15} />
            </button>
          </div>
        </nav>
      )}
    </header>
  )
}
