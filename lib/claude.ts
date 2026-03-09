import { SYSTEM_PROMPTS } from '../constants/prompts'
import { SessionMode, TranscriptSegment } from '../types'

export async function getCoachingTip(
  mode: SessionMode,
  transcript: TranscriptSegment[],
  lastSentence: string
): Promise<string | null> {
  const transcriptText = transcript
    .map((s) => `${s.speaker === 'user' ? 'ME' : 'THEM'}: ${s.text}`)
    .join('\n')

  const prompt = SYSTEM_PROMPTS[mode]
    .replace('{transcript}', transcriptText)
    .replace('{lastSentence}', lastSentence)

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 60,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const data = await response.json()
    const tip = data.content?.[0]?.text?.trim()

    if (!tip || tip === 'SKIP') return null
    return tip
  } catch {
    return null
  }
}

export async function generateDebrief(
  mode: SessionMode,
  transcript: TranscriptSegment[],
  tips: string[],
  durationSeconds: number
) {
  const transcriptText = transcript
    .map((s) => `${s.speaker === 'user' ? 'ME' : 'THEM'}: ${s.text}`)
    .join('\n')

  const prompt = SYSTEM_PROMPTS.debrief
    .replace('{mode}', mode)
    .replace('{duration}', String(durationSeconds))
    .replace('{transcript}', transcriptText)
    .replace('{tips}', tips.join(', '))

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const data = await response.json()
    const text = data.content?.[0]?.text?.trim()
    return JSON.parse(text)
  } catch {
    return null
  }
}
