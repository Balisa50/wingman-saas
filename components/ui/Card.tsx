import React from 'react'
import { View, StyleSheet, ViewStyle } from 'react-native'
import { COLORS } from '../../constants/theme'

interface CardProps {
  children: React.ReactNode
  style?: ViewStyle
  elevated?: boolean
}

export default function Card({ children, style, elevated = false }: CardProps) {
  return (
    <View
      style={[
        styles.card,
        elevated && styles.elevated,
        style,
      ]}
    >
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  elevated: {
    backgroundColor: COLORS.surfaceElevated,
    borderColor: 'transparent',
  },
})
