import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { router } from 'expo-router'
import { useUserStore } from '../../stores/userStore'
import { SESSION_MODES } from '../../constants/modes'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { COLORS } from '../../constants/theme'

export default function HomeScreen() {
  const { user } = useUserStore()
  const firstName = user?.fullName?.split(' ')[0] || 'there'

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hey {firstName} 👋</Text>
          <Text style={styles.subtitle}>Ready to level up?</Text>
        </View>
        <View style={styles.streakBadge}>
          <Text style={styles.streakEmoji}>🔥</Text>
          <Text style={styles.streakText}>
            {user?.sessionsUsedThisMonth || 0}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.quickStart}
        onPress={() => router.push('/session/pre-session')}
        activeOpacity={0.85}
      >
        <View style={styles.quickStartContent}>
          <Text style={styles.quickStartEmoji}>🎧</Text>
          <View style={styles.quickStartText}>
            <Text style={styles.quickStartTitle}>Start a Session</Text>
            <Text style={styles.quickStartSub}>
              Tap to get real-time coaching
            </Text>
          </View>
        </View>
        <View style={styles.quickStartArrow}>
          <Text style={styles.arrowText}>→</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Choose your mode</Text>
        <View style={styles.modesGrid}>
          {SESSION_MODES.map((mode) => (
            <TouchableOpacity
              key={mode.id}
              style={[styles.modeCard, { borderColor: `${mode.color}30` }]}
              onPress={() =>
                router.push({
                  pathname: '/session/pre-session',
                  params: { mode: mode.id },
                })
              }
              activeOpacity={0.7}
            >
              <Text style={styles.modeEmoji}>{mode.emoji}</Text>
              <Text style={styles.modeLabel}>{mode.label}</Text>
              <Text style={styles.modeDesc} numberOfLines={2}>
                {mode.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Card style={styles.proCard}>
        <View style={styles.proContent}>
          <View style={{ flex: 1 }}>
            <Text style={styles.proTitle}>Go Pro ✨</Text>
            <Text style={styles.proDesc}>
              Unlimited sessions, advanced analytics, and priority coaching.
            </Text>
          </View>
          <Button
            title="Upgrade"
            onPress={() => router.push('/paywall')}
            size="sm"
          />
        </View>
      </Card>
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
    gap: 24,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  streakEmoji: { fontSize: 16 },
  streakText: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  quickStart: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quickStartContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  quickStartEmoji: { fontSize: 36 },
  quickStartText: { gap: 4 },
  quickStartTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },
  quickStartSub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
  },
  quickStartArrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  section: {
    gap: 14,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  modesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  modeCard: {
    width: '47%',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    gap: 8,
    borderWidth: 1,
  },
  modeEmoji: { fontSize: 28 },
  modeLabel: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  modeDesc: {
    color: COLORS.textMuted,
    fontSize: 11,
    lineHeight: 16,
  },
  proCard: {
    borderColor: `${COLORS.primary}30`,
    backgroundColor: `${COLORS.primary}10`,
  },
  proContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  proTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  proDesc: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },
})
