import { BookOpenCheck, ChevronDown, HeartPulse, Phone, ShieldAlert, Wind } from 'lucide-react'

const guides = [
  {
    title: { en: 'Earthquake safety', hi: 'भूकंप से सुरक्षा' },
    icon: ShieldAlert,
    points: {
      en: [
        'During shaking indoors, Drop, Cover and Hold On; protect your head and stay away from glass.',
        'Do not use lifts. If outdoors, move to an open area away from buildings, walls, trees and overhead wires.',
        'After shaking, expect aftershocks; avoid damaged buildings and follow official local instructions.',
      ],
      hi: [
        'घर के अंदर झटके महसूस हों तो झुकें, मजबूत मेज के नीचे ढकें और पकड़े रहें; सिर बचाएँ और शीशे से दूर रहें।',
        'लिफ्ट का उपयोग न करें। बाहर हों तो इमारतों, दीवारों, पेड़ों और ऊपर के तारों से दूर खुली जगह जाएँ।',
        'झटकों के बाद आफ्टरशॉक संभव हैं; क्षतिग्रस्त इमारतों से दूर रहें और स्थानीय आधिकारिक निर्देश मानें।',
      ],
    },
  },
  {
    title: { en: 'Flood and severe weather', hi: 'बाढ़ और गंभीर मौसम' },
    icon: Wind,
    points: {
      en: [
        'Avoid flooded roads and flowing water; never walk, ride or drive through floodwater.',
        'Move away from electrical hazards and follow official weather and local-authority updates.',
        'Evacuate only when instructed by the responsible authorities; RESQ does not issue evacuation orders.',
      ],
      hi: [
        'जलमग्न सड़कों और बहते पानी से दूर रहें; बाढ़ के पानी में पैदल या वाहन से न जाएँ।',
        'बिजली के खतरों से दूर रहें और मौसम विभाग तथा स्थानीय प्रशासन की आधिकारिक जानकारी देखें।',
        'निकासी केवल जिम्मेदार अधिकारियों के निर्देश पर करें; RESQ निकासी आदेश जारी नहीं करता।',
      ],
    },
  },
  {
    title: { en: 'If you encounter a fire', hi: 'आग लगने पर' },
    icon: ShieldAlert,
    points: {
      en: [
        'Move away from fire and smoke; use stairs rather than elevators.',
        'Once at a safe distance, call 112 for immediate emergency assistance in India.',
        'Do not re-enter until responsible officials say it is safe.',
      ],
      hi: [
        'आग और धुएँ से दूर जाएँ; लिफ्ट के बजाय सीढ़ियों का उपयोग करें।',
        'सुरक्षित दूरी पर पहुँचकर भारत में तत्काल सहायता के लिए 112 पर कॉल करें।',
        'जिम्मेदार अधिकारी के सुरक्षित बताने तक वापस अंदर न जाएँ।',
      ],
    },
  },
  {
    title: { en: 'When someone needs medical help', hi: 'चिकित्सा सहायता की आवश्यकता होने पर' },
    icon: HeartPulse,
    points: {
      en: [
        'Check that the scene is safe before approaching.',
        'For urgent or life-threatening emergencies in India, call 112 directly.',
        'Follow the emergency operator’s instructions and do not put yourself in danger.',
      ],
      hi: [
        'पास जाने से पहले सुनिश्चित करें कि स्थान सुरक्षित है।',
        'भारत में तत्काल या जीवन-जोखिम वाली आपात स्थिति में सीधे 112 पर कॉल करें।',
        'आपातकालीन ऑपरेटर के निर्देश मानें और स्वयं को खतरे में न डालें।',
      ],
    },
  },
]

export default function CitizenSafetyGuides({ language = 'en' }) {
  const lang = language === 'hi' ? 'hi' : 'en'

  return (
    <section id="safety" className="scroll-mt-24" aria-labelledby="safety-title">
      <div className="mb-3 flex items-end justify-between gap-3 px-1">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-red-300">{lang === 'hi' ? 'तैयारी' : 'Preparedness'}</p>
          <h2 id="safety-title" className="mt-1 text-base font-semibold text-white">{lang === 'hi' ? 'सुरक्षा मार्गदर्शिकाएँ' : 'Safety guides'}</h2>
        </div>
        <BookOpenCheck size={17} className="mb-1 text-slate-500" />
      </div>
      <div className="space-y-2">
        {guides.map(({ title, icon: Icon, points }) => (
          <details key={title.en} className="group rounded-xl border border-white/[0.07] bg-[#0d1523]">
            <summary className="flex cursor-pointer list-none items-center gap-3 px-3.5 py-3.5 [&::-webkit-details-marker]:hidden">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] text-slate-300"><Icon size={15} /></span>
              <span className="flex-1 text-[10px] font-medium text-slate-200">{title[lang]}</span>
              <ChevronDown size={14} className="text-slate-600 transition-transform group-open:rotate-180" />
            </summary>
            <ul className="space-y-2 border-t border-white/[0.06] px-4 py-3.5 pl-14">
              {points[lang].map((point) => <li key={point} className="relative text-[9px] leading-4 text-slate-500 before:absolute before:-left-3 before:top-[7px] before:h-1 before:w-1 before:rounded-full before:bg-red-300/70">{point}</li>)}
            </ul>
          </details>
        ))}
      </div>
      <section className="mt-4 rounded-xl border border-white/[0.07] bg-[#0d1523] p-4" aria-labelledby="contact-title">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-300/[0.08] text-emerald-200"><Phone size={15} /></span>
          <div>
            <h3 id="contact-title" className="text-[11px] font-semibold text-white">{lang === 'hi' ? 'आपातकालीन संपर्क और आधिकारिक स्रोत' : 'Emergency contact & official sources'}</h3>
            <p className="mt-0.5 text-[9px] text-slate-600">{lang === 'hi' ? 'वास्तविक सहायता के लिए सीधे संपर्क करें।' : 'Use direct contact for real assistance.'}</p>
          </div>
        </div>
        <div className="mt-3 space-y-2">
          <a href="tel:112" className="flex items-center justify-between rounded-lg border border-red-300/10 bg-red-300/[0.035] px-3 py-2.5 transition hover:bg-red-300/[0.07]">
            <span><span className="block text-[10px] font-semibold text-slate-200">{lang === 'hi' ? 'भारत · आपातकालीन हेल्पलाइन' : 'India · Emergency helpline'}</span><span className="mt-0.5 block text-[8px] text-slate-600">{lang === 'hi' ? 'तत्काल सहायता के लिए सीधे कॉल करें' : 'Call directly for immediate assistance'}</span></span>
            <span className="text-sm font-semibold tracking-wide text-red-200">112</span>
          </a>
          <a href="https://ndma.gov.in/" target="_blank" rel="noreferrer" className="block rounded-lg border border-white/[0.06] bg-[#090f19] px-3 py-2.5 text-[9px] text-slate-300 transition hover:bg-white/[0.04]">
            {lang === 'hi' ? 'राष्ट्रीय आपदा प्रबंधन प्राधिकरण (NDMA) · आधिकारिक सुरक्षा मार्गदर्शन' : 'National Disaster Management Authority (NDMA) · Official safety guidance'}
          </a>
          <a href="https://ndma.gov.in/node/156" target="_blank" rel="noreferrer" className="block rounded-lg border border-white/[0.06] bg-[#090f19] px-3 py-2.5 text-[9px] text-slate-300 transition hover:bg-white/[0.04]">
            {lang === 'hi' ? 'NDMA · भूकंप सुरक्षा जानकारी' : 'NDMA · Earthquake safety information'}
          </a>
          <a href="https://seismo.gov.in/" target="_blank" rel="noreferrer" className="block rounded-lg border border-white/[0.06] bg-[#090f19] px-3 py-2.5 text-[9px] text-slate-300 transition hover:bg-white/[0.04]">
            {lang === 'hi' ? 'राष्ट्रीय भूकंप विज्ञान केंद्र (NCS) · आधिकारिक स्रोत' : 'National Centre for Seismology (NCS) · Official source'}
          </a>
        </div>
        <p className="mt-3 text-[8px] leading-4 text-slate-600">{lang === 'hi' ? 'RESQ आपातकालीन कॉल नहीं जोड़ता और आधिकारिक आदेश जारी नहीं करता।' : 'RESQ does not connect emergency calls or issue official orders.'}</p>
      </section>
    </section>
  )
}
