import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { SESSION_MODES } from '../../constants/modes'
import { SessionMode, ModeConfig } from '../../types'
import { COLORS } from '../../constants/theme'

interface ModeSelectorProps {
  selectedMode: SessionMode | null
  onSelect: (mode: SessionMode) => void
}

function ModeCard({
  config,
  selected,
  onPress,
}: {
  config: ModeConfig
  selected: boolean
  onPress: () => void
}) {
  return (
    <TouchableOpacity
      style={[
        styles.modeCard,
        selected && { borderColor: config.color, borderWidth: 2 },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.emoji}>{config.emoji}</Text>
      <View style={styles.modeInfo}>
        <Text style={styles.modeLabel}>{config.label}</Text>
        <Text style={styles.modeDescription}>{config.description}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default function ModeSelector({ selectedMode, onSelect }: ModeSelectorProps) {
  return (
    <View style={styles.container}>
      {SESSION_MODES.map((mode) => (
        <ModeCard
          key={mode.id}
          config={mode}
          selected={selectedMode === mode.id}
          onPress={() => onSelect(mode.id)}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  modeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 14,
  },
  emoji: {
    fontSize: 32,
  },
  modeInfo: {
    flex: 1,
    gap: 4,
  },
  modeLabel: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  modeDescription: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
})
