import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Activity, ArrowRight, BookOpenCheck, Check, CheckCheck, ChevronRight, ClipboardCheck, HeartPulse, House, Search, ShieldAlert, Wind, Zap } from 'lucide-react'
import PublicSafetyNav from './components/PublicSafetyNav.jsx'
import { safetyGuideCopy, safetyGuideLanguages, safetyGuides } from './data/safetyGuides.js'

const icons = { fire: ShieldAlert, earthquake: Activity, flood: Wind, road: Zap, firstAid: HeartPulse }

export default function SafetyKnowledgeCentre() {
  const [language, setLanguage] = useState('en')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [selectedId, setSelectedId] = useState('fire')
  const [checked, setChecked] = useState({})
  const copy = safetyGuideCopy[language]

  useEffect(() => {
    document.title = 'RESQ — Public Safety Knowledge Centre'
  }, [])

  const filteredGuides = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase()
    return safetyGuides.filter((guide) => {
      if (category !== 'all' && guide.category !== category) return false
      if (!normalizedQuery) return true
      const localized = guide.translations[language]
      return [localized.title, localized.description, ...localized.steps, ...localized.checklist]
        .join(' ')
        .toLocaleLowerCase()
        .includes(normalizedQuery)
    })
  }, [category, language, query])

  useEffect(() => {
    if (!filteredGuides.some((guide) => guide.id === selectedId)) {
      setSelectedId(filteredGuides[0]?.id || '')
    }
  }, [filteredGuides, selectedId])

  const selectedGuide = filteredGuides.find((guide) => guide.id === selectedId)
  const selectedCopy = selectedGuide?.translations[language]
  const checkedItems = selectedGuide ? checked[selectedGuide.id] || [] : []
  const completedCount = checkedItems.length

  function toggleChecklist(index) {
    if (!selectedGuide) return
    setChecked((current) => {
      const currentItems = current[selectedGuide.id] || []
      const nextItems = currentItems.includes(index)
        ? currentItems.filter((item) => item !== index)
        : [...currentItems, index]
      return { ...current, [selectedGuide.id]: nextItems }
    })
  }

  return (
    <div className="command-shell min-h-screen text-white">
      <PublicSafetyNav current="/safety" />
      <main className="mx-auto max-w-[1440px] px-4 pb-10 pt-6 sm:px-7 sm:pt-9">
        <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="page-intro safety-intro relative mb-6 overflow-hidden rounded-[22px] border border-white/[0.07] bg-[linear-gradient(115deg,rgba(17,26,42,0.98),rgba(17,21,34,0.94)_65%,rgba(55,23,36,0.54))] px-5 py-7 sm:px-8 sm:py-9">
          <div className="pointer-events-none absolute -right-10 -top-32 h-80 w-80 rounded-full bg-red-500/[0.08] blur-[90px]" />
          <div className="relative grid items-end gap-6 lg:grid-cols-[1fr_auto]">
            <div className="max-w-3xl">
              <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.16em] text-red-300">{copy.eyebrow}</p>
              <h1 className="text-[clamp(2rem,5vw,3.3rem)] font-semibold leading-[1.05] tracking-[-0.06em] text-white">{copy.title}<span className="text-slate-500">, for every next step.</span></h1>
              <p className="mt-4 max-w-2xl text-xs leading-6 text-slate-400 sm:text-sm">{copy.intro}</p>
            </div>
            <label className="relative">
              <span className="mb-1.5 block text-[9px] font-semibold uppercase tracking-wider text-slate-500">Language</span>
              <select aria-label="Guide language" value={language} onChange={(event) => setLanguage(event.target.value)} className="h-10 min-w-36 rounded-xl border border-white/[0.09] bg-[#080e18] px-3 text-[10px] text-slate-200 outline-none focus:border-red-300/40">
                {safetyGuideLanguages.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
              </select>
            </label>
          </div>
          <div className="relative mt-5 flex flex-wrap items-center gap-2 border-t border-white/[0.07] pt-4 text-[9px] text-slate-500">
            <span className="rounded-md border border-amber-300/15 bg-amber-300/[0.05] px-2 py-1 font-semibold uppercase tracking-wider text-amber-200">General guidance · not a live alert</span>
            <span>{copy.demo}</span>
          </div>
        </motion.section>

        <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
          <section className="command-panel p-4 sm:p-5" aria-labelledby="guide-library-title">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-red-300">Explore</p>
                <h2 id="guide-library-title" className="mt-1 text-sm font-semibold text-white">Safety guide library</h2>
              </div>
              <BookOpenCheck size={17} className="text-slate-500" />
            </div>

            <label className="relative mt-4 block">
              <span className="sr-only">Search safety guides</span>
              <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy.search} className="dashboard-field h-10 pl-9" />
            </label>

            <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1" aria-label="Filter safety guides by category">
              {[['all', copy.all], ...safetyGuides.map((guide) => [guide.category, copy.labels[guide.category]])].map(([value, label]) => (
                <button key={value} type="button" onClick={() => setCategory(value)} aria-pressed={category === value} className={`shrink-0 rounded-lg border px-2.5 py-1.5 text-[8px] font-medium transition ${
                  category === value ? 'border-red-300/20 bg-red-300/[0.08] text-red-100' : 'border-white/[0.06] text-slate-500 hover:bg-white/[0.04] hover:text-slate-200'
                }`}>{label}</button>
              ))}
            </div>

            <div className="mt-3 space-y-2" role="list" aria-label="Safety guides">
              <AnimatePresence mode="popLayout">
                {filteredGuides.map((guide) => {
                  const Icon = icons[guide.icon]
                  const localized = guide.translations[language]
                  const active = guide.id === selectedId
                  return (
                    <motion.button
                      key={guide.id}
                      layout
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      type="button"
                      role="listitem"
                      aria-pressed={active}
                      onClick={() => setSelectedId(guide.id)}
                      className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                        active ? 'border-red-300/20 bg-red-300/[0.055]' : 'border-white/[0.055] bg-[#080e18]/55 hover:border-white/[0.12]'
                      }`}
                    >
                      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${active ? 'bg-red-300/[0.1] text-red-200' : 'bg-white/[0.035] text-slate-400'}`}><Icon size={16} /></span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[10px] font-semibold text-slate-100">{localized.title}</span>
                        <span className="mt-1 block line-clamp-2 text-[8px] leading-4 text-slate-500">{localized.description}</span>
                      </span>
                      <ChevronRight size={14} className={active ? 'text-red-200' : 'text-slate-600'} />
                    </motion.button>
                  )
                })}
              </AnimatePresence>
              {filteredGuides.length === 0 && <p className="rounded-xl border border-dashed border-white/[0.08] p-5 text-center text-[9px] leading-5 text-slate-500">{copy.noResults}</p>}
            </div>
          </section>

          <AnimatePresence mode="wait">
            {selectedGuide && selectedCopy && (
              <motion.div key={`${selectedGuide.id}-${language}`} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="space-y-4">
                <section className="command-panel p-4 sm:p-6" aria-labelledby="guide-detail-title">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-300/[0.09] text-red-200"><BookOpenCheck size={18} /></span>
                      <div>
                        <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-red-300">{copy.labels[selectedGuide.category]} · {copy.steps}</p>
                        <h2 id="guide-detail-title" className="mt-1 text-lg font-semibold text-white">{selectedCopy.title}</h2>
                        <p className="mt-1 max-w-2xl text-[9px] leading-5 text-slate-500">{selectedCopy.description}</p>
                      </div>
                    </div>
                    <span className="rounded-md border border-amber-300/10 bg-amber-300/[0.035] px-2 py-1 text-[7px] font-semibold uppercase tracking-wider text-amber-100/80">General · unverified locally</span>
                  </div>
                  <ol className="mt-5 space-y-3">
                    {selectedCopy.steps.map((step, index) => (
                      <li key={`${index}-${step}`} className="flex gap-3 rounded-xl border border-white/[0.045] bg-[#080e18]/55 p-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-red-300/15 bg-red-300/[0.055] font-mono text-[9px] font-semibold text-red-100">{String(index + 1).padStart(2, '0')}</span>
                        <p className="pt-0.5 text-[9px] leading-5 text-slate-300">{step}</p>
                      </li>
                    ))}
                  </ol>
                  <p className="mt-4 border-t border-white/[0.06] pt-3 text-[8px] leading-4 text-slate-600">{copy.local} {copy.verified}</p>
                </section>

                <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[linear-gradient(145deg,rgba(18,30,44,0.98),rgba(11,18,30,0.98))] p-4 sm:p-5" aria-labelledby="checklist-title">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-300/[0.08] text-emerald-200"><ClipboardCheck size={16} /></span>
                      <div>
                        <h2 id="checklist-title" className="text-sm font-semibold text-white">{copy.checklist}</h2>
                        <p className="mt-1 text-[8px] leading-4 text-slate-500">{copy.focus}</p>
                      </div>
                    </div>
                    <span className="rounded-full border border-emerald-300/10 bg-emerald-300/[0.04] px-2.5 py-1 text-[8px] text-emerald-100/80">{completedCount}/{selectedCopy.checklist.length} {copy.progress}</span>
                  </div>
                  <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/[0.06]"><motion.div className="h-full rounded-full bg-emerald-300/70" animate={{ width: `${completedCount / selectedCopy.checklist.length * 100}%` }} /></div>
                  <div className="mt-3 space-y-1.5">
                    {selectedCopy.checklist.map((item, index) => {
                      const isChecked = checkedItems.includes(index)
                      return (
                        <button key={item} type="button" aria-pressed={isChecked} onClick={() => toggleChecklist(index)} className={`flex w-full items-start gap-2.5 rounded-lg border p-2.5 text-left transition ${
                          isChecked ? 'border-emerald-300/10 bg-emerald-300/[0.035]' : 'border-transparent hover:bg-white/[0.025]'
                        }`}>
                          <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${isChecked ? 'border-emerald-300/50 bg-emerald-300/15 text-emerald-200' : 'border-white/15 text-transparent'}`}>{isChecked && <Check size={10} />}</span>
                          <span className={`text-[9px] leading-4 ${isChecked ? 'text-slate-500 line-through decoration-slate-600' : 'text-slate-300'}`}>{item}</span>
                        </button>
                      )
                    })}
                  </div>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.06] pt-3">
                    <span className="inline-flex items-center gap-1.5 text-[8px] text-slate-600"><CheckCheck size={11} />{copy.focus}</span>
                    <button type="button" onClick={() => setChecked((current) => ({ ...current, [selectedGuide.id]: [] }))} className="text-[8px] font-medium text-slate-500 transition hover:text-white">{copy.clear}</button>
                  </div>
                </section>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <a href="/disaster" className="group flex items-center justify-between rounded-xl border border-white/[0.07] bg-[#0b1320] p-4 transition hover:border-red-300/20">
            <span><span className="block text-[9px] text-slate-500">Interactive simulated scenarios</span><span className="mt-1 block text-[11px] font-semibold text-slate-200">Explore disaster management</span></span><ArrowRight size={15} className="text-red-200 transition group-hover:translate-x-1" />
          </a>
          <a href="/facilities" className="group flex items-center justify-between rounded-xl border border-white/[0.07] bg-[#0b1320] p-4 transition hover:border-red-300/20">
            <span><span className="block text-[9px] text-slate-500">Demonstration markers only</span><span className="mt-1 block text-[11px] font-semibold text-slate-200">Browse nearby facility map</span></span><House size={15} className="text-sky-200" />
          </a>
        </div>
        <section className="mt-4 rounded-2xl border border-white/[0.07] bg-[#0b1320] p-4" aria-label="Official Indian emergency and earthquake resources">
          <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-slate-500">{language === 'hi' ? 'भारत · आधिकारिक संसाधन' : language === 'pa' ? 'ਭਾਰਤ · ਅਧਿਕਾਰਤ ਸਰੋਤ' : 'India · official resources'}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-[9px]">
            <a href="tel:112" className="font-semibold text-red-200 hover:text-white">{language === 'hi' ? 'आपातकालीन हेल्पलाइन 112' : language === 'pa' ? 'ਐਮਰਜੈਂਸੀ ਹੈਲਪਲਾਈਨ 112' : 'Emergency helpline 112'}</a>
            <a href="https://ndma.gov.in/node/156" target="_blank" rel="noreferrer" className="text-slate-300 hover:text-white">NDMA · {language === 'hi' ? 'भूकंप मार्गदर्शन' : 'Earthquake guidance'}</a>
            <a href="https://seismo.gov.in/" target="_blank" rel="noreferrer" className="text-slate-300 hover:text-white">NCS · {language === 'hi' ? 'आधिकारिक भूकंप स्रोत' : 'Official earthquake source'}</a>
          </div>
          <p className="mt-2 text-[8px] leading-4 text-slate-600">{language === 'hi' ? 'यह सामान्य जानकारी है, आधिकारिक आदेश नहीं। आपातकाल में सीधे 112 पर संपर्क करें।' : language === 'pa' ? 'ਇਹ ਆਮ ਜਾਣਕਾਰੀ ਹੈ, ਅਧਿਕਾਰਤ ਹੁਕਮ ਨਹੀਂ। ਐਮਰਜੈਂਸੀ ਵਿੱਚ ਸਿੱਧਾ 112 ਤੇ ਸੰਪਰਕ ਕਰੋ।' : 'General guidance only, not an official order. In an emergency, contact 112 directly.'}</p>
        </section>
      </main>
    </div>
  )
}
