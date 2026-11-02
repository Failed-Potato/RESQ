import { AnimatePresence, motion } from 'framer-motion'
import { Bell, Check, X } from 'lucide-react'

export default function DashboardNotifications({ notifications, onDismiss, onDismissAll, onGenerate }) {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[#0d1523] p-4 sm:p-5" aria-labelledby="notifications-title">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-red-400/10 text-red-300">
            <Bell size={17} />
            {notifications.length > 0 && <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-[#0d1523] bg-red-400" />}
          </span>
          <div>
            <h2 id="notifications-title" className="text-sm font-semibold text-white">Demo alerts</h2>
            <p className="mt-0.5 text-[10px] text-slate-500">Simulated dashboard notifications</p>
          </div>
        </div>
        <div className="flex gap-2">
          {notifications.length > 0 && (
            <button type="button" onClick={onDismissAll} className="rounded-lg px-2.5 py-2 text-[10px] text-slate-500 transition hover:bg-white/5 hover:text-slate-300">
              Dismiss all
            </button>
          )}
          <button type="button" onClick={onGenerate} className="rounded-lg border border-red-400/20 bg-red-400/[0.07] px-3 py-2 text-[10px] font-semibold text-red-200 transition hover:bg-red-400/[0.13]">
            Generate demo alert
          </button>
        </div>
      </div>

      <div className="mt-3 space-y-2" aria-live="polite">
        <AnimatePresence initial={false}>
          {notifications.map((notification) => (
            <motion.article
              key={notification.id}
              layout
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, x: 16, height: 0 }}
              transition={{ duration: 0.22 }}
              role="alert"
              className="flex items-start gap-3 overflow-hidden rounded-xl border border-white/[0.06] bg-[#0a111d] p-3"
            >
              <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                notification.tone === 'blue' ? 'bg-sky-400/10 text-sky-300' : 'bg-red-400/10 text-red-300'
              }`}>
                {notification.tone === 'blue' ? <Check size={14} /> : <Bell size={14} />}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <p className="text-[11px] font-semibold text-slate-200">{notification.title}</p>
                  <span className="text-[9px] text-slate-600">{notification.time}</span>
                </div>
                <p className="mt-1 text-[10px] leading-4 text-slate-500">{notification.message}</p>
              </div>
              <button
                type="button"
                onClick={() => onDismiss(notification.id)}
                aria-label={`Dismiss ${notification.title}`}
                className="rounded-md p-1 text-slate-600 transition hover:bg-white/5 hover:text-slate-300"
              >
                <X size={14} />
              </button>
            </motion.article>
          ))}
        </AnimatePresence>
        {notifications.length === 0 && (
          <p className="rounded-xl border border-dashed border-white/10 px-4 py-5 text-center text-[11px] text-slate-500">
            No demo alerts. Generate one to preview an animated notification.
          </p>
        )}
      </div>
    </section>
  )
}
