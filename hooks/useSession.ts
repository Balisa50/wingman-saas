import { useRef, useCallback } from 'react'
import { useSessionStore } from '../stores/sessionStore'
import { AudioRecorder } from '../lib/audio'
import { DeepgramStream } from '../lib/deepgram'
import { getCoachingTip } from '../lib/claude'
import { supabase } from '../lib/supabase'
import { generateDebrief } from '../lib/claude'
import { SessionMode } from '../types'

export function useSession() {
  const recorderRef = useRef(new AudioRecorder())
  const deepgramRef = useRef<DeepgramStream | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const coachingBuffer = useRef<string[]>([])

  const store = useSessionStore()

  const startSession = useCallback(async (mode: SessionMode) => {
    const hasPermission = await recorderRef.current.requestPermissions()
    if (!hasPermission) throw new Error('Microphone permission denied')

    const { data: sessionData } = await supabase
      .from('sessions')
      .insert({ mode, user_id: (await supabase.auth.getUser()).data.user?.id })
      .select()
      .single()

    if (!sessionData) throw new Error('Failed to create session')

    store.setSessionId(sessionData.id)
    store.setMode(mode)
    store.setRecording(true)

    deepgramRef.current = new DeepgramStream(
      async (text, isFinal) => {
        if (!isFinal) return

        const currentState = useSessionStore.getState()
        store.addTranscriptSegment({
          text,
          speaker: 'user',
          timestampSeconds: currentState.durationSeconds,
        })

        const transcript = useSessionStore.getState().transcript
        const tip = await getCoachingTip(mode, transcript, text)

        if (tip) {
          coachingBuffer.current.push(tip)
          store.showTip(tip)
          setTimeout(() => store.hideTip(), 4000)

          await supabase.from('coaching_tips').insert({
            session_id: sessionData.id,
            timestamp_seconds: currentState.durationSeconds,
            tip_text: tip,
            trigger_text: text,
          })
        }
      },
      (error) => console.error('Deepgram error:', error)
    )

    await recorderRef.current.start(deepgramRef.current)

    timerRef.current = setInterval(() => {
      store.incrementDuration()
    }, 1000)
  }, [])

  const stopSession = useCallback(async () => {
    if (timerRef.current) clearInterval(timerRef.current)
    await recorderRef.current.stop()
    store.setRecording(false)

    const finalState = useSessionStore.getState()

    const debrief = await generateDebrief(
      finalState.mode,
      finalState.transcript,
      coachingBuffer.current,
      finalState.durationSeconds
    )

    await supabase
      .from('sessions')
      .update({
        ended_at: new Date().toISOString(),
        duration_seconds: finalState.durationSeconds,
        score: debrief?.score,
        transcript: finalState.transcript
          .map((s) => `${s.speaker}: ${s.text}`)
          .join('\n'),
        debrief,
      })
      .eq('id', finalState.sessionId)

    return { debrief, sessionId: finalState.sessionId }
  }, [])

  return { startSession, stopSession }
}
