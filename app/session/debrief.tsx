import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { useSessionStore } from '../../stores/sessionStore'
import { SessionDebrief } from '../../types'
import ScoreCircle from '../../components/debrief/ScoreCircle'
import ImprovementCard from '../../components/debrief/ImprovementCard'
import { COLORS } from '../../constants/theme'

export default function DebriefScreen() {
  const { debrief: debriefString } = useLocalSearchParams<{ debrief: string }>()
  const store = useSessionStore()

  let debrief: SessionDebrief
  try {
    debrief = JSON.parse(debriefString || '{}')
  } catch {
    debrief = {
      score: 0,
      summary: 'Unable to generate debrief.',
      strengths: [],
      improvements: [],
      keyMoments: [],
      overallAdvice: '',
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.pageTitle}>Session Debrief</Text>

      <View style={styles.scoreSection}>
        <ScoreCircle score={debrief.score || 0} />
        <Text style={styles.summary}>{debrief.summary}</Text>
      </View>

      {debrief.strengths && debrief.strengths.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What worked</Text>
          {debrief.strengths.map((s, i) => (
            <View key={i} style={styles.item}>
              <Text style={styles.itemIcon}>✅</Text>
              <Text style={styles.itemText}>{s}</Text>
            </View>
          ))}
        </View>
      )}

      {debrief.improvements && debrief.improvements.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Improve next time</Text>
          {debrief.improvements.map((imp, i) => (
            <View key={i} style={[styles.item, styles.improvementItem]}>
              <Text style={styles.itemIcon}>🔧</Text>
              <Text style={styles.itemText}>{imp}</Text>
            </View>
          ))}
        </View>
      )}

      {debrief.keyMoments && debrief.keyMoments.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key moments</Text>
          {debrief.keyMoments.map((moment, i) => (
            <ImprovementCard key={i} moment={moment} />
          ))}
        </View>
      )}

      {debrief.overallAdvice && (
        <View style={styles.adviceSection}>
          <Text style={styles.adviceLabel}>WINGMAN SAYS</Text>
          <Text style={styles.advice}>{debrief.overallAdvice}</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.doneButton}
        onPress={() => {
          store.resetSession()
          router.replace('/(tabs)/home')
        }}
      >
        <Text style={styles.doneText}>Back to Home</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 24, paddingTop: 60, paddingBottom: 48, gap: 28 },
  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  scoreSection: { alignItems: 'center', gap: 16 },
  summary: {
    color: COLORS.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  section: { gap: 10 },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: 10,
    padding: 14,
    gap: 10,
  },
  improvementItem: {
    borderLeftWidth: 2,
    borderLeftColor: COLORS.warning,
  },
  itemIcon: { fontSize: 14, marginTop: 2 },
  itemText: { color: COLORS.textSecondary, fontSize: 14, lineHeight: 20, flex: 1 },
  adviceSection: {
    backgroundColor: `${COLORS.primary}15`,
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: `${COLORS.primary}30`,
    gap: 8,
  },
  adviceLabel: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
  },
  advice: {
    color: COLORS.textPrimary,
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 26,
  },
  doneButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
  },
  doneText: { color: '#fff', fontSize: 16, fontWeight: '700' },
})
