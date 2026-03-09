import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native'
import { router } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { useUserStore } from '../../stores/userStore'
import Card from '../../components/ui/Card'
import { COLORS } from '../../constants/theme'

export default function SettingsScreen() {
  const { user, setUser } = useUserStore()

  const handleLogout = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await supabase.auth.signOut()
          setUser(null)
          router.replace('/auth/login')
        },
      },
    ])
  }

  const settingsItems = [
    {
      icon: '👤',
      title: 'Profile',
      subtitle: user?.email || 'Not signed in',
      onPress: () => {},
    },
    {
      icon: '✨',
      title: 'Subscription',
      subtitle: user?.subscriptionStatus === 'pro' ? 'Pro Plan' : 'Free Plan',
      onPress: () => router.push('/paywall'),
    },
    {
      icon: '🔔',
      title: 'Notifications',
      subtitle: 'Manage reminders',
      onPress: () => {},
    },
    {
      icon: '🎙️',
      title: 'Audio Settings',
      subtitle: 'Mic and playback preferences',
      onPress: () => {},
    },
    {
      icon: '🛡️',
      title: 'Privacy',
      subtitle: 'Data and permissions',
      onPress: () => {},
    },
    {
      icon: '❓',
      title: 'Help & Support',
      subtitle: 'FAQ and contact',
      onPress: () => {},
    },
  ]

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.fullName?.charAt(0)?.toUpperCase() || '?'}
          </Text>
        </View>
        <Text style={styles.name}>{user?.fullName || 'Guest'}</Text>
        <Text style={styles.email}>{user?.email || ''}</Text>
      </View>

      <View style={styles.settingsGroup}>
        {settingsItems.map((item, i) => (
          <TouchableOpacity
            key={i}
            style={styles.settingsItem}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <Text style={styles.settingsIcon}>{item.icon}</Text>
            <View style={styles.settingsInfo}>
              <Text style={styles.settingsTitle}>{item.title}</Text>
              <Text style={styles.settingsSubtitle}>{item.subtitle}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Wingman v1.0.0</Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 100,
    gap: 24,
  },
  header: {
    gap: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  profileSection: {
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
  },
  name: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: '700',
  },
  email: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  settingsGroup: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingsIcon: {
    fontSize: 22,
  },
  settingsInfo: {
    flex: 1,
    gap: 2,
  },
  settingsTitle: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  settingsSubtitle: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  chevron: {
    color: COLORS.textMuted,
    fontSize: 22,
    fontWeight: '300',
  },
  logoutButton: {
    backgroundColor: `${COLORS.error}15`,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: `${COLORS.error}30`,
  },
  logoutText: {
    color: COLORS.error,
    fontSize: 15,
    fontWeight: '700',
  },
  version: {
    color: COLORS.textMuted,
    fontSize: 12,
    textAlign: 'center',
  },
})
