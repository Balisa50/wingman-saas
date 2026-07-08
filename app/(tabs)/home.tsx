import { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import * as Clipboard from 'expo-clipboard'
import * as Haptics from 'expo-haptics'
import { COLORS } from '../../constants/theme'
import { CONTEXTS, VIBES, contextById, vibeById } from '../../constants/vibes'
import { generateReplies, refineReply } from '../../lib/replies'
import { useSavedStore } from '../../stores/savedStore'
import { ReplyResult } from '../../types'

const REFINE_DIRECTIONS = ['bolder', 'funnier', 'smoother'] as const

export default function HomeScreen() {
  const [contextId, setContextId] = useState(CONTEXTS[0].id)
  const [vibeId, setVibeId] = useState(VIBES[0].id)
  const [theirMessage, setTheirMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ReplyResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)
  const [refiningIdx, setRefiningIdx] = useState<number | null>(null)

  const { styleSample, hydrate, saveReply } = useSavedStore()

  useEffect(() => {
    hydrate()
  }, [])

  const canSend = theirMessage.trim().length >= 2 && !loading

  async function run() {
    if (!canSend) return
    setLoading(true)
    setError(null)
    setResult(null)
    setCopiedIdx(null)
    try {
      const res = await generateReplies({
        context: contextById(contextId),
        vibe: vibeById(vibeId),
        theirMessage: theirMessage.trim(),
        styleSample,
      })
      setResult(res)
    } catch {
      setError('The wingman choked. Give it one more shot in a sec.')
    } finally {
      setLoading(false)
    }
  }

  async function copy(text: string, idx: number) {
    await Clipboard.setStringAsync(text)
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {})
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx((c) => (c === idx ? null : c)), 1600)
  }

  async function save(text: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {})
    const ctx = contextById(contextId)
    await saveReply({ text, contextId: ctx.id, contextLabel: ctx.label, vibeId })
  }

  async function refine(original: string, direction: string, idx: number) {
    if (refiningIdx !== null || loading) return
    Haptics.selectionAsync().catch(() => {})
    setRefiningIdx(idx)
    setError(null)
    try {
      const res = await refineReply({
        context: contextById(contextId),
        original,
        direction,
        theirMessage: theirMessage.trim(),
        styleSample,
      })
      setResult(res)
      setCopiedIdx(null)
    } catch {
      setError('Could not rework that one — try again.')
    } finally {
      setRefiningIdx(null)
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Wingman</Text>
          <Text style={styles.subtitle}>
            Paste what they said. Get replies that sound like you.
          </Text>
        </View>

        {/* Context */}
        <View style={styles.chipRow}>
          {CONTEXTS.map((c) => {
            const active = c.id === contextId
            return (
              <TouchableOpacity
                key={c.id}
                onPress={() => setContextId(c.id)}
                activeOpacity={0.8}
                style={[
                  styles.chip,
                  active && { backgroundColor: `${c.color}22`, borderColor: c.color },
                ]}
              >
                <Text style={styles.chipEmoji}>{c.emoji}</Text>
                <Text style={[styles.chipText, active && { color: COLORS.textPrimary }]}>
                  {c.label}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>

        {/* Their message */}
        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            placeholder="Paste their last message, or the whole convo…"
            placeholderTextColor={COLORS.textMuted}
            value={theirMessage}
            onChangeText={setTheirMessage}
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* Vibe */}
        <Text style={styles.label}>Vibe</Text>
        <View style={styles.chipRow}>
          {VIBES.map((v) => {
            const active = v.id === vibeId
            return (
              <TouchableOpacity
                key={v.id}
                onPress={() => setVibeId(v.id)}
                activeOpacity={0.8}
                style={[styles.vibeChip, active && styles.vibeChipActive]}
              >
                <Text style={styles.chipEmoji}>{v.emoji}</Text>
                <Text style={[styles.chipText, active && { color: COLORS.textPrimary }]}>
                  {v.label}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={[styles.cta, !canSend && styles.ctaDisabled]}
          onPress={run}
          disabled={!canSend}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.ctaText}>{result ? 'Regenerate' : 'Get replies'} ✨</Text>
          )}
        </TouchableOpacity>

        {error && <Text style={styles.error}>{error}</Text>}

        {/* Results */}
        {result && (
          <View style={styles.results}>
            {!!result.read && (
              <View style={styles.readBox}>
                <Text style={styles.readLabel}>THE READ</Text>
                <Text style={styles.readText}>{result.read}</Text>
              </View>
            )}
            {result.replies.map((r, i) => (
              <View key={i} style={styles.replyCard}>
                <Text style={styles.replyText}>{r.text}</Text>
                {!!r.why && <Text style={styles.replyWhy}>{r.why}</Text>}
                <View style={styles.replyActions}>
                  <TouchableOpacity
                    style={styles.copyBtn}
                    onPress={() => copy(r.text, i)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.copyBtnText}>
                      {copiedIdx === i ? '✓ Copied' : 'Copy'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.saveBtn}
                    onPress={() => save(r.text)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.saveBtnText}>Save</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.refineRow}>
                  <Text style={styles.refineLabel}>make it</Text>
                  {REFINE_DIRECTIONS.map((d) => (
                    <TouchableOpacity
                      key={d}
                      style={[styles.refineChip, refiningIdx !== null && { opacity: 0.4 }]}
                      disabled={refiningIdx !== null}
                      onPress={() => refine(r.text, d, i)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.refineChipText}>{d}</Text>
                    </TouchableOpacity>
                  ))}
                  {refiningIdx === i && (
                    <ActivityIndicator size="small" color={COLORS.primaryLight} />
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {!result && !loading && (
          <Text style={styles.hint}>
            Tip: paste a few of your own texts in Settings, “Your style”, and every reply will sound like you.
          </Text>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 20, paddingTop: 64, paddingBottom: 120, gap: 16 },
  header: { gap: 6, marginBottom: 4 },
  title: { fontSize: 32, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.5 },
  subtitle: { fontSize: 15, color: COLORS.textSecondary, lineHeight: 20 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: 13,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  vibeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  vibeChipActive: { backgroundColor: `${COLORS.primary}22`, borderColor: COLORS.primary },
  chipEmoji: { fontSize: 15 },
  chipText: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  inputWrap: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  input: {
    minHeight: 110,
    maxHeight: 220,
    padding: 16,
    fontSize: 16,
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  label: { fontSize: 13, fontWeight: '700', color: COLORS.textSecondary, marginTop: 2 },
  cta: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 17,
    alignItems: 'center',
    marginTop: 4,
  },
  ctaDisabled: { opacity: 0.45 },
  ctaText: { color: '#fff', fontSize: 17, fontWeight: '800' },
  error: { color: COLORS.accent, fontSize: 14, textAlign: 'center' },
  results: { gap: 12, marginTop: 4 },
  readBox: {
    backgroundColor: `${COLORS.primary}12`,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: `${COLORS.primary}33`,
    padding: 14,
    gap: 4,
  },
  readLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: COLORS.primaryLight,
  },
  readText: { fontSize: 14, color: COLORS.textPrimary, lineHeight: 20 },
  replyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    gap: 10,
  },
  replyText: { fontSize: 16, color: COLORS.textPrimary, lineHeight: 23 },
  replyWhy: {
    fontSize: 12.5,
    color: COLORS.textMuted,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  replyActions: { flexDirection: 'row', gap: 10, marginTop: 2 },
  copyBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
  },
  copyBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  saveBtn: {
    paddingHorizontal: 18,
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceElevated,
  },
  saveBtnText: { color: COLORS.textSecondary, fontSize: 14, fontWeight: '700' },
  refineRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  refineLabel: { fontSize: 12, color: COLORS.textMuted, fontWeight: '600' },
  refineChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceElevated,
  },
  refineChipText: { fontSize: 12.5, color: COLORS.primaryLight, fontWeight: '700' },
  hint: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 12,
  },
})
