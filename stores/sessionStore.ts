import { create } from 'zustand'
import { LiveSessionState, SessionMode, TranscriptSegment } from '../types'

interface SessionStore extends LiveSessionState {
  setMode: (mode: SessionMode) => void
  setSessionId: (id: string) => void
  setRecording: (isRecording: boolean) => void
  setPaused: (isPaused: boolean) => void
  addTranscriptSegment: (segment: TranscriptSegment) => void
  showTip: (tip: string) => void
  hideTip: () => void
  incrementDuration: () => void
  resetSession: () => void
}

const initialState: LiveSessionState = {
  isRecording: false,
  isPaused: false,
  durationSeconds: 0,
  transcript: [],
  currentTip: null,
  tipVisible: false,
  mode: 'dating',
  sessionId: null,
}

export const useSessionStore = create<SessionStore>((set) => ({
  ...initialState,
  setMode: (mode) => set({ mode }),
  setSessionId: (sessionId) => set({ sessionId }),
  setRecording: (isRecording) => set({ isRecording }),
  setPaused: (isPaused) => set({ isPaused }),
  addTranscriptSegment: (segment) =>
    set((state) => ({ transcript: [...state.transcript, segment] })),
  showTip: (tip) => set({ currentTip: tip, tipVisible: true }),
  hideTip: () => set({ tipVisible: false }),
  incrementDuration: () =>
    set((state) => ({ durationSeconds: state.durationSeconds + 1 })),
  resetSession: () => set(initialState),
}))
