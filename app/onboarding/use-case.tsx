import { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import Button from '../../components/ui/Button'
import { CONTEXTS } from '../../constants/vibes'
import { COLORS } from '../../constants/theme'

export default function UseCaseScreen() {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>What do you text most?</Text>
        <Text style={styles.subtitle}>
          Pick your main vibe. You can switch any time.
        </Text>
      </View>

      <View style={styles.grid}>
        {CONTEXTS.map((c) => {
          const active = c.id === selected
          return (
            <TouchableOpacity
              key={c.id}
              activeOpacity={0.85}
              onPress={() => setSelected(c.id)}
              style={[
                styles.card,
                { borderColor: active ? c.color : COLORS.border },
                active && { backgroundColor: `${c.color}18` },
              ]}
            >
              <Text style={styles.emoji}>{c.emoji}</Text>
              <Text style={styles.label}>{c.label}</Text>
              <Text style={styles.blurb} numberOfLines={2}>
                {c.blurb}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>

      <View style={styles.footer}>
        <Button
          title="Continue"
          onPress={() => router.replace('/auth/signup')}
          size="lg"
          disabled={!selected}
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
  header: { gap: 8 },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: { fontSize: 15, color: COLORS.textSecondary, lineHeight: 22 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: {
    width: '47%',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    gap: 6,
    borderWidth: 1.5,
  },
  emoji: { fontSize: 28 },
  label: { color: COLORS.textPrimary, fontSize: 15, fontWeight: '700' },
  blurb: { color: COLORS.textMuted, fontSize: 12, lineHeight: 16 },
  footer: { marginTop: 'auto', paddingBottom: 24 },
})
