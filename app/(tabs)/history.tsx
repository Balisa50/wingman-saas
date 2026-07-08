import { useEffect } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import * as Clipboard from 'expo-clipboard'
import * as Haptics from 'expo-haptics'
import { useSavedStore } from '../../stores/savedStore'
import { COLORS } from '../../constants/theme'

export default function SavedScreen() {
  const { saved, hydrate, removeReply } = useSavedStore()

  useEffect(() => {
    hydrate()
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved lines</Text>
        <Text style={styles.subtitle}>
          {saved.length} saved{saved.length !== 0 ? ' • tap to copy' : ''}
        </Text>
      </View>

      {saved.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>💾</Text>
          <Text style={styles.emptyTitle}>Nothing saved yet</Text>
          <Text style={styles.emptyText}>
            Hit “Save” on a reply you love and it’ll live here, ready to copy.
          </Text>
        </View>
      ) : (
        <FlatList
          data={saved}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.8}
              onPress={async () => {
                await Clipboard.setStringAsync(item.text)
                Haptics.notificationAsync(
                  Haptics.NotificationFeedbackType.Success
                ).catch(() => {})
              }}
            >
              <Text style={styles.cardText}>{item.text}</Text>
              <View style={styles.cardFooter}>
                <Text style={styles.cardMeta}>{item.contextLabel}</Text>
                <TouchableOpacity
                  onPress={() => removeReply(item.id)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={styles.remove}>Remove</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 16, gap: 4 },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.textPrimary },
  subtitle: { fontSize: 14, color: COLORS.textMuted },
  list: { padding: 24, paddingTop: 8, paddingBottom: 100 },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    gap: 12,
  },
  cardText: { fontSize: 15, color: COLORS.textPrimary, lineHeight: 21 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardMeta: { fontSize: 12, color: COLORS.textMuted, fontWeight: '600' },
  remove: { fontSize: 12, color: COLORS.accent, fontWeight: '700' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40, gap: 12 },
  emptyEmoji: { fontSize: 48 },
  emptyTitle: { color: COLORS.textPrimary, fontSize: 18, fontWeight: '700' },
  emptyText: { color: COLORS.textMuted, fontSize: 14, textAlign: 'center', lineHeight: 20 },
})
