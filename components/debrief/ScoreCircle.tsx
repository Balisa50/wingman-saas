import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { COLORS } from '../../constants/theme'

interface ScoreCircleProps {
  score: number
}

export default function ScoreCircle({ score }: ScoreCircleProps) {
  const color =
    score >= 75 ? COLORS.success : score >= 50 ? COLORS.warning : COLORS.error

  return (
    <View style={[styles.circle, { borderColor: color }]}>
      <Text style={[styles.score, { color }]}>{score}</Text>
      <Text style={styles.label}>/ 100</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  circle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  score: {
    fontSize: 44,
    fontWeight: '800',
  },
  label: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
})
