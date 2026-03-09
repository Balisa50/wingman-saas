import { useState, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  ViewToken,
} from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated'
import { router } from 'expo-router'
import Button from '../../components/ui/Button'
import { COLORS } from '../../constants/theme'

const { width } = Dimensions.get('window')

const STEPS = [
  {
    emoji: '🎙️',
    title: 'Listen in real-time',
    description:
      'Wingman listens through your earbud mic and transcribes the conversation as it happens.',
  },
  {
    emoji: '🧠',
    title: 'AI coaches you live',
    description:
      'Claude AI analyzes the conversation and whispers short, actionable tips in your ear.',
  },
  {
    emoji: '📊',
    title: 'Get better every time',
    description:
      'After each session, get a detailed debrief with scores, strengths, and improvements.',
  },
]

export default function ValuePropScreen() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const flatListRef = useRef<FlatList>(null)

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentIndex(viewableItems[0].index)
      }
    }
  ).current

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current

  const handleNext = () => {
    if (currentIndex < STEPS.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 })
    } else {
      router.replace('/onboarding/use-case')
    }
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={STEPS}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {STEPS.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                currentIndex === i && styles.dotActive,
              ]}
            />
          ))}
        </View>

        <Button
          title={currentIndex === STEPS.length - 1 ? 'Get Started' : 'Next'}
          onPress={handleNext}
          size="lg"
          style={{ width: '100%' }}
        />

        <Button
          title="Skip"
          onPress={() => router.replace('/auth/signup')}
          variant="ghost"
          size="sm"
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 20,
  },
  emoji: {
    fontSize: 72,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    padding: 24,
    paddingBottom: 48,
    alignItems: 'center',
    gap: 16,
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
  },
  dotActive: {
    backgroundColor: COLORS.primary,
    width: 24,
  },
})
