import React, { useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated'
import { COLORS } from '../../constants/theme'

interface WaveformVisualizerProps {
  isActive: boolean
  color?: string
  barCount?: number
}

function WaveBar({ index, isActive, color }: { index: number; isActive: boolean; color: string }) {
  const height = useSharedValue(8)

  useEffect(() => {
    if (isActive) {
      height.value = withDelay(
        index * 80,
        withRepeat(
          withTiming(20 + Math.random() * 24, {
            duration: 300 + Math.random() * 400,
            easing: Easing.inOut(Easing.ease),
          }),
          -1,
          true
        )
      )
    } else {
      height.value = withTiming(8, { duration: 300 })
    }
  }, [isActive])

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
  }))

  return (
    <Animated.View
      style={[
        styles.bar,
        { backgroundColor: color },
        animatedStyle,
      ]}
    />
  )
}

export default function WaveformVisualizer({
  isActive,
  color = COLORS.primary,
  barCount = 24,
}: WaveformVisualizerProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: barCount }).map((_, i) => (
        <WaveBar key={i} index={i} isActive={isActive} color={color} />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    height: 48,
  },
  bar: {
    width: 3,
    borderRadius: 2,
    minHeight: 8,
  },
})
