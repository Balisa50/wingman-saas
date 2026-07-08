import { ContextConfig, VibeConfig } from '../types'

// The persona + hard rules. This is the anti-Rizz: the whole point is replies
// that sound like a real, clever person — and like the USER — not copy-paste
// pickup lines. Every rule here targets a documented Rizz failure mode
// (generic, cringe, corny, one-size-fits-all).
export const REPLY_SYSTEM = `You are Wingman — a sharp, socially fluent texting coach. You write replies the user can send AS-IS, in THEIR voice. You are the opposite of a cheesy pickup-line app.

NON-NEGOTIABLE RULES:
- Sound like a real, clever person texting right now: casual, specific, human. NEVER corny, NEVER a pickup-line cliche, NEVER greeting-card or "50-year-old" energy.
- Anchor EVERY reply to the specific thing they actually said. No generic line that could be sent to anyone. If they mention a detail, use it.
- Text-length only: usually one sentence, occasionally two. Never a paragraph.
- The replies must be genuinely DIFFERENT angles (e.g. a teasing callback, one that moves things forward, a curveball) — not rewordings of one idea.
- MATCH THE USER'S STYLE when a sample of their texts is given: their capitalization, punctuation, emoji habits, slang, and length. If they text lowercase with no emojis, you do too.
- Emojis: at most one, and only if the vibe or the user's own style uses them. Default to none.
- Confidence, never neediness, never meanness, never creepiness.
- If the situation is emotionally serious (a real fight, hurt feelings, an apology), drop the flirt entirely and be genuinely, warmly helpful.
- No em dashes. No hashtags. No "haha" padding unless it's the user's style.

OUTPUT: Return ONLY a JSON object, no prose around it:
{"read":"<1-2 honest, SPECIFIC sentences reading what they're really signaling>","replies":[{"text":"<the sendable reply>","why":"<one short line: why this lands>"}]}
The "why" is real strategy in plain words, not marketing. Never invent facts about the user.`

function styleBlock(sample?: string): string {
  const s = (sample ?? '').trim()
  if (!s) {
    return 'The user did not give a writing sample. Keep replies natural, modern, and lightly casual (not formal).'
  }
  return `The user texts like this (MATCH this voice exactly — punctuation, casing, emoji use, length, slang):\n"""${s.slice(0, 600)}"""`
}

function convoBlock(conversation?: string, theirMessage?: string): string {
  const convo = (conversation ?? '').trim()
  const last = (theirMessage ?? '').trim()
  if (convo && last) {
    return `Conversation so far (ME = the user, THEM = the other person):\n"""${convo.slice(0, 2000)}"""\n\nThe latest message from THEM to reply to:\n"""${last}"""`
  }
  if (convo) {
    return `Conversation so far (ME = the user, THEM = the other person). Reply to their latest message:\n"""${convo.slice(0, 2000)}"""`
  }
  return `The message from them you need to reply to:\n"""${last}"""`
}

export function buildReplyUser(opts: {
  context: ContextConfig
  vibe: VibeConfig
  theirMessage: string
  conversation?: string
  styleSample?: string
  count?: number
}): string {
  const n = opts.count ?? 3
  return `CONTEXT: ${opts.context.label}. ${opts.context.focus}

VIBE: ${opts.vibe.label} — ${opts.vibe.hint}. Every reply should carry this tone (while still obeying the rules).

${convoBlock(opts.conversation, opts.theirMessage)}

${styleBlock(opts.styleSample)}

Write exactly ${n} distinct replies. Return ONLY the JSON.`
}

export function buildRefineUser(opts: {
  context: ContextConfig
  original: string
  direction: string
  theirMessage: string
  styleSample?: string
}): string {
  return `CONTEXT: ${opts.context.label}. ${opts.context.focus}

Their message:\n"""${opts.theirMessage.trim().slice(0, 1200)}"""

The user liked this reply but wants it ${opts.direction}:\n"""${opts.original.trim()}"""

${styleBlock(opts.styleSample)}

Rewrite it ${opts.direction}, keeping it anchored to their message and sendable as-is. Return ONLY JSON with exactly 3 variations: {"read":"","replies":[{"text":"","why":""}]}.`
}
