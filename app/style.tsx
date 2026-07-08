import { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { router } from 'expo-router'
import { useSavedStore } from '../stores/savedStore'
import { COLORS } from '../constants/theme'

export default function StyleScreen() {
  const { styleSample, hydrate, setStyleSample } = useSavedStore()
  const [text, setText] = useState('')

  useEffect(() => {
    hydrate()
  }, [])
  useEffect(() => {
    setText(styleSample)
  }, [styleSample])

  async function save() {
    await setStyleSample(text.trim())
    router.back()
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Text style={styles.close}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Your style</Text>
          <View style={{ width: 24 }} />
        </View>

        <Text style={styles.blurb}>
          Paste a handful of texts you’ve actually sent — group chat, DMs, anything. Wingman
          learns your voice and every reply will sound like you, not a robot.
        </Text>

        <TextInput
          style={styles.input}
          placeholder={'e.g.\nlmaooo no way\nok but that’s actually kinda fire\nyeah i’m down, what time'}
          placeholderTextColor={COLORS.textMuted}
          value={text}
          onChangeText={setText}
          multiline
          textAlignVertical="top"
        />

        <TouchableOpacity style={styles.save} onPress={save} activeOpacity={0.85}>
          <Text style={styles.saveText}>Save my style</Text>
        </TouchableOpacity>

        {!!styleSample && (
          <TouchableOpacity
            onPress={async () => {
              await setStyleSample('')
              setText('')
            }}
          >
            <Text style={styles.clear}>Clear saved style</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 24, paddingTop: 24, gap: 18, paddingBottom: 60 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  close: { color: COLORS.textSecondary, fontSize: 20, fontWeight: '700', width: 24 },
  title: { color: COLORS.textPrimary, fontSize: 20, fontWeight: '800' },
  blurb: { color: COLORS.textSecondary, fontSize: 15, lineHeight: 22 },
  input: {
    minHeight: 200,
    maxHeight: 360,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    fontSize: 16,
    color: COLORS.textPrimary,
    lineHeight: 23,
  },
  save: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  clear: { color: COLORS.textMuted, fontSize: 14, textAlign: 'center', fontWeight: '600' },
})
