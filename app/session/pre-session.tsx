import { useState } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import ModeSelector from '../../components/session/ModeSelector'
import Button from '../../components/ui/Button'
import { SessionMode } from '../../types'
import { SESSION_MODES } from '../../constants/modes'
import { COLORS } from '../../constants/theme'

export default function PreSessionScreen() {
  const params = useLocalSearchParams<{ mode?: SessionMode }>()
  const [selectedMode, setSelectedMode] = useState<SessionMode | null>(
    params.mode || null
  )

  const modeConfig = SESSION_MODES.find((m) => m.id === selectedMode)

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Prepare your session</Text>
        <Text style={styles.subtitle}>
          Choose a mode and get ready. Wingman will listen through your earbud.
        </Text>
      </View>

      <ModeSelector selectedMode={selectedMode} onSelect={setSelectedMode} />

      {modeConfig && (
        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>Quick tips for {modeConfig.label}</Text>
          {modeConfig.tips.map((tip, i) => (
            <View key={i} style={styles.tipRow}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.checklist}>
        <Text style={styles.checklistTitle}>Before you start</Text>
        <View style={styles.checkItem}>
          <Text style={styles.checkEmoji}>🎧</Text>
          <Text style={styles.checkText}>Put in your earbud</Text>
        </View>
        <View style={styles.checkItem}>
          <Text style={styles.checkEmoji}>🎙️</Text>
          <Text style={styles.checkText}>Make sure your mic is working</Text>
        </View>
        <View style={styles.checkItem}>
          <Text style={styles.checkEmoji}>🔇</Text>
          <Text style={styles.checkText}>Set volume to low whisper level</Text>
        </View>
      </View>

      <Button
        title="Start Session"
        onPress={() =>
          router.push({
            pathname: '/session/live',
            params: { mode: selectedMode },
          })
        }
        size="lg"
        disabled={!selectedMode}
        style={{ width: '100%' }}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 48,
    gap: 24,
  },
  header: {
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  tipsSection: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tipsTitle: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  tipRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  tipBullet: {
    color: COLORS.primary,
    fontSize: 14,
    lineHeight: 20,
  },
  tipText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  checklist: {
    gap: 12,
  },
  checklistTitle: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  checkEmoji: { fontSize: 20 },
  checkText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
})
