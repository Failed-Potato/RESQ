import { motion } from 'framer-motion'
import { BookOpen, ClipboardPlus, Map, ShieldAlert, Sparkles, UsersRound } from 'lucide-react'

const features = [
  {
    number: '01',
    title: 'Emergency SOS',
    description: 'A considered interaction concept for reaching the right next step in a stressful moment.',
    icon: ShieldAlert,
    tone: 'red',
  },
  {
    number: '02',
    title: 'Incident map',
    description: 'A location-aware view designed to make sample incident information easier to understand.',
    icon: Map,
    tone: 'blue',
  },
  {
    number: '03',
    title: 'Incident reporting',
    description: 'A simple reporting flow concept that keeps clarity and useful context at the center.',
    icon: ClipboardPlus,
    tone: 'amber',
  },
  {
    number: '04',
    title: 'Safety guides',
    description: 'Practical preparedness content, organized to be easier to find and follow.',
    icon: BookOpen,
    tone: 'green',
  },
  {
    number: '05',
    title: 'Emergency contacts',
    description: 'A future directory concept for keeping important contact information close at hand.',
    icon: UsersRound,
    tone: 'violet',
  },
  {
    number: '06',
    title: 'AI safety assistant',
    description: 'An idea for guided safety information, designed with clear limits and responsible use.',
    icon: Sparkles,
    tone: 'cyan',
  },
]

const toneClasses = {
  red: 'bg-red-400/10 text-red-300',
  blue: 'bg-sky-400/10 text-sky-300',
  amber: 'bg-amber-400/10 text-amber-300',
  green: 'bg-emerald-400/10 text-emerald-300',
  violet: 'bg-violet-400/10 text-violet-300',
  cyan: 'bg-cyan-400/10 text-cyan-300',
}

export default function FeatureGrid() {
  return (
    <section id="platform" className="relative border-y border-white/[0.06] bg-[#0a111d]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(75,93,123,0.09),transparent_60%)]" />
      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">DESIGNED AROUND PEOPLE</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
            Safety tools, <span className="text-slate-500">made more human.</span>
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">
            A thoughtful foundation for everyday preparedness and emergency awareness. These are planned capabilities—not active services.
          </p>
        </div>

        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.article
                key={feature.number}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: (index % 3) * 0.07 }}
                className="group rounded-2xl border border-white/[0.07] bg-[#0d1523]/75 p-6 transition duration-300 hover:-translate-y-1 hover:border-white/[0.14] hover:bg-[#111b2b]"
              >
                <div className="flex items-center justify-between">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${toneClasses[feature.tone]}`}>
                    <Icon size={20} />
                  </span>
                  <span className="text-[10px] font-medium tracking-[0.16em] text-slate-600">PLANNED</span>
                </div>
                <div className="mt-8 flex items-baseline gap-2">
                  <span className="text-[10px] font-medium tracking-wider text-slate-600">{feature.number}</span>
                  <h3 className="text-base font-semibold text-slate-100">{feature.title}</h3>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-500">{feature.description}</p>
              </motion.article>
            )
          })}
        </div>
        <p className="mt-6 text-center text-[11px] text-slate-600">
          Incident tracking and an admin dashboard are also part of the future product direction.
        </p>
      </div>
    </section>
  )
}
