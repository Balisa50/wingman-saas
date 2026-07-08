// The reply engine. Turns "here's what they said" + context + vibe into
// sendable, style-matched replies with a one-line "why". Runs on the free
// NVIDIA endpoint (lib/nvidia.ts) — resilient timeout + model fallback.
import { nvidiaChat, extractJsonObject } from './nvidia'
import { REPLY_SYSTEM, buildReplyUser, buildRefineUser } from '../constants/prompts'
import { ContextConfig, VibeConfig, ReplyResult, ReplySuggestion } from '../types'

function coerce(raw: string): ReplyResult {
  const obj = JSON.parse(extractJsonObject(raw)) as {
    read?: unknown
    replies?: unknown
  }
  const read = typeof obj.read === 'string' ? obj.read.trim() : ''
  const replies: ReplySuggestion[] = Array.isArray(obj.replies)
    ? (obj.replies as unknown[])
        .filter(
          (r): r is { text: string; why?: unknown } =>
            !!r &&
            typeof r === 'object' &&
            typeof (r as { text?: unknown }).text === 'string' &&
            (r as { text: string }).text.trim().length > 0
        )
        .map((r) => ({
          text: r.text.trim(),
          why: typeof r.why === 'string' ? r.why.trim() : '',
        }))
        .slice(0, 5)
    : []
  return { read, replies }
}

export async function generateReplies(opts: {
  context: ContextConfig
  vibe: VibeConfig
  theirMessage: string
  conversation?: string
  styleSample?: string
  count?: number
}): Promise<ReplyResult> {
  const text = await nvidiaChat({
    messages: [
      { role: 'system', content: REPLY_SYSTEM },
      { role: 'user', content: buildReplyUser(opts) },
    ],
    maxTokens: 700,
    temperature: 0.85, // creative variety, distinct angles
    timeoutMs: 25000,
  })
  const result = coerce(text)
  if (result.replies.length === 0) throw new Error('No replies generated')
  return result
}

export async function refineReply(opts: {
  context: ContextConfig
  original: string
  direction: string
  theirMessage: string
  styleSample?: string
}): Promise<ReplyResult> {
  const text = await nvidiaChat({
    messages: [
      { role: 'system', content: REPLY_SYSTEM },
      { role: 'user', content: buildRefineUser(opts) },
    ],
    maxTokens: 600,
    temperature: 0.9,
    timeoutMs: 25000,
  })
  const result = coerce(text)
  if (result.replies.length === 0) throw new Error('No replies generated')
  return result
}
