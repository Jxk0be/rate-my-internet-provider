<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppNavbar from '@/components/AppNavbar.vue'
import { onMounted, provide, ref } from 'vue'
import { useCountryStateCityAPI } from '@/stores/countryStateCityAPI.ts'
import type { State } from '@/types/countryStateCity'
import { statesKey } from '@/injectionKeys.ts'
import { supabase } from '@/supabase.ts'
import { useUserStore } from '@/stores/user.ts'

const { loadAllStates } = useCountryStateCityAPI()
const userStore = useUserStore()
const allStates = ref<State[]>([])
const appReady = ref(false)

onMounted(async () => {
  const [statesResult, sessionResult] = await Promise.allSettled([
    loadAllStates(),
    supabase.auth.getSession(),
  ])

  if (statesResult.status === 'fulfilled') {
    allStates.value = statesResult.value
  }

  const session = sessionResult.status === 'fulfilled' ? sessionResult.value.data.session : null
  const error = sessionResult.status === 'rejected' ? sessionResult.reason : null
  if (session) userStore.updateUser(session.user)
  if (error) console.log(error)

  appReady.value = true
})

provide(statesKey, allStates)
</script>

<template>
  <div v-if="appReady" class="w-full min-h-screen flex justify-center">
    <AppNavbar />
    <div
      class="max-w-[1280px] pt-[80px] md:pb-0 pb-20 max-h-screen overflow-auto px-5 w-full h-full"
    >
      <RouterView />
    </div>
  </div>
</template>
