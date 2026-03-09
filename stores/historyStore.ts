import { create } from 'zustand'
import { Session } from '../types'
import { supabase } from '../lib/supabase'

interface HistoryStore {
  sessions: Session[]
  isLoading: boolean
  fetchSessions: () => Promise<void>
  addSession: (session: Session) => void
}

export const useHistoryStore = create<HistoryStore>((set) => ({
  sessions: [],
  isLoading: false,

  fetchSessions: async () => {
    set({ isLoading: true })
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('*, coaching_tips(*)')
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error

      const sessions: Session[] = (data || []).map((s: any) => ({
        id: s.id,
        userId: s.user_id,
        mode: s.mode,
        startedAt: s.started_at,
        endedAt: s.ended_at,
        durationSeconds: s.duration_seconds,
        score: s.score,
        transcript: s.transcript,
        coachingTips: (s.coaching_tips || []).map((t: any) => ({
          id: t.id,
          sessionId: t.session_id,
          timestampSeconds: t.timestamp_seconds,
          tipText: t.tip_text,
          triggerText: t.trigger_text,
        })),
        debrief: s.debrief,
      }))

      set({ sessions, isLoading: false })
    } catch (err) {
      console.error('Failed to fetch sessions:', err)
      set({ isLoading: false })
    }
  },

  addSession: (session) =>
    set((state) => ({ sessions: [session, ...state.sessions] })),
}))
