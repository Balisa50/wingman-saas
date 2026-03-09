import { useCallback, useRef } from 'react'
import { Audio } from 'expo-av'

export function useAudioPlayback() {
  const soundRef = useRef<Audio.Sound | null>(null)

  const playAudio = useCallback(async (uri: string) => {
    try {
      // Unload previous sound if any
      if (soundRef.current) {
        await soundRef.current.unloadAsync()
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
      })

      const { sound } = await Audio.Sound.createAsync({ uri })
      soundRef.current = sound

      await sound.playAsync()

      return new Promise<void>((resolve) => {
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            sound.unloadAsync()
            soundRef.current = null
            resolve()
          }
        })
      })
    } catch (err) {
      console.error('Audio playback error:', err)
    }
  }, [])

  const stopAudio = useCallback(async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync()
      await soundRef.current.unloadAsync()
      soundRef.current = null
    }
  }, [])

  return { playAudio, stopAudio }
}
