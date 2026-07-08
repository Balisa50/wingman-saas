import { ContextConfig, VibeConfig } from '../types'

// The situation you're texting in. Dating leads (that's the wedge vs Rizz),
// but Wingman keeps depth for the conversations Rizz is bad at.
export const CONTEXTS: ContextConfig[] = [
  {
    id: 'dating',
    label: 'Dating',
    emoji: '🔥',
    blurb: 'Tinder, Hinge, texts, the "wyd" at 1am',
    color: '#FF4D6D',
    focus:
      'This is a dating/flirting chat. Build attraction with wit, warmth and a little tension. Move the conversation forward — toward a real connection or a date. Never desperate, never a pickup-line cliché.',
  },
  {
    id: 'crush',
    label: 'Situationship',
    emoji: '💭',
    blurb: 'Mixed signals, dry texts, "we need to talk"',
    color: '#A855F7',
    focus:
      'This is an ambiguous romantic situation (mixed signals, someone going cold, defining-the-relationship tension). Be emotionally intelligent and self-respecting: hold your value, read the subtext, do not chase.',
  },
  {
    id: 'sales',
    label: 'Sales / Work',
    emoji: '💼',
    blurb: 'Clients, cold DMs, follow-ups, the boss',
    color: '#06D6A0',
    focus:
      'This is a professional/sales message. Be sharp, credible and human. Handle objections, create momentum, ask for the next step. No corporate filler, no groveling.',
  },
  {
    id: 'difficult',
    label: 'Hard talk',
    emoji: '🕊️',
    blurb: 'Conflict, apologies, boundaries, family',
    color: '#FFB703',
    focus:
      'This is an emotionally charged or confrontational conversation. De-escalate, validate feelings before making a point, set boundaries without aggression, own your part honestly. Calm, mature, non-defensive.',
  },
]

// The tone. This is the dial Rizz gets wrong (everything sounds the same) —
// each vibe here is genuinely distinct.
export const VIBES: VibeConfig[] = [
  { id: 'playful', label: 'Playful', emoji: '😏', hint: 'Teasing, light, fun' },
  { id: 'flirty', label: 'Flirty', emoji: '😘', hint: 'Warm, a little bold' },
  { id: 'witty', label: 'Witty', emoji: '🧠', hint: 'Clever, dry, sharp' },
  { id: 'smooth', label: 'Smooth', emoji: '🕶️', hint: 'Confident, unbothered' },
  { id: 'genuine', label: 'Genuine', emoji: '💬', hint: 'Real, sincere, direct' },
  { id: 'bold', label: 'Bold', emoji: '⚡', hint: 'Forward, high-risk' },
]

export const DEFAULT_CONTEXT = CONTEXTS[0]
export const DEFAULT_VIBE = VIBES[0]

export function contextById(id: string): ContextConfig {
  return CONTEXTS.find((c) => c.id === id) ?? DEFAULT_CONTEXT
}
export function vibeById(id: string): VibeConfig {
  return VIBES.find((v) => v.id === id) ?? DEFAULT_VIBE
}
