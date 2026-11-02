const categoryRules = [
  {
    category: 'Medical',
    terms: [
      'medical', 'injured', 'injury', 'bleeding', 'unconscious', 'not breathing', 'chest pain', 'collapsed',
      'घायल', 'चोट', 'खून', 'बेहोश', 'सांस नहीं', 'साँस नहीं', 'सीने में दर्द',
      'ਜ਼ਖ਼ਮੀ', 'ਸੱਟ', 'ਖੂਨ', 'ਬੇਹੋਸ਼', 'ਸਾਹ ਨਹੀਂ', 'ਛਾਤੀ ਵਿੱਚ ਦਰਦ',
      'zakhmi', 'chot', 'khoon', 'behosh', 'saah nahi',
    ],
  },
  {
    category: 'Fire',
    terms: [
      'fire', 'smoke', 'flame', 'burning', 'explosion', 'gas leak',
      'आग', 'धुआँ', 'धुआ', 'जल रहा', 'विस्फोट', 'गैस रिसाव',
      'ਅੱਗ', 'ਧੂੰਆਂ', 'ਧੂੰਆ', 'ਸੜ ਰਿਹਾ', 'ਧਮਾਕਾ', 'ਗੈਸ ਲੀਕ',
      'agg', 'dhuan', 'jal raha', 'blast',
    ],
  },
  {
    category: 'Traffic',
    terms: [
      'traffic', 'collision', 'crash', 'stalled vehicle', 'road blocked', 'road obstruction', 'pedestrian',
      'दुर्घटना', 'टक्कर', 'वाहन', 'सड़क बंद', 'सड़क अवरुद्ध', 'पैदल यात्री',
      'ਹਾਦਸਾ', 'ਟੱਕਰ', 'ਵਾਹਨ', 'ਸੜਕ ਬੰਦ', 'ਰਸਤਾ ਬੰਦ', 'ਪੈਦਲ ਯਾਤਰੀ',
      'accident', 'takra', 'sadak band', 'vehicle',
    ],
  },
  {
    category: 'Earthquake',
    terms: [
      'earthquake', 'tremor', 'seismic', 'aftershock',
      'भूकंप', 'झटका', 'झटके',
      'ਭੂਚਾਲ', 'ਝਟਕਾ', 'ਝਟਕੇ',
      'bhukamp',
    ],
  },
  {
    category: 'Landslide',
    terms: [
      'landslide', 'mudslide', 'rockfall', 'slope failure',
      'भूस्खलन', 'चट्टान गिर',
      'ਜ਼ਮੀਨ ਖਿਸਕ', 'ਪਹਾੜ ਖਿਸਕ',
    ],
  },
  {
    category: 'Flood',
    terms: [
      'flood', 'flooding', 'waterlogging', 'flash flood',
      'बाढ़', 'जलभराव', 'अचानक बाढ़',
      'ਹੜ੍ਹ', 'ਪਾਣੀ ਭਰ',
    ],
  },
  {
    category: 'Cyclone',
    terms: [
      'cyclone', 'cyclonic storm', 'storm surge',
      'चक्रवात', 'तूफानी लहर',
      'ਚੱਕਰਵਾਤ', 'ਤੂਫ਼ਾਨੀ ਲਹਿਰ',
    ],
  },
  {
    category: 'Weather',
    terms: [
      'weather', 'storm', 'heavy rain', 'lightning', 'tornado', 'heatwave',
      'तूफान', 'तूफ़ान', 'भारी बारिश', 'बिजली गिर', 'लू',
      'ਤੂਫ਼ਾਨ', 'ਭਾਰੀ ਮੀਂਹ', 'ਬਿਜਲੀ ਡਿੱਗ', 'ਗਰਮੀ ਦੀ ਲਹਿਰ',
      'barish', 'baarish', 'toofan',
    ],
  },
  {
    category: 'Infrastructure',
    terms: [
      'power outage', 'power line', 'downed wire', 'water main', 'water leak', 'signal outage', 'infrastructure',
      'बिजली गुल', 'बिजली की तार', 'पानी की पाइप', 'पानी का रिसाव', 'सिग्नल बंद',
      'ਬਿਜਲੀ ਬੰਦ', 'ਬਿਜਲੀ ਦੀ ਤਾਰ', 'ਪਾਣੀ ਦੀ ਪਾਈਪ', 'ਪਾਣੀ ਦਾ ਰਿਸਾਅ', 'ਸਿਗਨਲ ਬੰਦ',
      'bijli band', 'paani leak', 'signal band',
    ],
  },
]

const criticalTerms = [
  'not breathing', 'unconscious', 'severe bleeding', 'trapped', 'building collapse', 'explosion',
  'सांस नहीं', 'साँस नहीं', 'बेहोश', 'बहुत खून', 'फंसे', 'इमारत गिर',
  'ਸਾਹ ਨਹੀਂ', 'ਬੇਹੋਸ਼', 'ਬਹੁਤ ਖੂਨ', 'ਫਸੇ', 'ਇਮਾਰਤ ਡਿੱਗ',
  'saans nahi', 'behosh', 'bahut khoon',
]
const highTerms = [
  'fire', 'smoke', 'collision', 'crash', 'injured', 'bleeding', 'flood', 'downed wire',
  'आग', 'धुआँ', 'दुर्घटना', 'घायल', 'खून', 'बाढ़',
  'ਅੱਗ', 'ਧੂੰਆਂ', 'ਹਾਦਸਾ', 'ਜ਼ਖ਼ਮੀ', 'ਖੂਨ', 'ਹੜ੍ਹ',
]
const stopWords = new Set([
  'about', 'after', 'again', 'along', 'also', 'and', 'are', 'around', 'because', 'been', 'before', 'being',
  'between', 'from', 'have', 'here', 'into', 'near', 'over', 'that', 'the', 'there', 'they', 'this', 'under',
  'was', 'were', 'with', 'within', 'would', 'your', 'reported', 'report', 'incident',
])

export const intelligenceLanguages = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'हिन्दी' },
  { value: 'pa', label: 'ਪੰਜਾਬੀ' },
]

export function detectIncidentCategory(description) {
  const text = String(description || '').toLocaleLowerCase()
  let best = { category: 'Other', matches: [] }

  for (const rule of categoryRules) {
    const matches = rule.terms.filter((term) => text.includes(term.toLocaleLowerCase()))
    if (matches.length > best.matches.length) best = { category: rule.category, matches }
  }

  return best
}

function estimateSeverity(description, category, language) {
  const text = String(description || '').toLocaleLowerCase()
  const criticalMatch = criticalTerms.find((term) => text.includes(term.toLocaleLowerCase()))
  if (criticalMatch) {
    return {
      severity: 'Critical',
      reason: language === 'hi'
        ? 'विवरण में ऐसा संकेत है जो तत्काल खतरे का हो सकता है। मानव ऑपरेटर को इसकी पुष्टि करनी चाहिए।'
        : language === 'pa'
          ? 'ਵੇਰਵੇ ਵਿੱਚ ਤੁਰੰਤ ਖ਼ਤਰੇ ਦਾ ਸੰਕੇਤ ਹੋ ਸਕਦਾ ਹੈ। ਮਨੁੱਖੀ ਓਪਰੇਟਰ ਨੂੰ ਇਸਦੀ ਪੁਸ਼ਟੀ ਕਰਨੀ ਚਾਹੀਦੀ ਹੈ।'
          : `The description includes “${criticalMatch}”, a signal that may indicate immediate danger. A human must verify this.`,
    }
  }

  const highMatch = highTerms.find((term) => text.includes(term.toLocaleLowerCase()))
  if (highMatch || category === 'Fire') {
    return {
      severity: 'High',
      reason: language === 'hi'
        ? 'विवरण में संभावित जोखिम का संकेत है। रिपोर्ट सत्यापित नहीं है और मानव समीक्षा आवश्यक है।'
        : language === 'pa'
          ? 'ਵੇਰਵੇ ਵਿੱਚ ਸੰਭਾਵੀ ਜੋਖਮ ਦਾ ਸੰਕੇਤ ਹੈ। ਰਿਪੋਰਟ ਦੀ ਪੁਸ਼ਟੀ ਨਹੀਂ ਹੋਈ ਅਤੇ ਮਨੁੱਖੀ ਸਮੀਖਿਆ ਲੋੜੀਂਦੀ ਹੈ।'
          : highMatch
            ? `The description mentions “${highMatch}”. This can require prompt human review; the report is unverified.`
            : 'A fire-related report can involve immediate risk. The description is unverified and needs human review.',
    }
  }

  if (category === 'Other') {
    return {
      severity: 'Moderate',
      reason: language === 'hi'
        ? 'विवरण से जोखिम स्पष्ट नहीं है; मानव समीक्षा आवश्यक है।'
        : language === 'pa'
          ? 'ਵੇਰਵੇ ਤੋਂ ਜੋਖਮ ਸਪਸ਼ਟ ਨਹੀਂ; ਮਨੁੱਖੀ ਸਮੀਖਿਆ ਲੋੜੀਂਦੀ ਹੈ।'
          : 'The description does not establish a clear risk level; human review is needed.',
    }
  }

  return {
    severity: 'Moderate',
    reason: language === 'hi'
      ? 'विवरण में तत्काल खतरे का स्पष्ट संकेत नहीं मिला। यह केवल पाठ पर आधारित अनुमान है, सत्यापित आकलन नहीं।'
      : language === 'pa'
        ? 'ਵੇਰਵੇ ਵਿੱਚ ਤੁਰੰਤ ਖ਼ਤਰੇ ਦਾ ਸਪਸ਼ਟ ਸੰਕੇਤ ਨਹੀਂ ਮਿਲਿਆ। ਇਹ ਸਿਰਫ਼ ਲਿਖਤ-ਆਧਾਰਿਤ ਅਨੁਮਾਨ ਹੈ, ਪੁਸ਼ਟੀਸ਼ੁਦਾ ਮੁਲਾਂਕਣ ਨਹੀਂ।'
        : 'No explicit immediate-danger signal was found. This is a text-only estimate, not a verified assessment.',
  }
}

function summarize(description) {
  const sentences = String(description || '').trim().split(/(?<=[.!?।])\s+/u)
  const first = sentences.find((sentence) => sentence.trim()) || ''
  return first.length > 180 ? `${first.slice(0, 177).trimEnd()}…` : first
}

function tokenize(value) {
  return new Set(
    String(value || '')
      .normalize('NFKC')
      .toLocaleLowerCase()
      .match(/[\p{L}\p{N}]{2,}/gu)
      ?.filter((word) => !stopWords.has(word)) || [],
  )
}

function locationMatches(first, second) {
  const firstLocation = tokenize(first.location)
  const secondLocation = tokenize(second.location)
  const sharedWords = [...firstLocation].filter((word) => secondLocation.has(word)).length
  if (sharedWords > 0 && sharedWords / Math.max(firstLocation.size, secondLocation.size, 1) >= 0.5) return true

  if (!Array.isArray(first.coordinates) || !Array.isArray(second.coordinates)) return false
  const [lat1, lon1] = first.coordinates.map(Number)
  const [lat2, lon2] = second.coordinates.map(Number)
  if (![lat1, lon1, lat2, lon2].every(Number.isFinite)) return false

  const radians = (degrees) => degrees * Math.PI / 180
  const latitudeDelta = radians(lat2 - lat1)
  const longitudeDelta = radians(lon2 - lon1)
  const distance = 6371000 * 2 * Math.atan2(
    Math.sqrt(
      Math.sin(latitudeDelta / 2) ** 2
      + Math.cos(radians(lat1)) * Math.cos(radians(lat2)) * Math.sin(longitudeDelta / 2) ** 2,
    ),
    Math.sqrt(1 - (
      Math.sin(latitudeDelta / 2) ** 2
      + Math.cos(radians(lat1)) * Math.cos(radians(lat2)) * Math.sin(longitudeDelta / 2) ** 2
    )),
  )
  return distance <= 300
}

export function findPotentialDuplicates(incident, incidents = []) {
  const tokens = tokenize(incident.summary)
  if (tokens.size === 0) return []

  return incidents
    .filter((candidate) => candidate.id !== incident.id)
    .map((candidate) => {
      const candidateTokens = tokenize(candidate.summary)
      const intersection = [...tokens].filter((token) => candidateTokens.has(token)).length
      const union = new Set([...tokens, ...candidateTokens]).size
      const textSimilarity = union ? intersection / union : 0
      const sameCategory = candidate.category === incident.category
      const sameLocation = locationMatches(incident, candidate)
      const score = textSimilarity * 0.5 + Number(sameCategory) * 0.25 + Number(sameLocation) * 0.25
      return { id: candidate.id, title: candidate.title, location: candidate.location, score, sameCategory, sameLocation }
    })
    .filter((candidate) => candidate.score >= 0.35 && (candidate.sameLocation || candidate.score >= 0.55))
    .sort((first, second) => second.score - first.score)
    .slice(0, 3)
}

export function analyzeIncident(incident, incidents = [], language = 'en') {
  const description = incident.summary || incident.description || ''
  const classification = detectIncidentCategory(description)
  const severity = estimateSeverity(description, classification.category, language)
  const categoryLabel = classification.category === 'Other' ? incident.category || 'Other' : classification.category
  const summary = summarize(description) || 'No incident details were provided.'
  const nextSteps = getResponseRecommendations(categoryLabel, severity.severity, language)

  return {
    category: categoryLabel,
    suggestedCategory: classification.category,
    severity: severity.severity,
    severityReason: severity.reason,
    summary,
    nextSteps,
    duplicates: findPotentialDuplicates(incident, incidents),
    language,
    provider: 'demo',
    analyzedAt: Date.now(),
    advisory: true,
  }
}

export function getResponseRecommendations(category, severity, language = 'en') {
  const guidance = {
    en: [
      'A human operator should verify the description and location before taking action.',
      category === 'Other'
        ? 'Ask for clarifying details through an approved channel; do not infer missing facts.'
        : `Review the ${category.toLowerCase()} report for immediate hazards and safe access.`,
      severity === 'Critical' || severity === 'High'
        ? 'If someone may be in immediate danger in India, call 112 directly; RESQ does not dispatch.'
        : 'Keep the report in the review queue and update its status only after human confirmation.',
    ],
    hi: [
      'कार्रवाई से पहले मानव ऑपरेटर विवरण और स्थान की पुष्टि करें।',
      'सुरक्षित तरीके से स्वीकृत माध्यम से अतिरिक्त जानकारी लें; तथ्य न गढ़ें।',
      'भारत में तत्काल खतरा हो तो 112 पर सीधे कॉल करें; RESQ सहायता नहीं भेजता।',
    ],
    pa: [
      'ਕਾਰਵਾਈ ਤੋਂ ਪਹਿਲਾਂ ਮਨੁੱਖੀ ਓਪਰੇਟਰ ਵੇਰਵੇ ਅਤੇ ਥਾਂ ਦੀ ਪੁਸ਼ਟੀ ਕਰੇ।',
      'ਮਨਜ਼ੂਰਸ਼ੁਦਾ ਸੁਰੱਖਿਅਤ ਢੰਗ ਨਾਲ ਹੋਰ ਜਾਣਕਾਰੀ ਲਵੋ; ਅਣਜਾਣ ਗੱਲਾਂ ਨਾ ਘੜੋ।',
      'ਭਾਰਤ ਵਿੱਚ ਤੁਰੰਤ ਖ਼ਤਰਾ ਹੋਵੇ ਤਾਂ 112 ਤੇ ਸਿੱਧਾ ਸੰਪਰਕ ਕਰੋ; RESQ ਮਦਦ ਨਹੀਂ ਭੇਜਦਾ।',
    ],
  }

  return guidance[language] || guidance.en
}

export function getDemoAssistantReply(message, language = 'en') {
  const text = String(message || '').toLocaleLowerCase()
  const category = detectIncidentCategory(text).category
  const urgent = criticalTerms.some((term) => text.includes(term.toLocaleLowerCase()))

  if (language === 'hi') {
    return urgent
      ? 'यदि कोई तत्काल खतरे में है, सुरक्षित स्थान पर जाएँ और भारत में 112 पर सीधे कॉल करें। RESQ इस डेमो में संदेश नहीं देखता और सहायता नहीं भेज सकता।'
      : 'पहले अपनी सुरक्षा देखें और खतरे से दूरी बनाएँ। भारत में तत्काल खतरा हो तो 112 पर सीधे संपर्क करें। RESQ डेमो निगरानी या सहायता नहीं देता।'
  }
  if (language === 'pa') {
    return urgent
      ? 'ਜੇ ਕੋਈ ਤੁਰੰਤ ਖ਼ਤਰੇ ਵਿੱਚ ਹੈ, ਸੁਰੱਖਿਅਤ ਥਾਂ ਤੇ ਜਾਓ ਅਤੇ ਭਾਰਤ ਵਿੱਚ 112 ਤੇ ਸਿੱਧਾ ਕਾਲ ਕਰੋ। RESQ ਇਸ ਡੈਮੋ ਵਿੱਚ ਸੁਨੇਹੇ ਨਹੀਂ ਵੇਖਦਾ ਅਤੇ ਮਦਦ ਨਹੀਂ ਭੇਜ ਸਕਦਾ।'
      : 'ਪਹਿਲਾਂ ਆਪਣੀ ਸੁਰੱਖਿਆ ਯਕੀਨੀ ਬਣਾਓ ਅਤੇ ਖ਼ਤਰੇ ਤੋਂ ਦੂਰ ਰਹੋ। ਭਾਰਤ ਵਿੱਚ ਤੁਰੰਤ ਖ਼ਤਰਾ ਹੋਵੇ ਤਾਂ 112 ਤੇ ਸਿੱਧਾ ਸੰਪਰਕ ਕਰੋ। RESQ ਡੈਮੋ ਦੀ ਨਿਗਰਾਨੀ ਨਹੀਂ ਹੁੰਦੀ।'
  }
  if (urgent) {
    return 'If anyone may be in immediate danger, move to a safer place if you can and call India’s emergency number 112 directly. RESQ does not monitor this demo or send help.'
  }

  const topic = category === 'Other' ? 'the situation' : `the reported ${category.toLowerCase()} concern`
  return `Prioritize your own safety and keep a safe distance from ${topic}. Follow instructions from local authorities. If the situation becomes urgent in India, call 112 directly; RESQ does not monitor this demo or send help.`
}
