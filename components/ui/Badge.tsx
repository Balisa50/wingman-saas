import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { COLORS } from '../../constants/theme'

interface BadgeProps {
  label: string
  color?: string
  size?: 'sm' | 'md'
}

export default function Badge({
  label,
  color = COLORS.primary,
  size = 'md',
}: BadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: `${color}20` }, size === 'sm' && styles.sm]}>
      <Text style={[styles.text, { color }, size === 'sm' && styles.textSm]}>
        {label}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  sm: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  textSm: {
    fontSize: 10,
  },
})
