export async function requestIntelligence(action, input, fallbackResult) {
  try {
    const response = await fetch('/api/intelligence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, input }),
    })
    const payload = await response.json()

    if (!response.ok || !payload.configured || payload.provider !== 'gemini') {
      return {
        result: fallbackResult,
        provider: 'demo',
        fallbackReason: payload.error || 'Gemini is not configured; local demo guidance is being shown.',
      }
    }

    return { result: payload.result, provider: 'gemini', fallbackReason: '' }
  } catch {
    return {
      result: fallbackResult,
      provider: 'demo',
      fallbackReason: 'Gemini could not be reached; local demo guidance is being shown.',
    }
  }
}
