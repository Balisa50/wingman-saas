import { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native'
import { router } from 'expo-router'
import { useSubscription } from '../hooks/useSubscription'
import Button from '../components/ui/Button'
import { COLORS } from '../constants/theme'

const FEATURES = [
  { emoji: '♾️', title: 'Unlimited sessions', desc: 'No more monthly limits' },
  { emoji: '🧠', title: 'Advanced AI coaching', desc: 'Smarter, more nuanced tips' },
  { emoji: '📊', title: 'Deep analytics', desc: 'Track your progress over time' },
  { emoji: '🎙️', title: 'Premium voices', desc: 'Choose from 10+ coach voices' },
  { emoji: '📝', title: 'Full transcripts', desc: 'Review every word spoken' },
  { emoji: '⚡', title: 'Priority processing', desc: 'Faster response times' },
]

export default function PaywallScreen() {
  const { packages, isLoading, purchase } = useSubscription()
  const [selectedPkg, setSelectedPkg] = useState(0)

  const handlePurchase = async () => {
    if (packages.length === 0) {
      Alert.alert('Error', 'No packages available')
      return
    }

    const success = await purchase(packages[selectedPkg])
    if (success) {
      Alert.alert('Welcome to Pro!', 'You now have unlimited access.', [
        { text: 'Let\'s Go', onPress: () => router.back() },
      ])
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.emoji}>✨</Text>
        <Text style={styles.title}>Upgrade to Pro</Text>
        <Text style={styles.subtitle}>
          Unlock your full potential with unlimited coaching sessions and premium features.
        </Text>
      </View>

      <View style={styles.features}>
        {FEATURES.map((f, i) => (
          <View key={i} style={styles.featureRow}>
            <Text style={styles.featureEmoji}>{f.emoji}</Text>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureDesc}>{f.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.pricing}>
        <TouchableOpacity
          style={[styles.priceCard, selectedPkg === 0 && styles.priceCardSelected]}
          onPress={() => setSelectedPkg(0)}
        >
          <Text style={styles.priceLabel}>Monthly</Text>
          <Text style={styles.price}>$19.99</Text>
          <Text style={styles.pricePer}>/month</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.priceCard, selectedPkg === 1 && styles.priceCardSelected]}
          onPress={() => setSelectedPkg(1)}
        >
          <View style={styles.saveBadge}>
            <Text style={styles.saveText}>SAVE 40%</Text>
          </View>
          <Text style={styles.priceLabel}>Annual</Text>
          <Text style={styles.price}>$11.99</Text>
          <Text style={styles.pricePer}>/month</Text>
        </TouchableOpacity>
      </View>

      <Button
        title="Start Free Trial"
        onPress={handlePurchase}
        loading={isLoading}
        size="lg"
        style={{ width: '100%' }}
      />

      <Text style={styles.terms}>
        7-day free trial, then auto-renews. Cancel anytime.
      </Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 48,
    gap: 28,
  },
  closeButton: {
    alignSelf: 'flex-end',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  header: {
    alignItems: 'center',
    gap: 10,
  },
  emoji: { fontSize: 48 },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  features: {
    gap: 14,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  featureEmoji: { fontSize: 24 },
  featureText: { flex: 1, gap: 2 },
  featureTitle: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  featureDesc: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
  pricing: {
    flexDirection: 'row',
    gap: 12,
  },
  priceCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 4,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  priceCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: `${COLORS.primary}10`,
  },
  priceLabel: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  price: {
    color: COLORS.textPrimary,
    fontSize: 28,
    fontWeight: '800',
  },
  pricePer: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  saveBadge: {
    position: 'absolute',
    top: -10,
    backgroundColor: COLORS.success,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  saveText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  terms: {
    color: COLORS.textMuted,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
})
