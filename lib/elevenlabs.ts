// Newer expo-file-system moved the string/cache API to the /legacy submodule;
// cacheDirectory + writeAsStringAsync + EncodingType live there. Without this the
// spoken-tip playback throws at runtime (undefined cacheDirectory).
import * as FileSystem from 'expo-file-system/legacy'
import { Audio } from 'expo-av'

export async function speakTip(text: string): Promise<void> {
  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${process.env.EXPO_PUBLIC_ELEVENLABS_VOICE_ID}/stream`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY!,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_turbo_v2',
          voice_settings: {
            stability: 0.4,
            similarity_boost: 0.8,
            speed: 1.2,
          },
        }),
      }
    )

    const audioBlob = await response.blob()
    const reader = new FileReader()

    return new Promise((resolve) => {
      reader.onloadend = async () => {
        const base64 = (reader.result as string).split(',')[1]
        const fileUri = FileSystem.cacheDirectory + 'tip_audio.mp3'

        await FileSystem.writeAsStringAsync(fileUri, base64, {
          encoding: FileSystem.EncodingType.Base64,
        })

        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
        })

        const { sound } = await Audio.Sound.createAsync({ uri: fileUri })
        await sound.playAsync()

        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            sound.unloadAsync()
            resolve()
          }
        })
      }
      reader.readAsDataURL(audioBlob)
    })
  } catch (err) {
    console.error('TTS error:', err)
  }
}
