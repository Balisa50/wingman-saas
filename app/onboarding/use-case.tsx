import { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import ModeSelector from '../../components/session/ModeSelector'
import Button from '../../components/ui/Button'
import { SessionMode } from '../../types'
import { COLORS } from '../../constants/theme'

export default function UseCaseScreen() {
  const [selectedMode, setSelectedMode] = useState<SessionMode | null>(null)

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>What will you use Wingman for?</Text>
        <Text style={styles.subtitle}>
          Pick your main use case. You can always switch later.
        </Text>
      </View>

      <ModeSelector selectedMode={selectedMode} onSelect={setSelectedMode} />

      <View style={styles.footer}>
        <Button
          title="Continue"
          onPress={() => router.replace('/auth/signup')}
          size="lg"
          disabled={!selectedMode}
          style={{ width: '100%' }}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 24,
    paddingTop: 80,
    gap: 24,
  },
  header: {
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  footer: {
    marginTop: 'auto',
    paddingBottom: 24,
  },
})
