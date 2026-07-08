import { useCallback, useRef } from 'react'
import { getCoachingTip } from '../lib/claude'
import { useSessionStore } from '../stores/sessionStore'
import { SessionMode, TranscriptSegment } from '../types'

export function useCoaching() {
  const store = useSessionStore()
  const isProcessing = useRef(false)
  const tipHistory = useRef<string[]>([])

  const processTranscript = useCallback(
    async (
      mode: SessionMode,
      transcript: TranscriptSegment[],
      lastSentence: string
    ) => {
      if (isProcessing.current) return null

      isProcessing.current = true
      try {
        const tip = await getCoachingTip(mode, transcript, lastSentence)

        if (tip) {
          tipHistory.current.push(tip)
          store.showTip(tip)

          // Auto-hide after 4 seconds
          setTimeout(() => store.hideTip(), 4000)
        }

        return tip
      } finally {
        isProcessing.current = false
      }
    },
    []
  )

  const getTipHistory = useCallback(() => tipHistory.current, [])

  return { processTranscript, getTipHistory }
}
