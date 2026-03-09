import { useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
} from 'react-native-reanimated'
import { router } from 'expo-router'
import { COLORS } from '../../constants/theme'

export default function SplashScreen() {
  const scale = useSharedValue(0.3)
  const opacity = useSharedValue(0)
  const taglineOpacity = useSharedValue(0)

  useEffect(() => {
    scale.value = withSpring(1, { damping: 12, stiffness: 100 })
    opacity.value = withTiming(1, { duration: 600 })
    taglineOpacity.value = withDelay(800, withTiming(1, { duration: 600 }))

    const timer = setTimeout(() => {
      router.replace('/onboarding/value-prop')
    }, 2800)

    return () => clearTimeout(timer)
  }, [])

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }))

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
  }))

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, logoStyle]}>
        <Text style={styles.logo}>🎧</Text>
        <Text style={styles.appName}>Wingman</Text>
      </Animated.View>
      <Animated.Text style={[styles.tagline, taglineStyle]}>
        Your unfair advantage in every conversation.
      </Animated.Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  logoContainer: { alignItems: 'center', gap: 12 },
  logo: { fontSize: 72 },
  appName: {
    fontSize: 42,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
})
