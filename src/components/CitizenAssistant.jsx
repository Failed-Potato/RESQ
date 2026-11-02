import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Bot, CircleAlert, LoaderCircle, Send, ShieldCheck, Sparkles } from 'lucide-react'
import { requestIntelligence } from '../data/aiClient.js'
import { getDemoAssistantReply, intelligenceLanguages } from '../data/intelligence.js'

const welcomeMessages = {
  en: 'I can share general safety guidance. I do not monitor emergencies or contact responders. If anyone may be in immediate danger in India, call 112 directly.',
  hi: 'मैं सामान्य सुरक्षा जानकारी दे सकता हूँ। मैं आपात स्थितियों की निगरानी या सहायता नहीं भेजता। भारत में तत्काल खतरा हो तो 112 पर सीधे कॉल करें।',
  pa: 'ਮੈਂ ਆਮ ਸੁਰੱਖਿਆ ਜਾਣਕਾਰੀ ਦੇ ਸਕਦਾ ਹਾਂ। ਮੈਂ ਐਮਰਜੈਂਸੀ ਦੀ ਨਿਗਰਾਨੀ ਜਾਂ ਮਦਦ ਨਹੀਂ ਭੇਜਦਾ। ਭਾਰਤ ਵਿੱਚ ਤੁਰੰਤ ਖ਼ਤਰਾ ਹੋਵੇ ਤਾਂ 112 ਤੇ ਸਿੱਧਾ ਕਾਲ ਕਰੋ।',
}

export default function CitizenAssistant() {
  const [language, setLanguage] = useState('en')
  const [messages, setMessages] = useState([{ role: 'assistant', text: welcomeMessages.en, provider: 'demo' }])
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [notice, setNotice] = useState('')
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [messages, isSending])

  function changeLanguage(nextLanguage) {
    setLanguage(nextLanguage)
    setMessages([{ role: 'assistant', text: welcomeMessages[nextLanguage], provider: 'demo' }])
    setNotice('')
  }

  async function sendMessage(event) {
    event.preventDefault()
    const text = input.trim()
    if (!text || isSending) return

    const nextMessages = [...messages, { role: 'user', text }]
    setMessages(nextMessages)
    setInput('')
    setIsSending(true)
    setNotice('')

    try {
      const { result, provider, fallbackReason } = await requestIntelligence('assistant', {
        language,
        messages: nextMessages.slice(-7).map(({ role, text: messageText }) => ({ role, text: messageText })),
      }, getDemoAssistantReply(text, language))

      if (typeof result !== 'string' || !result.trim()) throw new Error('The assistant returned an empty reply.')
      setMessages((current) => [...current, { role: 'assistant', text: result, provider }])
      setNotice(fallbackReason)
    } catch (error) {
      setMessages((current) => [...current, {
        role: 'assistant',
        text: getDemoAssistantReply(text, language),
        provider: 'demo',
      }])
      setNotice(`The assistant could not complete the request (${error.message}); showing local demo guidance.`)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <section id="assistant" className="command-panel p-4 sm:p-5" aria-labelledby="assistant-title">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-red-300/10 bg-red-300/[0.07] text-red-200"><Bot size={17} /></span>
          <div>
            <p className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-red-200/80"><Sparkles size={10} /> RESQ AI · safety guide</p>
            <h2 id="assistant-title" className="mt-1 text-sm font-semibold text-white">Ask a safety question</h2>
          </div>
        </div>
        <label className="relative">
          <span className="sr-only">Assistant language</span>
          <select value={language} onChange={(event) => changeLanguage(event.target.value)} className="h-8 rounded-lg border border-white/[0.08] bg-[#080e18] px-2.5 text-[9px] text-slate-300 outline-none focus:border-red-300/30">
            {intelligenceLanguages.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
        </label>
      </div>

      <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-300/10 bg-amber-300/[0.035] p-2.5">
        <CircleAlert size={12} className="mt-0.5 shrink-0 text-amber-200/80" />
        <p className="text-[8px] leading-4 text-amber-100/70">{language === 'hi' ? 'यह सामान्य मार्गदर्शन है। यह सहायक निगरानी नहीं करता और सहायता नहीं भेज सकता। भारत में आपात स्थिति में 112 पर सीधे कॉल करें।' : language === 'pa' ? 'ਇਹ ਆਮ ਜਾਣਕਾਰੀ ਹੈ। ਇਹ ਸਹਾਇਕ ਨਿਗਰਾਨੀ ਜਾਂ ਮਦਦ ਨਹੀਂ ਭੇਜ ਸਕਦਾ। ਭਾਰਤ ਵਿੱਚ ਐਮਰਜੈਂਸੀ ਲਈ 112 ਤੇ ਸਿੱਧਾ ਕਾਲ ਕਰੋ।' : 'General guidance only. This assistant is not monitored, cannot call or dispatch help, and may be wrong. Call 112 directly for emergencies in India.'}</p>
      </div>

      <div className="mt-3 flex h-[235px] flex-col overflow-y-auto rounded-xl border border-white/[0.06] bg-[#080e18]/75 p-3" aria-live="polite">
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {messages.map((message, index) => (
              <motion.div
                key={`${index}-${message.role}`}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`max-w-[92%] rounded-xl px-3 py-2.5 text-[9px] leading-5 ${
                  message.role === 'user'
                    ? 'ml-auto border border-red-300/10 bg-red-300/[0.06] text-red-50/90'
                    : 'border border-white/[0.05] bg-white/[0.025] text-slate-300'
                }`}
              >
                {message.text}
                {message.role === 'assistant' && (
                  <span className="mt-1.5 block text-[7px] font-semibold uppercase tracking-[0.11em] text-slate-600">
                    {message.provider === 'gemini' ? 'Gemini · advisory' : 'Local demo guidance'}
                  </span>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {isSending && (
            <div className="flex items-center gap-2 text-[9px] text-slate-500" role="status">
              <LoaderCircle size={12} className="animate-spin text-red-200" /> Preparing safety guidance…
            </div>
          )}
          <div ref={endRef} />
        </div>
      </div>

      {notice && <p role="status" className="mt-2 text-[8px] leading-4 text-amber-100/70">{notice}</p>}

      <form className="mt-3 flex gap-2" onSubmit={sendMessage}>
        <label className="min-w-0 flex-1">
          <span className="sr-only">Ask a general safety question</span>
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            maxLength={1000}
            placeholder="Ask a general safety question…"
            className="dashboard-field h-10"
            disabled={isSending}
          />
        </label>
        <button type="submit" disabled={!input.trim() || isSending} aria-label="Send safety question" className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-300/15 bg-red-400/[0.08] text-red-100 transition hover:bg-red-400/[0.14] disabled:cursor-not-allowed disabled:opacity-40">
          {isSending ? <LoaderCircle size={14} className="animate-spin" /> : <Send size={14} />}
        </button>
      </form>
      <p className="mt-2 flex items-center gap-1.5 text-[8px] text-slate-600"><ShieldCheck size={10} className="text-emerald-300/60" /> Messages go to Gemini only when the server key is configured; avoid personal details.</p>
    </section>
  )
}
