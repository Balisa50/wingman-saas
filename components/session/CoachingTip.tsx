import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  FadeIn,
  SlideInDown,
} from 'react-native-reanimated'
import { COLORS } from '../../constants/theme'

interface CoachingTipProps {
  tip: string
  visible: boolean
}

export default function CoachingTip({ tip, visible }: CoachingTipProps) {
  if (!visible || !tip) return null

  return (
    <Animated.View
      entering={SlideInDown.springify().damping(15)}
      style={styles.container}
    >
      <Text style={styles.label}>WINGMAN</Text>
      <Text style={styles.tip}>{tip}</Text>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  label: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 6,
  },
  tip: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 26,
  },
})
