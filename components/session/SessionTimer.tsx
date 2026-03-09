import React from 'react'
import { Text, StyleSheet } from 'react-native'
import { COLORS } from '../../constants/theme'

interface SessionTimerProps {
  seconds: number
}

export default function SessionTimer({ seconds }: SessionTimerProps) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')

  return <Text style={styles.timer}>{`${m}:${s}`}</Text>
}

const styles = StyleSheet.create({
  timer: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
})
