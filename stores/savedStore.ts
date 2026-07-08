import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SavedReply } from '../types'

const SAVED_KEY = 'wingman_saved_replies'
const STYLE_KEY = 'wingman_style_sample'

interface SavedStore {
  saved: SavedReply[]
  styleSample: string
  hydrated: boolean
  hydrate: () => Promise<void>
  saveReply: (r: Omit<SavedReply, 'id' | 'savedAt'>) => Promise<void>
  removeReply: (id: string) => Promise<void>
  setStyleSample: (s: string) => Promise<void>
}

export const useSavedStore = create<SavedStore>((set, get) => ({
  saved: [],
  styleSample: '',
  hydrated: false,

  hydrate: async () => {
    try {
      const [rawSaved, style] = await Promise.all([
        AsyncStorage.getItem(SAVED_KEY),
        AsyncStorage.getItem(STYLE_KEY),
      ])
      set({
        saved: rawSaved ? (JSON.parse(rawSaved) as SavedReply[]) : [],
        styleSample: style ?? '',
        hydrated: true,
      })
    } catch {
      set({ hydrated: true })
    }
  },

  saveReply: async (r) => {
    const entry: SavedReply = {
      ...r,
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      savedAt: new Date().toISOString(),
    }
    const next = [entry, ...get().saved].slice(0, 200)
    set({ saved: next })
    try {
      await AsyncStorage.setItem(SAVED_KEY, JSON.stringify(next))
    } catch {
      /* best effort */
    }
  },

  removeReply: async (id) => {
    const next = get().saved.filter((s) => s.id !== id)
    set({ saved: next })
    try {
      await AsyncStorage.setItem(SAVED_KEY, JSON.stringify(next))
    } catch {
      /* best effort */
    }
  },

  setStyleSample: async (s) => {
    set({ styleSample: s })
    try {
      await AsyncStorage.setItem(STYLE_KEY, s)
    } catch {
      /* best effort */
    }
  },
}))
