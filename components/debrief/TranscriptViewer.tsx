import React from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { TranscriptSegment } from '../../types'
import { COLORS } from '../../constants/theme'

interface TranscriptViewerProps {
  segments: TranscriptSegment[]
}

export default function TranscriptViewer({ segments }: TranscriptViewerProps) {
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  return (
    <ScrollView style={styles.container} nestedScrollEnabled>
      {segments.map((seg, i) => (
        <View
          key={i}
          style={[
            styles.segment,
            seg.speaker === 'user' ? styles.userSegment : styles.otherSegment,
          ]}
        >
          <View style={styles.header}>
            <Text style={styles.speaker}>
              {seg.speaker === 'user' ? 'You' : 'Them'}
            </Text>
            <Text style={styles.time}>{formatTime(seg.timestampSeconds)}</Text>
          </View>
          <Text style={styles.text}>{seg.text}</Text>
        </View>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    maxHeight: 300,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 12,
  },
  segment: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  userSegment: {
    backgroundColor: `${COLORS.primary}15`,
    borderLeftWidth: 2,
    borderLeftColor: COLORS.primary,
  },
  otherSegment: {
    backgroundColor: COLORS.surfaceElevated,
    borderLeftWidth: 2,
    borderLeftColor: COLORS.textMuted,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  speaker: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  time: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontVariant: ['tabular-nums'],
  },
  text: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
})
