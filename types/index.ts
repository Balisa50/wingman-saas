// Wingman is a text-based reply coach: paste what they said, pick a context +
// vibe, get replies that sound like YOU (not generic copy-paste). No audio.

export type SubscriptionTier = 'free' | 'pro' | 'team'

export interface UserProfile {
  id: string
  email: string
  fullName: string
  avatarUrl?: string
  subscriptionStatus: SubscriptionTier
  // DB column sessions_used_this_month — reused as the monthly reply counter.
  sessionsUsedThisMonth: number
}

/** The situation you're texting in. Dating is the hero; the rest keep depth. */
export interface ContextConfig {
  id: string
  label: string
  emoji: string
  blurb: string
  color: string
  /** One-liner appended to the system prompt to steer the model per context. */
  focus: string
}

/** The tone of the replies. */
export interface VibeConfig {
  id: string
  label: string
  emoji: string
  hint: string
}

export interface ReplySuggestion {
  /** The ready-to-send message. */
  text: string
  /** One short line on why it lands — the coaching, not just the line. */
  why: string
}

export interface ReplyResult {
  /** A quick, honest read of the situation (the "sees the vibe" moment). */
  read: string
  replies: ReplySuggestion[]
}

export interface SavedReply {
  id: string
  text: string
  contextId: string
  contextLabel: string
  vibeId: string
  savedAt: string
}
