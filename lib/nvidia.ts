// NVIDIA NIM client (OpenAI-compatible) for Wingman.
//
// Wingman's coaching brain moved off the paid Anthropic API onto NVIDIA's free
// endpoint. One key, all free models. This is a REAL-TIME app: a coaching tip
// that arrives 20s late is useless, so every call has a hard AbortController
// timeout and falls back down a model chain rather than hanging.
//
// Set EXPO_PUBLIC_NVIDIA_API_KEY (and optionally EXPO_PUBLIC_NVIDIA_MODEL).
//
// NOTE: like all EXPO_PUBLIC_* vars this key ships inside the app bundle, so it
// is visible to anyone who unpacks the build. That is acceptable ONLY because
// it is a free, rotatable NVIDIA key. Do NOT put a paid/secret key here — the
// right long-term fix is a thin serverless proxy that holds the key server-side.

const NVIDIA_BASE = 'https://integrate.api.nvidia.com/v1'

// glm-5.2 is the default: fast and a clean instruction-follower (mistral-medium
// on the free endpoint has been hanging; nemotron prepends reasoning that breaks
// strict formats). Override with EXPO_PUBLIC_NVIDIA_MODEL.
export const NVIDIA_MODEL =
  process.env.EXPO_PUBLIC_NVIDIA_MODEL || 'z-ai/glm-5.2'

const NVIDIA_MODELS: string[] = [
  NVIDIA_MODEL,
  'deepseek-ai/deepseek-v4-pro',
].filter((m, i, a) => !!m && a.indexOf(m) === i)

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface ChatOpts {
  messages: ChatMessage[]
  maxTokens?: number
  temperature?: number
  /** Hard cap per attempt. Real-time tips use a short one; debrief a longer one. */
  timeoutMs?: number
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
const isTransient = (status: number) => status === 429 || status >= 500

/**
 * Chat completion with a hard timeout, per-model retry, and model fallback.
 * Returns the assistant text, or throws only when every model is exhausted.
 * A HANGING model is aborted by the timeout and falls through to the next one,
 * so the app degrades instead of freezing.
 */
export async function nvidiaChat(opts: ChatOpts): Promise<string> {
  const key = process.env.EXPO_PUBLIC_NVIDIA_API_KEY
  if (!key) throw new Error('EXPO_PUBLIC_NVIDIA_API_KEY is not set')

  const timeoutMs = opts.timeoutMs ?? 12000
  let lastErr = ''

  for (const model of NVIDIA_MODELS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), timeoutMs)
      try {
        const res = await fetch(`${NVIDIA_BASE}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${key}`,
          },
          body: JSON.stringify({
            model,
            messages: opts.messages,
            max_tokens: opts.maxTokens ?? 512,
            temperature: opts.temperature ?? 0.7,
          }),
          signal: controller.signal,
        })
        clearTimeout(timer)

        if (res.ok) {
          const data = await res.json()
          const text: string = data?.choices?.[0]?.message?.content ?? ''
          if (text.trim()) return text
          lastErr = `empty response from ${model}`
          break // empty -> next model
        }
        lastErr = `NVIDIA ${res.status} (${model})`
        if (isTransient(res.status) && attempt === 0) {
          await sleep(400)
          continue // retry same model once
        }
        break // non-transient or retried -> next model
      } catch (e) {
        clearTimeout(timer)
        // AbortError (timeout) or network error. Retry once, else next model.
        lastErr = e instanceof Error ? `${e.name}: ${e.message}` : String(e)
        if (attempt === 0) {
          await sleep(300)
          continue
        }
        break
      }
    }
  }
  throw new Error(`NVIDIA chat failed after all models: ${lastErr}`)
}

/** Pull the first {...} JSON object out of a reply, tolerating fences/prose. */
export function extractJsonObject(text: string): string {
  const cleaned = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '')
  const start = cleaned.indexOf('{')
  const end = cleaned.lastIndexOf('}')
  if (start !== -1 && end !== -1 && end > start) return cleaned.slice(start, end + 1)
  return cleaned
}
