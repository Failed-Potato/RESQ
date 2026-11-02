import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, BrainCircuit, Check, ChevronDown, CircleAlert, LoaderCircle, RefreshCw, ShieldCheck, Sparkles } from 'lucide-react'
import { requestIntelligence } from '../data/aiClient.js'
import { analyzeIncident, intelligenceLanguages } from '../data/intelligence.js'
import { incidentCategories } from '../data/incidents.js'

const knownCategories = incidentCategories.filter((category) => category !== 'All categories')

export default function IncidentIntelligencePanel({ incident, incidents, onSave, onApply }) {
  const [language, setLanguage] = useState('en')
  const [assessment, setAssessment] = useState(incident?.intelligence || null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setAssessment(incident?.intelligence || null)
    setIsAnalyzing(false)
    setError('')
  }, [incident?.id, incident?.intelligence])

  if (!incident) {
    return (
      <section id="ai-insights" className="command-panel p-5" aria-labelledby="ai-title">
        <h2 id="ai-title" className="text-sm font-semibold text-white">RESQ AI intelligence</h2>
        <p className="mt-2 text-[10px] text-slate-500">Select a report to review advisory analysis.</p>
      </section>
    )
  }

  async function runAnalysis() {
    setIsAnalyzing(true)
    setError('')
    const fallback = analyzeIncident(incident, incidents, language)

    try {
      const { result, provider, fallbackReason } = await requestIntelligence('analyze', {
        description: incident.summary || incident.title,
        category: incident.category,
        language,
      }, fallback)
      const nextAssessment = {
        ...fallback,
        ...result,
        duplicates: fallback.duplicates,
        language,
        provider,
        fallbackReason,
        advisory: true,
        analyzedAt: Date.now(),
      }

      setAssessment(nextAssessment)
      onSave(incident.id, nextAssessment)
    } catch (saveError) {
      setAssessment(fallback)
      setError(`Assessment is available for this view, but could not be saved to the shared incident record: ${saveError.message}`)
    } finally {
      setIsAnalyzing(false)
    }
  }

  function applyAssessment() {
    try {
      onApply(incident.id, assessment, {
        category: knownCategories.includes(assessment.suggestedCategory) ? assessment.suggestedCategory : '',
        severity: assessment.severity,
      })
      setAssessment((current) => ({ ...current, reviewedAt: Date.now() }))
      setError('')
    } catch (reviewError) {
      setError(`Unable to save the human review: ${reviewError.message}`)
    }
  }

  const suggestedCategory = assessment?.suggestedCategory || assessment?.category || 'Other'

  return (
    <section id="ai-insights" className="relative overflow-hidden rounded-2xl border border-violet-300/[0.12] bg-[linear-gradient(145deg,rgba(28,27,48,0.82),rgba(12,18,31,0.98)_60%)] p-4 sm:p-5" aria-labelledby="ai-title">
      <div className="pointer-events-none absolute -right-10 -top-14 h-40 w-40 rounded-full bg-violet-500/[0.08] blur-3xl" />
      <div className="relative">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-300/10 bg-violet-300/[0.08] text-violet-200"><BrainCircuit size={17} /></span>
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-violet-200/75">Decision support · advisory</p>
              <h2 id="ai-title" className="mt-1 text-sm font-semibold text-white">RESQ AI intelligence</h2>
              <p className="mt-1 text-[9px] leading-4 text-slate-500">Classification, severity, concise summary, possible duplicates, and review prompts.</p>
            </div>
          </div>
          <label className="relative">
            <span className="sr-only">AI analysis language</span>
            <select value={language} onChange={(event) => setLanguage(event.target.value)} className="h-8 appearance-none rounded-lg border border-white/[0.08] bg-[#080e18] py-1 pl-2.5 pr-7 text-[9px] text-slate-300 outline-none focus:border-violet-300/30">
              {intelligenceLanguages.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
            <ChevronDown size={11} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-500" />
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-[#080e18]/75 px-3 py-2.5">
          <p className="min-w-0 text-[9px] text-slate-400"><span className="font-mono text-slate-300">{incident.id}</span><span className="mx-1.5 text-slate-700">·</span>{incident.title}</p>
          <button type="button" onClick={runAnalysis} disabled={isAnalyzing} className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-violet-300/15 bg-violet-300/[0.07] px-2.5 text-[9px] font-semibold text-violet-100 transition hover:bg-violet-300/[0.12] disabled:cursor-wait disabled:opacity-60">
            {isAnalyzing ? <LoaderCircle size={12} className="animate-spin" /> : assessment ? <RefreshCw size={12} /> : <Sparkles size={12} />}
            {isAnalyzing ? 'Reviewing…' : assessment ? 'Re-analyze' : 'Analyze report'}
          </button>
        </div>

        <p className="mt-2 flex items-start gap-1.5 text-[8px] leading-4 text-slate-600">
          <ShieldCheck size={10} className="mt-0.5 shrink-0 text-emerald-300/60" />
          When Gemini is configured, this action sends the report text to Google Gemini. Do not include personal or sensitive information.
        </p>

        {error && <p role="alert" className="mt-3 rounded-lg border border-red-300/15 bg-red-300/[0.05] p-2.5 text-[9px] leading-4 text-red-100">{error}</p>}

        <AnimatePresence mode="wait">
          {isAnalyzing ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4 flex items-center gap-3 rounded-xl border border-white/[0.06] bg-black/10 p-4">
              <LoaderCircle size={16} className="animate-spin text-violet-200" />
              <div><p className="text-[10px] font-medium text-slate-200">Reviewing report signals</p><p className="mt-1 text-[8px] text-slate-600">Preparing advisory output · no dispatch actions</p></div>
            </motion.div>
          ) : assessment ? (
            <motion.div key={`${incident.id}-${assessment.analyzedAt}`} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                <Metric label="Suggested category" value={suggestedCategory} />
                <Metric label="Estimated severity" value={assessment.severity} tone={assessment.severity === 'Critical' || assessment.severity === 'High' ? 'text-red-200' : 'text-amber-100'} />
                <Metric label="Analysis mode" value={assessment.provider === 'gemini' ? 'Gemini · advisory' : 'Demo · local rules'} tone={assessment.provider === 'gemini' ? 'text-violet-100' : 'text-amber-100'} />
              </div>

              {assessment.fallbackReason && (
                <p role="status" className="mt-2 rounded-lg border border-amber-300/10 bg-amber-300/[0.035] px-2.5 py-2 text-[8px] leading-4 text-amber-100/75">
                  Gemini unavailable: {assessment.fallbackReason} Showing the explicitly labelled local demo assessment.
                </p>
              )}

              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-white/[0.06] bg-[#080e18]/60 p-3">
                  <h3 className="text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-500">Why this severity?</h3>
                  <p className="mt-2 text-[10px] leading-5 text-slate-300">{assessment.severityReason}</p>
                </div>
                <div className="rounded-xl border border-white/[0.06] bg-[#080e18]/60 p-3">
                  <h3 className="text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-500">Admin summary</h3>
                  <p className="mt-2 text-[10px] leading-5 text-slate-300">{assessment.summary}</p>
                </div>
              </div>

              {assessment.duplicates?.length > 0 && (
                <div className="mt-3 rounded-xl border border-amber-300/10 bg-amber-300/[0.025] p-3">
                  <h3 className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-amber-100"><AlertTriangle size={11} /> Possible similar reports · review manually</h3>
                  <ul className="mt-2 space-y-1.5">
                    {assessment.duplicates.map((duplicate) => (
                      <li key={duplicate.id} className="flex flex-wrap items-center justify-between gap-2 text-[9px] text-slate-400">
                        <span><span className="font-mono text-slate-300">{duplicate.id}</span> · {duplicate.title} <span className="text-slate-600">· {duplicate.location}</span></span>
                        <span className="rounded bg-amber-300/[0.06] px-1.5 py-0.5 text-amber-100/80">{Math.round(duplicate.score * 100)}% signal overlap</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {assessment.duplicates?.length === 0 && (
                <p className="mt-3 flex items-center gap-1.5 text-[8px] text-slate-600"><CircleAlert size={10} /> No similar stored reports met the demo matching threshold. This does not rule out duplicates.</p>
              )}

              <div className="mt-3 rounded-xl border border-white/[0.06] bg-[#080e18]/60 p-3">
                <h3 className="text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-500">Suggested next steps</h3>
                <ul className="mt-2 space-y-1.5">
                  {(assessment.nextSteps || []).map((step, index) => (
                    <li key={`${index}-${step}`} className="flex gap-2 text-[9px] leading-4 text-slate-400"><span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-violet-200/70" />{step}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <p className="text-[8px] leading-4 text-slate-600">Suggestions never update a report until an operator reviews them. Not a diagnosis or dispatch instruction.</p>
                <button type="button" onClick={applyAssessment} disabled={!knownCategories.includes(suggestedCategory) || Boolean(assessment.reviewedAt)} className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-emerald-300/15 bg-emerald-300/[0.055] px-2.5 text-[9px] font-semibold text-emerald-100 transition hover:bg-emerald-300/[0.1] disabled:cursor-not-allowed disabled:opacity-45">
                  {assessment.reviewedAt ? <Check size={12} /> : <ShieldCheck size={12} />}
                  {assessment.reviewedAt ? 'Reviewed by operator' : 'Accept assessment'}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.p key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4 rounded-xl border border-dashed border-white/[0.08] p-4 text-center text-[9px] leading-5 text-slate-600">
              Analyze this selected report to see a classification, human-reviewed severity estimate, concise summary, duplicate signals, and advisory next steps.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

function Metric({ label, value, tone = 'text-slate-100' }) {
  return (
    <div className="min-w-0 rounded-lg border border-white/[0.055] bg-[#080e18]/70 p-2.5">
      <p className="text-[8px] font-semibold uppercase tracking-[0.09em] text-slate-600">{label}</p>
      <p className={`mt-1 truncate text-[10px] font-semibold ${tone}`}>{value}</p>
    </div>
  )
}
