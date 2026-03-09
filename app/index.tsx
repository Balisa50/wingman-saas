import { useEffect } from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { supabase } from '../lib/supabase'
import { useUserStore } from '../stores/userStore'
import { COLORS } from '../constants/theme'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function IndexScreen() {
  const { setUser, setOnboardingComplete } = useUserStore()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      // Check if onboarding has been completed
      const onboardingDone = await AsyncStorage.getItem('onboarding_complete')

      if (!onboardingDone) {
        router.replace('/onboarding/splash')
        return
      }

      // Check for existing session
      const { data: { session } } = await supabase.auth.getSession()

      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (profile) {
          setUser({
            id: profile.id,
            email: profile.email,
            fullName: profile.full_name || '',
            avatarUrl: profile.avatar_url,
            subscriptionStatus: profile.subscription_status || 'free',
            sessionsUsedThisMonth: profile.sessions_used_this_month || 0,
          })
        }

        setOnboardingComplete(true)
        router.replace('/(tabs)/home')
      } else {
        router.replace('/auth/login')
      }
    } catch {
      router.replace('/onboarding/splash')
    }
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
