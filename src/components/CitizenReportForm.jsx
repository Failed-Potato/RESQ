import { useEffect, useState } from 'react'
import { AlertCircle, ArrowRight, BrainCircuit, Camera, Check, ChevronDown, LoaderCircle, ShieldAlert, Sparkles, X } from 'lucide-react'
import { requestIntelligence } from '../data/aiClient.js'
import { analyzeIncident, intelligenceLanguages } from '../data/intelligence.js'
import { createCompressedPhoto } from '../data/photoAttachment.js'

const categories = [
  { value: 'Medical', en: 'Medical emergency', hi: 'चिकित्सा आपातस्थिति' },
  { value: 'Fire', en: 'Fire or smoke', hi: 'आग या धुआँ' },
  { value: 'Traffic', en: 'Road accident or traffic hazard', hi: 'सड़क दुर्घटना या यातायात खतरा' },
  { value: 'Flood', en: 'Flood or waterlogging', hi: 'बाढ़ या जलभराव' },
  { value: 'Earthquake', en: 'Earthquake-related concern', hi: 'भूकंप से जुड़ी स्थिति' },
  { value: 'Cyclone', en: 'Cyclone or storm', hi: 'चक्रवात या तूफान' },
  { value: 'Landslide', en: 'Landslide or slope hazard', hi: 'भूस्खलन या ढलान का खतरा' },
  { value: 'Weather', en: 'Other severe weather', hi: 'अन्य गंभीर मौसम' },
  { value: 'Infrastructure', en: 'Infrastructure or utility hazard', hi: 'बुनियादी ढाँचा या उपयोगिता खतरा' },
  { value: 'Public Safety', en: 'Public safety concern', hi: 'जन-सुरक्षा संबंधी चिंता' },
  { value: 'Other', en: 'Other incident', hi: 'अन्य घटना' },
]

export default function CitizenReportForm({ location, incidents = [], onSubmit, language = 'en' }) {
  const [category, setCategory] = useState('Medical')
  const [severity, setSeverity] = useState('Moderate')
  const [description, setDescription] = useState('')
  const [address, setAddress] = useState('')
  const [pinCode, setPinCode] = useState('')
  const [photo, setPhoto] = useState(null)
  const [isCompressing, setIsCompressing] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [analysisLanguage, setAnalysisLanguage] = useState('en')
  const [error, setError] = useState('')

  useEffect(() => {
    setAnalysis(null)
  }, [location])

  async function analyzeDescription() {
    if (description.trim().length < 8) {
      setError('Add at least 8 characters of incident details before requesting an advisory analysis.')
      return
    }

    setError('')
    setIsAnalyzing(true)
    const report = {
      category,
      summary: description.trim(),
      location: location.label,
      state: location.state,
      district: location.district,
      address: address.trim(),
      pinCode,
      coordinates: location.coordinates,
    }
    const fallback = analyzeIncident(report, incidents, analysisLanguage)

    try {
      const { result, provider, fallbackReason } = await requestIntelligence('analyze', {
        description: description.trim(),
        category,
        language: analysisLanguage,
      }, fallback)
      setAnalysis({
        ...fallback,
        ...result,
        duplicates: fallback.duplicates,
        language: analysisLanguage,
        provider,
        fallbackReason,
        advisory: true,
        analyzedAt: Date.now(),
      })
    } catch (analysisError) {
      setError(`Unable to analyze this description: ${analysisError.message}`)
    } finally {
      setIsAnalyzing(false)
    }
  }

  async function handlePhotoChange(event) {
    const file = event.target.files?.[0]
    if (!file) return

    setError('')
    setIsCompressing(true)
    try {
      setPhoto(await createCompressedPhoto(file))
    } catch (photoError) {
      setPhoto(null)
      setError(photoError.message)
    } finally {
      setIsCompressing(false)
      event.target.value = ''
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    setError('')

    try {
      const incident = onSubmit({
        category,
        title: categories.find((item) => item.value === category)?.en || 'Citizen report',
        severity,
        status: 'Active',
        location: location.label,
        state: location.state,
        district: location.district,
        address: address.trim(),
        pinCode,
        coordinates: location.coordinates,
        summary: description.trim(),
        source: 'Simulated citizen report',
        reporterType: 'citizen',
        assignedUnit: 'Unassigned',
        reportedAt: Date.now(),
        photo,
        intelligence: analysis,
      })
      if (!incident) throw new Error('The sample report could not be saved.')
      setDescription('')
      setAddress('')
      setPinCode('')
      setPhoto(null)
      setAnalysis(null)
    } catch (submitError) {
      setError(submitError.message || 'The sample report could not be saved to this browser.')
    }
  }

  return (
    <section id="report" className="command-panel scroll-mt-24 p-4 sm:p-6" aria-labelledby="report-title">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-400/[0.09] text-red-200">
          <ShieldAlert size={18} />
        </span>
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-red-300">Citizen report · simulated</p>
          <h2 id="report-title" className="mt-1 text-lg font-semibold tracking-tight text-white">{language === 'hi' ? 'क्या हुआ है, बताएँ' : 'Tell us what’s happening'}</h2>
          <p className="mt-1 text-[10px] leading-4 text-slate-500">{language === 'hi' ? 'यह ब्राउज़र में नमूना रिपोर्ट बनाता है; आपातकालीन सेवाओं से संपर्क नहीं होगा।' : 'Creates a simulated report in this browser. It will not contact emergency services.'}</p>
        </div>
      </div>

      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-[10px] font-medium text-slate-300">{language === 'hi' ? 'घटना का प्रकार' : 'Emergency category'}</span>
            <select
              value={category}
              onChange={(event) => {
                setCategory(event.target.value)
                setAnalysis(null)
              }}
              className="dashboard-field"
            >
              {categories.map((item) => <option key={item.value} value={item.value}>{item[language]}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[10px] font-medium text-slate-300">{language === 'hi' ? 'अनुमानित तात्कालिकता' : 'Perceived urgency'}</span>
            <select value={severity} onChange={(event) => { setSeverity(event.target.value); setAnalysis(null) }} className="dashboard-field">
              <option value="Low">{language === 'hi' ? 'कम · जानकारी' : 'Low · informational'}</option>
              <option value="Moderate">{language === 'hi' ? 'मध्यम · ध्यान आवश्यक' : 'Moderate · needs attention'}</option>
              <option value="High">{language === 'hi' ? 'उच्च · तात्कालिक चिंता' : 'High · urgent concern'}</option>
              <option value="Critical">{language === 'hi' ? 'गंभीर · तत्काल खतरा' : 'Critical · immediate danger'}</option>
            </select>
          </label>
        </div>

        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_150px]">
          <label className="block">
            <span className="mb-1.5 block text-[10px] font-medium text-slate-300">{language === 'hi' ? 'मकान / सड़क / क्षेत्र का पता' : 'House / street / locality address'}</span>
            <input required maxLength={140} value={address} onChange={(event) => setAddress(event.target.value)} placeholder={language === 'hi' ? 'मकान, सड़क, क्षेत्र' : 'House, street, locality'} className="dashboard-field" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[10px] font-medium text-slate-300">{language === 'hi' ? 'पिन कोड' : 'PIN code'}</span>
            <input required inputMode="numeric" autoComplete="postal-code" pattern="[1-9][0-9]{5}" maxLength={6} value={pinCode} onChange={(event) => setPinCode(event.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="6-digit PIN" className="dashboard-field font-mono tracking-widest" />
          </label>
        </div>

        <label className="block">
          <span className="mb-1.5 flex items-center justify-between text-[10px] font-medium text-slate-300">
            {language === 'hi' ? 'घटना का विवरण' : 'Situation details'}
            <span className="font-normal text-slate-600">{description.length}/500</span>
          </span>
          <textarea
            required
            minLength={8}
            maxLength={500}
            rows={4}
            value={description}
            onChange={(event) => { setDescription(event.target.value); setAnalysis(null) }}
            placeholder={language === 'hi' ? 'जो देखा उसका वर्णन करें। नाम, फोन नंबर या अन्य व्यक्तिगत जानकारी न दें।' : 'Describe what you observed. Please do not include names, phone numbers, or other personal information.'}
            className="dashboard-field h-auto resize-y py-3 leading-5"
          />
        </label>

        <div className="rounded-xl border border-violet-300/[0.12] bg-violet-300/[0.025] p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-[9px] font-semibold text-violet-100/90"><BrainCircuit size={13} />{language === 'hi' ? 'घटना का परामर्श विश्लेषण · मानव समीक्षा आवश्यक' : 'Advisory incident analysis · human review required'}</span>
            <div className="flex items-center gap-2">
              <label className="relative">
                <span className="sr-only">Classification language</span>
                <select value={analysisLanguage} onChange={(event) => { setAnalysisLanguage(event.target.value); setAnalysis(null) }} className="h-7 appearance-none rounded-md border border-white/[0.08] bg-[#080e18] pl-2 pr-6 text-[8px] text-slate-300 outline-none">
                  {intelligenceLanguages.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
                <ChevronDown size={10} className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-500" />
              </label>
              <button type="button" onClick={analyzeDescription} disabled={isAnalyzing} className="inline-flex h-7 items-center gap-1 rounded-md border border-violet-300/15 bg-violet-300/[0.07] px-2 text-[8px] font-semibold text-violet-100 transition hover:bg-violet-300/[0.12] disabled:cursor-wait disabled:opacity-50">
                {isAnalyzing ? <LoaderCircle size={10} className="animate-spin" /> : <Sparkles size={10} />}
                {isAnalyzing ? (language === 'hi' ? 'विश्लेषण हो रहा है…' : 'Analyzing…') : (language === 'hi' ? 'विवरण का विश्लेषण करें' : 'Analyze description')}
              </button>
            </div>
          </div>
          <p className="mt-1.5 text-[8px] leading-4 text-slate-600">{language === 'hi' ? 'Gemini सक्षम होने पर यह पाठ विश्लेषण हेतु Google को भेजा जाएगा। निजी जानकारी न दें। Gemini उपलब्ध न होने पर स्थानीय डेमो नियम उपयोग होंगे।' : 'If Gemini is enabled, this text is sent to Google for analysis. Avoid personal details. Local rule-based demo is used when Gemini is unavailable.'}</p>
          {analysis && (
            <div className="mt-3 border-t border-white/[0.06] pt-3" aria-live="polite">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-md border border-white/[0.06] bg-black/10 px-2 py-1 text-[8px] text-slate-300">Category: {analysis.suggestedCategory}</span>
                <span className="rounded-md border border-white/[0.06] bg-black/10 px-2 py-1 text-[8px] text-slate-300">Estimated: {analysis.severity}</span>
                <span className="rounded-md border border-white/[0.06] bg-black/10 px-2 py-1 text-[8px] text-amber-100/80">{analysis.provider === 'gemini' ? 'Gemini · advisory' : 'Demo · local rules'}</span>
              </div>
              {analysis.fallbackReason && <p role="status" className="mt-2 text-[8px] leading-4 text-amber-100/75">{analysis.fallbackReason}</p>}
              <p className="mt-2 text-[9px] leading-4 text-slate-400">{analysis.severityReason}</p>
              {analysis.duplicates?.length > 0 && (
                <p className="mt-2 text-[8px] leading-4 text-amber-100/80">Possible similar report{analysis.duplicates.length === 1 ? '' : 's'}: {analysis.duplicates.map((item) => item.id).join(', ')}. Please review; this match is not a confirmation.</p>
              )}
              <button
                type="button"
                onClick={() => {
                  if (categories.some((item) => item.value === analysis.suggestedCategory)) setCategory(analysis.suggestedCategory)
                  if (['Low', 'Moderate', 'High', 'Critical'].includes(analysis.severity)) setSeverity(analysis.severity)
                }}
                className="mt-2 rounded-md border border-violet-300/10 px-2 py-1 text-[8px] font-semibold text-violet-100/80 transition hover:bg-violet-300/[0.06]"
              >
                {language === 'hi' ? 'सुझाई गई श्रेणी और तात्कालिकता चुनें' : 'Use suggested category & urgency'}
              </button>
            </div>
          )}
        </div>

        <label className="block">
          <span className="mb-1.5 block text-[10px] font-medium text-slate-300">{language === 'hi' ? 'घटना की तस्वीर' : 'Incident photograph'} <span className="font-normal text-slate-600">· {language === 'hi' ? 'वैकल्पिक, इस ब्राउज़र में संग्रहित' : 'optional, stored in this browser'}</span></span>
          <span className="flex min-h-11 items-center gap-3 rounded-xl border border-dashed border-white/[0.12] bg-[#090f19] px-3 py-2 transition hover:border-red-300/30">
            {isCompressing ? <LoaderCircle size={16} className="animate-spin text-red-300" /> : <Camera size={16} className="text-slate-500" />}
            <span className="min-w-0 flex-1 truncate text-[10px] text-slate-400">{isCompressing ? (language === 'hi' ? 'तस्वीर छोटी करके संग्रहित हो रही है…' : 'Compressing image for local storage…') : photo ? `${photo.name} · ${(photo.size / 1024).toFixed(0)} KB` : language === 'hi' ? 'JPG, PNG या WebP जोड़ें · अधिकतम 10 MB' : 'Add JPG, PNG, or WebP · up to 10 MB before compression'}</span>
            {photo && <Check size={14} className="text-emerald-300" />}
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhotoChange} disabled={isCompressing} className="sr-only" aria-label="Upload incident photograph" />
          </span>
          {photo && (
            <span className="mt-2 flex items-center gap-3 rounded-lg border border-white/[0.06] bg-[#090f19] p-2">
              <img src={photo.dataUrl} alt="Selected incident preview" className="h-14 w-16 rounded-md object-cover" />
              <span className="flex-1 text-[9px] leading-4 text-slate-500">{language === 'hi' ? 'तस्वीर संपीड़ित करके इस डिवाइस पर नमूना रिपोर्ट के साथ सहेजी गई।' : 'Compressed and saved with this sample report on this device.'}</span>
              <button type="button" onClick={() => setPhoto(null)} className="rounded-md p-1.5 text-slate-500 hover:bg-white/5 hover:text-white" aria-label="Remove incident photograph"><X size={14} /></button>
            </span>
          )}
        </label>

        {error && <p role="alert" className="flex items-start gap-2 rounded-lg border border-red-400/15 bg-red-400/[0.05] p-3 text-[10px] leading-4 text-red-200"><AlertCircle size={14} className="mt-0.5 shrink-0" />{error}</p>}

        <button type="submit" disabled={isCompressing} className="button-primary w-full !min-h-11">
          {language === 'hi' ? 'नमूना रिपोर्ट जमा करें' : 'Submit sample report'} <ArrowRight size={15} />
        </button>
        <p className="text-center text-[9px] leading-4 text-slate-600">{language === 'hi' ? 'भारत में तत्काल सहायता के लिए 112 पर सीधे कॉल करें। इस प्रोटोटाइप की निगरानी नहीं होती और यह कॉल नहीं करता।' : 'For immediate help in India, call 112 directly. This prototype is not monitored and does not place calls.'}</p>
      </form>
    </section>
  )
}
