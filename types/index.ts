export type SessionMode = 'dating' | 'sales' | 'negotiation' | 'difficult'

export type SubscriptionTier = 'free' | 'pro' | 'team'

export interface UserProfile {
  id: string
  email: string
  fullName: string
  avatarUrl?: string
  subscriptionStatus: SubscriptionTier
  sessionsUsedThisMonth: number
}

export interface Session {
  id: string
  userId: string
  mode: SessionMode
  startedAt: string
  endedAt?: string
  durationSeconds?: number
  score?: number
  transcript?: string
  coachingTips: CoachingTip[]
  debrief?: SessionDebrief
}

export interface CoachingTip {
  id: string
  sessionId: string
  timestampSeconds: number
  tipText: string
  triggerText: string
}

export interface SessionDebrief {
  score: number
  summary: string
  strengths: string[]
  improvements: string[]
  keyMoments: KeyMoment[]
  overallAdvice: string
}

export interface KeyMoment {
  timestampSeconds: number
  what: string
  impact: 'positive' | 'negative'
  betterResponse?: string
}

export interface LiveSessionState {
  isRecording: boolean
  isPaused: boolean
  durationSeconds: number
  transcript: TranscriptSegment[]
  currentTip: string | null
  tipVisible: boolean
  mode: SessionMode
  sessionId: string | null
}

export interface TranscriptSegment {
  text: string
  speaker: 'user' | 'other'
  timestampSeconds: number
}

export interface ModeConfig {
  id: SessionMode
  label: string
  emoji: string
  description: string
  color: string
  systemPromptKey: string
  tips: string[]
}
