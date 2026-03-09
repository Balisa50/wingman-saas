import { create } from 'zustand'
import { UserProfile, SubscriptionTier } from '../types'

interface UserStore {
  user: UserProfile | null
  isAuthenticated: boolean
  hasCompletedOnboarding: boolean
  setUser: (user: UserProfile | null) => void
  setAuthenticated: (isAuthenticated: boolean) => void
  setOnboardingComplete: (complete: boolean) => void
  updateSubscription: (tier: SubscriptionTier) => void
  incrementSessionCount: () => void
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isAuthenticated: false,
  hasCompletedOnboarding: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setOnboardingComplete: (hasCompletedOnboarding) =>
    set({ hasCompletedOnboarding }),
  updateSubscription: (tier) =>
    set((state) => ({
      user: state.user ? { ...state.user, subscriptionStatus: tier } : null,
    })),
  incrementSessionCount: () =>
    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            sessionsUsedThisMonth: state.user.sessionsUsedThisMonth + 1,
          }
        : null,
    })),
}))
