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

  const logout = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.log('Logout Error:', error)
      return
    }

    updateUser(null)
    await router.push('/')
  }

  return { login, logout, register, updateUser, user, username }
})
