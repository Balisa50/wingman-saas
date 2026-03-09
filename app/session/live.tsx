import { useEffect, useRef } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Vibration } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSpring,
} from 'react-native-reanimated'
import { router, useLocalSearchParams } from 'expo-router'
import { useSession } from '../../hooks/useSession'
import { useSessionStore } from '../../stores/sessionStore'
import WaveformVisualizer from '../../components/session/WaveformVisualizer'
import { COLORS } from '../../constants/theme'
import { SessionMode } from '../../types'

export default function LiveSessionScreen() {
  const { mode } = useLocalSearchParams<{ mode: SessionMode }>()
  const { startSession, stopSession } = useSession()
  const store = useSessionStore()

  const pulseScale = useSharedValue(1)
  const tipTranslateY = useSharedValue(60)
  const tipOpacity = useSharedValue(0)
  const hasStarted = useRef(false)

  useEffect(() => {
    if (!hasStarted.current) {
      hasStarted.current = true
      startSession(mode).catch(console.error)
    }

    pulseScale.value = withRepeat(
      withTiming(1.15, { duration: 1000 }),
      -1,
      true
    )
  }, [])

  useEffect(() => {
    if (store.tipVisible && store.currentTip) {
      Vibration.vibrate(50)
      tipTranslateY.value = withSpring(0, { damping: 15 })
      tipOpacity.value = withTiming(1, { duration: 300 })
    } else {
      tipTranslateY.value = withTiming(60, { duration: 300 })
      tipOpacity.value = withTiming(0, { duration: 200 })
    }
  }, [store.tipVisible, store.currentTip])

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }))

  const tipStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: tipTranslateY.value }],
    opacity: tipOpacity.value,
  }))

  const handleStop = async () => {
    const result = await stopSession()
    router.replace({
      pathname: '/session/debrief',
      params: {
        sessionId: result.sessionId,
        debrief: JSON.stringify(result.debrief),
      },
    })
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.modeLabel}>{mode?.toUpperCase()}</Text>
        <Text style={styles.timer}>{formatTime(store.durationSeconds)}</Text>
      </View>

      <View style={styles.center}>
        <Animated.View style={[styles.pulseOuter, pulseStyle]}>
          <View style={styles.pulseInner}>
            <Text style={styles.micEmoji}>🎙️</Text>
          </View>
        </Animated.View>

        <WaveformVisualizer isActive={store.isRecording} />

        <Text style={styles.listeningText}>
          {store.isRecording ? 'Listening...' : 'Starting...'}
        </Text>

        {store.transcript.length > 0 && (
          <View style={styles.lastTranscript}>
            <Text style={styles.lastTranscriptText} numberOfLines={2}>
              {store.transcript[store.transcript.length - 1]?.text}
            </Text>
          </View>
        )}
      </View>

      <Animated.View style={[styles.tipBanner, tipStyle]}>
        <Text style={styles.tipLabel}>WINGMAN</Text>
        <Text style={styles.tipText}>{store.currentTip}</Text>
      </Animated.View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.stopButton} onPress={handleStop}>
          <Text style={styles.stopText}>End Session</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modeLabel: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
  },
  timer: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  pulseOuter: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: `${COLORS.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: `${COLORS.primary}40`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micEmoji: { fontSize: 44 },
  listeningText: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  lastTranscript: {
    marginHorizontal: 40,
    padding: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 10,
  },
  lastTranscriptText: {
    color: COLORS.textMuted,
    fontSize: 13,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  tipBanner: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  tipLabel: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 6,
  },
  tipText: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 26,
  },
  footer: {
    padding: 24,
    paddingBottom: 48,
  },
  stopButton: {
    backgroundColor: COLORS.error,
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
  },
  stopText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
})
