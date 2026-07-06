import { create } from 'zustand'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

/**
 * Simple login gate only — used to separate each person's workspace data.
 * There is no plan/tier on the user: once signed in, every feature is fully
 * unlocked (see docs/PRD.md section 8).
 */
interface AuthState {
  userEmail: string | null
  isLoading: boolean
  signInWithEmail: (email: string) => Promise<void>
  signOut: () => Promise<void>
  init: () => Promise<void>
}

const LOCAL_SESSION_KEY = 'cubelv_local_session_email'

export const useAuthStore = create<AuthState>((set) => ({
  userEmail: null,
  isLoading: true,

  init: async () => {
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase.auth.getSession()
      set({ userEmail: data.session?.user.email ?? null, isLoading: false })
      supabase.auth.onAuthStateChange((_event, session) => {
        set({ userEmail: session?.user.email ?? null })
      })
      return
    }
    // No Supabase project configured yet — fall back to a local, no-backend
    // "session" so the UI is fully click-through-able out of the box.
    set({ userEmail: localStorage.getItem(LOCAL_SESSION_KEY), isLoading: false })
  },

  signInWithEmail: async (email: string) => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signInWithOtp({ email })
      if (error) throw error
      return
    }
    localStorage.setItem(LOCAL_SESSION_KEY, email)
    set({ userEmail: email })
  },

  signOut: async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut()
      set({ userEmail: null })
      return
    }
    localStorage.removeItem(LOCAL_SESSION_KEY)
    set({ userEmail: null })
  },
}))
