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
    await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
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
