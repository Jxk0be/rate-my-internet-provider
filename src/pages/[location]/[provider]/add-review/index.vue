<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed, ref, watch } from 'vue'
import { supabase } from '@/supabase.ts'
import type { Provider, Location } from '@/types/supabaseTables'

const route = useRoute()
const router = useRouter()
const isLoading = ref(false)
const isRouting = ref(false)
const currentLocation = ref<Location | null>(null)
const locationProviders = ref<Provider[]>([])

const location = computed(() => route.params.addReview)
const locationName = computed(() => {
  if (!location.value) return ''

  const [cityPart, state] = location.value.toString().split('_')
  const city = cityPart.replace(/([A-Z])/g, ' $1').trim()

  return `${city}, ${state}`
})
</script>

<template>
  <div>
    <h1>Add Review Page</h1>
  </div>
</template>
