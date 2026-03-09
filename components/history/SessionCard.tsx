import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Session } from '../../types'
import { SESSION_MODES } from '../../constants/modes'
import { COLORS } from '../../constants/theme'

interface SessionCardProps {
  session: Session
  onPress: () => void
}

export default function SessionCard({ session, onPress }: SessionCardProps) {
  const modeConfig = SESSION_MODES.find((m) => m.id === session.mode)
  const durationMin = session.durationSeconds
    ? Math.round(session.durationSeconds / 60)
    : 0
  const date = new Date(session.startedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.row}>
        <Text style={styles.emoji}>{modeConfig?.emoji || '🎧'}</Text>
        <View style={styles.info}>
          <Text style={styles.mode}>{modeConfig?.label || session.mode}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
        {session.score !== undefined && session.score !== null && (
          <View
            style={[
              styles.scoreBadge,
              {
                backgroundColor:
                  session.score >= 75
                    ? `${COLORS.success}20`
                    : session.score >= 50
                      ? `${COLORS.warning}20`
                      : `${COLORS.error}20`,
              },
            ]}
          >
            <Text
              style={[
                styles.scoreText,
                {
                  color:
                    session.score >= 75
                      ? COLORS.success
                      : session.score >= 50
                        ? COLORS.warning
                        : COLORS.error,
                },
              ]}
            >
              {session.score}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.meta}>
        <Text style={styles.metaText}>{durationMin} min</Text>
        <Text style={styles.metaDot}>·</Text>
        <Text style={styles.metaText}>
          {session.coachingTips?.length || 0} tips
        </Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  emoji: {
    fontSize: 28,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  mode: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  date: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  scoreBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '800',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 44,
    gap: 6,
  },
  metaText: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  metaDot: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
})
