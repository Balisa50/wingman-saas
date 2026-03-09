import { useRef, useCallback, useState } from 'react'
import { DeepgramStream } from '../lib/deepgram'
import { useSessionStore } from '../stores/sessionStore'

export function useTranscription() {
  const deepgramRef = useRef<DeepgramStream | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const store = useSessionStore()

  const startTranscription = useCallback(
    (onFinalTranscript: (text: string) => void) => {
      deepgramRef.current = new DeepgramStream(
        (text, isFinal) => {
          if (isFinal) {
            store.addTranscriptSegment({
              text,
              speaker: 'user',
              timestampSeconds: store.durationSeconds,
            })
            onFinalTranscript(text)
          }
        },
        (error) => {
          console.error('Transcription error:', error)
          setIsConnected(false)
        }
      )

      deepgramRef.current.connect()
      setIsConnected(true)
    },
    []
  )

  const stopTranscription = useCallback(() => {
    deepgramRef.current?.disconnect()
    deepgramRef.current = null
    setIsConnected(false)
  }, [])

  const sendAudio = useCallback((audioData: ArrayBuffer) => {
    deepgramRef.current?.sendAudio(audioData)
  }, [])

  return { startTranscription, stopTranscription, sendAudio, isConnected }
}
