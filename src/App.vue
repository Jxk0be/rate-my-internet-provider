<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppNavbar from '@/components/AppNavbar.vue'
import { onMounted, provide, ref } from 'vue'
import { useCountryStateCityAPI } from '@/stores/countryStateCityAPI.ts'
import type { State } from '@/types/countryStateCity'
import { statesKey } from '@/injectionKeys.ts'

const { loadAllStates } = useCountryStateCityAPI()
const allStates = ref<State[]>([])
const appReady = ref(false)

onMounted(async () => {
  allStates.value = await loadAllStates()
  appReady.value = true
})

provide(statesKey, allStates)
</script>

<template>
  <div v-if="appReady" class="w-full min-h-screen flex justify-center">
    <AppNavbar />
    <div class="max-w-[1280px] pt-[80px] max-h-screen overflow-auto px-5 w-full h-full">
      <RouterView />
    </div>
  </div>
</template>
