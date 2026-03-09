import { Audio } from 'expo-av'
import { DeepgramStream } from './deepgram'

export class AudioRecorder {
  private recording: Audio.Recording | null = null
  private deepgramStream: DeepgramStream | null = null
  private intervalId: ReturnType<typeof setInterval> | null = null

  async requestPermissions(): Promise<boolean> {
    const { status } = await Audio.requestPermissionsAsync()
    return status === 'granted'
  }

  async start(deepgramStream: DeepgramStream): Promise<void> {
    this.deepgramStream = deepgramStream

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      interruptionModeIOS: 1 as any,
    })

    this.recording = new Audio.Recording()
    await this.recording.prepareToRecordAsync({
      android: {
        extension: '.webm',
        outputFormat: 2,
        audioEncoder: 3,
        sampleRate: 16000,
        numberOfChannels: 1,
        bitRate: 128000,
      },
      ios: {
        extension: '.wav',
        outputFormat: 1936684398,
        audioQuality: 127,
        sampleRate: 16000,
        numberOfChannels: 1,
        bitRate: 128000,
        linearPCMBitDepth: 16,
        linearPCMIsBigEndian: false,
        linearPCMIsFloat: false,
      },
      web: {},
      keepAudioActiveHint: true,
    })

    await this.recording.startAsync()
    deepgramStream.connect()
  }

  async stop(): Promise<string | null> {
    if (this.intervalId) clearInterval(this.intervalId)
    this.deepgramStream?.disconnect()

    if (!this.recording) return null

    await this.recording.stopAndUnloadAsync()
    const uri = this.recording.getURI()
    this.recording = null
    return uri
  }
}
