import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { COLORS } from '../../constants/theme'

interface ScoreBadgeProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
}

export default function ScoreBadge({ score, size = 'md' }: ScoreBadgeProps) {
  const color =
    score >= 75 ? COLORS.success : score >= 50 ? COLORS.warning : COLORS.error

  const dimensions = {
    sm: { width: 36, height: 36, fontSize: 14 },
    md: { width: 48, height: 48, fontSize: 18 },
    lg: { width: 64, height: 64, fontSize: 24 },
  }

  const dim = dimensions[size]

  return (
    <View
      style={[
        styles.badge,
        {
          width: dim.width,
          height: dim.height,
          borderRadius: dim.width / 2,
          backgroundColor: `${color}20`,
          borderColor: `${color}40`,
        },
      ]}
    >
      <Text style={[styles.text, { fontSize: dim.fontSize, color }]}>
        {score}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  text: {
    fontWeight: '800',
  },
})
