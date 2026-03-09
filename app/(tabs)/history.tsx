import { useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native'
import { router } from 'expo-router'
import { useHistoryStore } from '../../stores/historyStore'
import SessionCard from '../../components/history/SessionCard'
import { COLORS } from '../../constants/theme'

export default function HistoryScreen() {
  const { sessions, isLoading, fetchSessions } = useHistoryStore()

  useEffect(() => {
    fetchSessions()
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Session History</Text>
        <Text style={styles.subtitle}>
          {sessions.length} session{sessions.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {isLoading && sessions.length === 0 ? (
        <View style={styles.loading}>
          <ActivityIndicator color={COLORS.primary} size="large" />
        </View>
      ) : sessions.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>📝</Text>
          <Text style={styles.emptyTitle}>No sessions yet</Text>
          <Text style={styles.emptyText}>
            Start your first coaching session to see your history here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={sessions}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={fetchSessions}
              tintColor={COLORS.primary}
            />
          }
          renderItem={({ item }) => (
            <SessionCard
              session={item}
              onPress={() =>
                router.push({
                  pathname: '/session/debrief',
                  params: {
                    sessionId: item.id,
                    debrief: JSON.stringify(item.debrief),
                  },
                })
              }
            />
          )}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
    gap: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  list: {
    padding: 24,
    paddingTop: 8,
    paddingBottom: 100,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    gap: 12,
  },
  emptyEmoji: { fontSize: 48 },
  emptyTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
})
