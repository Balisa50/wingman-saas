export class DeepgramStream {
  private ws: WebSocket | null = null
  private onTranscript: (text: string, isFinal: boolean) => void
  private onError: (error: string) => void

  constructor(
    onTranscript: (text: string, isFinal: boolean) => void,
    onError: (error: string) => void
  ) {
    this.onTranscript = onTranscript
    this.onError = onError
  }

  connect() {
    const url =
      `wss://api.deepgram.com/v1/listen?` +
      `language=en-US&` +
      `model=nova-2&` +
      `smart_format=true&` +
      `interim_results=true&` +
      `endpointing=300&` +
      `utterance_end_ms=1000&` +
      `diarize=true&` +
      `punctuate=true`

    this.ws = new WebSocket(url, [
      'token',
      process.env.EXPO_PUBLIC_DEEPGRAM_API_KEY!,
    ])

    this.ws.onopen = () => console.log('Deepgram connected')

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data as string)
        if (data.type === 'Results') {
          const transcript = data.channel?.alternatives?.[0]?.transcript
          const isFinal = data.is_final
          if (transcript && transcript.trim()) {
            this.onTranscript(transcript, isFinal)
          }
        }
      } catch (err) {
        console.error('Deepgram parse error:', err)
      }
    }

    this.ws.onerror = () => this.onError('Transcription connection failed')
    this.ws.onclose = () => console.log('Deepgram disconnected')
  }

  sendAudio(audioData: ArrayBuffer) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(audioData)
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }
}
