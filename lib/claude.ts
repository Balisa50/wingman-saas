// Wingman's coaching brain. Named for its original Claude implementation; now
// runs on NVIDIA's free endpoint (see lib/nvidia.ts). Public API is unchanged
// so useCoaching / the debrief screen keep working as-is.
import { SYSTEM_PROMPTS } from '../constants/prompts'
import { SessionMode, TranscriptSegment } from '../types'
import { nvidiaChat, extractJsonObject } from './nvidia'

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
    // Real-time: short timeout so a slow model never holds up the next tip.
    const text = await nvidiaChat({
      messages: [{ role: 'user', content: prompt }],
      maxTokens: 60,
      temperature: 0.5,
      timeoutMs: 8000,
    })
    const tip = text.trim()
    if (!tip || tip.toUpperCase() === 'SKIP') return null
    return tip
  } catch {
    // A missed tip is fine - the conversation keeps moving. Never surface an error.
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
    const text = await nvidiaChat({
      messages: [{ role: 'user', content: prompt }],
      maxTokens: 1000,
      temperature: 0.4,
      timeoutMs: 30000,
    })
    // Robust parse: models often wrap JSON in prose or ```json fences. A raw
    // JSON.parse threw and killed the whole debrief; extract the object first.
    return JSON.parse(extractJsonObject(text))
  } catch {
    return null
  }
}
