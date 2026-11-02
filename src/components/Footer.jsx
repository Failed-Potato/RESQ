import { Activity, ArrowUpRight } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.07]">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-7 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
        <a href="#top" className="flex items-center gap-2 text-slate-300" aria-label="RESQ home">
          <Activity size={15} className="text-red-400" />
          <span className="font-semibold tracking-[0.15em]">RESQ</span>
          <span className="ml-1 text-slate-600">© 2026</span>
        </a>
        <p>Product concept preview · Demo data only · Not for emergency use</p>
        <a href="#approach" className="inline-flex items-center gap-1 transition hover:text-slate-300">
          Our approach <ArrowUpRight size={13} />
        </a>
      </div>
    </footer>
  )
}
