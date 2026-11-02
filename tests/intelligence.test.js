import assert from 'node:assert/strict'
import { Readable } from 'node:stream'
import test from 'node:test'
import { analyzeIncident, detectIncidentCategory, findPotentialDuplicates, getDemoAssistantReply } from '../src/data/intelligence.js'
import { handleIntelligenceRequest } from '../server/intelligence-api.js'

function responseRecorder() {
  return {
    headers: {},
    statusCode: 200,
    setHeader(name, value) {
      this.headers[name] = value
    },
    end(value = '') {
      this.body = value
    },
  }
}

function request(method, value, headers = {}) {
  return Object.assign(Readable.from(value === undefined ? [] : [Buffer.from(JSON.stringify(value))]), {
    method,
    headers: { 'content-type': 'application/json', host: 'resq.test', ...headers },
    socket: { remoteAddress: '127.0.0.1' },
  })
}

test('classifies English, Hindi, and Punjabi descriptions', () => {
  assert.equal(detectIncidentCategory('Smoke coming from a building').category, 'Fire')
  assert.equal(detectIncidentCategory('एक व्यक्ति घायल है और खून बह रहा है').category, 'Medical')
  assert.equal(detectIncidentCategory('ਸੜਕ ਹਾਦਸਾ ਅਤੇ ਟੱਕਰ').category, 'Traffic')
})

test('explains high-risk signals and keeps an advisory label', () => {
  const result = analyzeIncident({
    category: 'Medical',
    summary: 'A person is unconscious and not breathing.',
    location: 'Chandigarh',
    coordinates: [30.7333, 76.7794],
  })

  assert.equal(result.severity, 'Critical')
  assert.match(result.severityReason, /human/i)
  assert.equal(result.advisory, true)
  assert.equal(result.provider, 'demo')
  assert.ok(result.nextSteps.length > 0)
})

test('local severity explanations follow the selected language', () => {
  const analysis = analyzeIncident(
    { summary: 'A fire is reported nearby.', category: 'Fire' },
    [],
    'hi',
  )

  assert.equal(analysis.severity, 'High')
  assert.match(analysis.severityReason, /मानव समीक्षा/)
})

test('detects similar reports using text, category, and nearby location', () => {
  const incident = {
    id: 'RQ-9001',
    category: 'Traffic',
    summary: 'A stalled vehicle is blocking the road near the south entrance.',
    location: 'State Street',
    coordinates: [41.880, -87.630],
  }
  const matches = findPotentialDuplicates(incident, [
    { ...incident, id: 'RQ-9002', title: 'Road blocked', summary: 'A vehicle is blocking the road by the entrance.', coordinates: [41.8801, -87.6301] },
    { ...incident, id: 'RQ-9003', category: 'Weather', summary: 'A thunderstorm is passing through the city.', coordinates: [41.8801, -87.6301] },
  ])

  assert.deepEqual(matches.map((item) => item.id), ['RQ-9002'])
  assert.ok(matches[0].score >= 0.35)
})

test('returns safety guidance in all supported assistant languages', () => {
  assert.match(getDemoAssistantReply('There may be a fire', 'en'), /112/)
  assert.match(getDemoAssistantReply('मदद चाहिए', 'hi'), /112/)
  assert.match(getDemoAssistantReply('ਮਦਦ ਚਾਹੀਦੀ ਹੈ', 'pa'), /112/)
})

test('reports Gemini status without exposing the server key', async () => {
  const previousKey = process.env.GEMINI_API_KEY
  process.env.GEMINI_API_KEY = 'test-secret-not-for-response'
  const response = responseRecorder()

  try {
    await handleIntelligenceRequest(request('GET'), response)

    assert.equal(response.statusCode, 200)
    assert.deepEqual(JSON.parse(response.body), { configured: true, provider: 'gemini' })
    assert.equal(response.body.includes('test-secret-not-for-response'), false)
  } finally {
    if (previousKey === undefined) delete process.env.GEMINI_API_KEY
    else process.env.GEMINI_API_KEY = previousKey
  }
})

test('returns an explicit demo fallback when Gemini is not configured', async () => {
  const previousKey = process.env.GEMINI_API_KEY
  delete process.env.GEMINI_API_KEY
  const response = responseRecorder()

  try {
    await handleIntelligenceRequest(request('POST', {
      action: 'analyze',
      input: { description: 'Smoke near the station', category: 'Fire', language: 'en' },
    }), response)

    assert.equal(response.statusCode, 200)
    assert.equal(JSON.parse(response.body).configured, false)
    assert.equal(JSON.parse(response.body).provider, 'demo')
    assert.match(JSON.parse(response.body).error, /local demo/i)
  } finally {
    if (previousKey === undefined) delete process.env.GEMINI_API_KEY
    else process.env.GEMINI_API_KEY = previousKey
  }
})

test('uses the server-side Gemini key and validates structured results', async () => {
  const previousKey = process.env.GEMINI_API_KEY
  const previousFetch = globalThis.fetch
  process.env.GEMINI_API_KEY = 'server-only-test-key'
  globalThis.fetch = async (url, options) => {
    assert.match(String(url), /generativelanguage\.googleapis\.com/)
    assert.equal(new URL(url).searchParams.get('key'), 'server-only-test-key')
    assert.equal(options.method, 'POST')
    return new Response(JSON.stringify({
      candidates: [{
        content: {
          parts: [{
            text: JSON.stringify({
              category: 'Fire',
              severity: 'High',
              severityReason: 'Unverified fire signal; human review required.',
              summary: 'Smoke near a building.',
              nextSteps: ['Verify the report with a human operator.'],
            }),
          }],
        },
      }],
    }), { status: 200 })
  }
  const response = responseRecorder()

  try {
    await handleIntelligenceRequest(request('POST', {
      action: 'analyze',
      input: { description: 'Smoke near the station', category: 'Fire', language: 'en' },
    }), response)

    const body = JSON.parse(response.body)
    assert.equal(response.statusCode, 200)
    assert.equal(body.provider, 'gemini')
    assert.equal(body.result.category, 'Fire')
    assert.equal(body.result.severity, 'High')
    assert.equal(response.body.includes('server-only-test-key'), false)
  } finally {
    globalThis.fetch = previousFetch
    if (previousKey === undefined) delete process.env.GEMINI_API_KEY
    else process.env.GEMINI_API_KEY = previousKey
  }
})

test('rejects unsupported API actions', async () => {
  const response = responseRecorder()

  await handleIntelligenceRequest(request('POST', { action: 'dispatch', input: {} }), response)

  assert.equal(response.statusCode, 400)
  assert.match(JSON.parse(response.body).error, /supported intelligence action/i)
})

test('rejects cross-origin calls to the Gemini proxy', async () => {
  const response = responseRecorder()

  await handleIntelligenceRequest(request('POST', { action: 'assistant', input: { messages: [{ role: 'user', text: 'Help' }] } }, {
    origin: 'https://other.example',
  }), response)

  assert.equal(response.statusCode, 403)
  assert.match(JSON.parse(response.body).error, /Cross-origin/)
})
