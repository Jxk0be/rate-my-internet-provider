import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/supabase.ts'
import { useRouter } from 'vue-router'
import type { MetaData } from '@/types/user'
export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const router = useRouter()

  const username = computed(() => user.value?.user_metadata?.username ?? 'Username')

  const updateUser = (newUser: User | null): void => {
    user.value = newUser
  }

  const register = async (email: string, password: string, metadata: MetaData) => {
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: metadata,
      },
    })

    if (error) {
      console.log('Register Error:', error)
      return
    }
  }

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) {
      console.log('Login Error:', error)
      return
    }

    updateUser(data?.user || null)
  }

  const googleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: import.meta.env.VITE_PROJECT_URL,
      },
    })

    if (error) {
      console.log('Google sign in Error:', error)
      return
    }
  }

  const logout = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.log('Logout Error:', error)
      return
    }

    updateUser(null)
    await router.push('/')
  }

  const forgotPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email)

    if (error) {
      console.log('Password Reset Error:', error)
      return false
    }
    return true
  }

  const updatePassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({
      password: password,
    })

    if (error) {
      console.log('Password update error:', error)
      return false
    }
    return true
  }

  const getCurrentUser = async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error) {
      throw error
    }

    return session?.user
  }

  const updatePublicUsers = async (userId: string) => {
    if (userId) {
      const { data: existingUsers, error: checkError } = await supabase
        .from('public_users')
        .select('user_id')
        .eq('user_id', userId)

      // Check if we have any users in the array
      const existingUser = existingUsers && existingUsers[0]

      if (checkError) {
        console.error('Error checking user existence:', checkError)
        return
      }

      // Only insert if user doesn't exist
      if (!existingUser) {
        const { error: insertError } = await supabase
          .from('public_users')
          .insert([{ user_id: userId }])
          .select()

        if (insertError) {
          console.error('Error inserting user:', insertError)
        }
      }
    }
  }

  // Initialize auth state
  const initialize = async () => {
    try {
      user.value = (await getCurrentUser()) ?? null

      supabase.auth.onAuthStateChange(async (_event, session) => {
        user.value = session?.user ?? null
        await updatePublicUsers(user.value?.id ?? '')
        console.log(user.value?.email ?? null)
      })
    } catch (error) {
      console.error('Error initializing auth:', error)
    }
  }

  // Initialize on store creation
  initialize().then(() => console.log('initialized'))

  return {
    forgotPassword,
    googleLogin,
    login,
    logout,
    register,
    updatePassword,
    updateUser,
    user,
    username,
  }
})
