import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { KeyMoment } from '../../types'
import { COLORS } from '../../constants/theme'

interface ImprovementCardProps {
  moment: KeyMoment
}

export default function ImprovementCard({ moment }: ImprovementCardProps) {
  const isPositive = moment.impact === 'positive'

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  return (
    <View
      style={[
        styles.card,
        {
          borderLeftColor: isPositive ? COLORS.success : COLORS.warning,
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.impact}>{isPositive ? '✅' : '🔧'}</Text>
        <Text style={styles.time}>{formatTime(moment.timestampSeconds)}</Text>
      </View>
      <Text style={styles.what}>{moment.what}</Text>
      {moment.betterResponse && (
        <View style={styles.betterSection}>
          <Text style={styles.betterLabel}>Better approach:</Text>
          <Text style={styles.betterText}>{moment.betterResponse}</Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 3,
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  impact: {
    fontSize: 16,
  },
  time: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontVariant: ['tabular-nums'],
  },
  what: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  betterSection: {
    backgroundColor: `${COLORS.primary}10`,
    borderRadius: 8,
    padding: 10,
    gap: 4,
  },
  betterLabel: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  betterText: {
    color: COLORS.textPrimary,
    fontSize: 13,
    lineHeight: 19,
    fontStyle: 'italic',
  },
})
