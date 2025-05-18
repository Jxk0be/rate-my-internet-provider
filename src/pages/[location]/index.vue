<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed, ref, watch } from 'vue'
import { supabase } from '@/supabase.ts'
import type { Provider, Location } from '@/types/supabaseTables'
import { Rating as AppRating } from 'primevue'

const route = useRoute()
const router = useRouter()
const isLoading = ref(false)
const isRouting = ref(false)
const currentLocation = ref<Location | null>(null)
const locationProviders = ref<Provider[]>([])

const location = computed(() => route.params.location)
const locationName = computed(() => {
  if (!location.value) return ''

  const [cityPart, state] = location.value.toString().split('_')
  const city = cityPart.replace(/([A-Z])/g, ' $1').trim()

  return `${city}, ${state}`
})

watch(
  () => location.value,
  async () => {
    if (!location.value) return

    const locationString = location.value.toString()

    isLoading.value = true
    const { data: locations } = await supabase
      .from('locations')
      .select('*')
      .eq('location', locationString)

    const sbLocation = locations?.[0]

    if (!sbLocation) {
      const { data: newLocation, error: insertLocError } = await supabase
        .from('locations')
        .insert([{ location: locationString }])
        .select()
        .single()

      if (insertLocError) {
        console.error('Failed to insert location:', insertLocError)
        isLoading.value = false
        return
      }
      currentLocation.value = newLocation
    } else currentLocation.value = sbLocation

    if (!currentLocation.value?.id) {
      console.error('No location ID available')
      isLoading.value = false
      return
    }

    const { data: providers, error } = await supabase
      .from('providers')
      .select('*') // you can specify specific columns if needed
      .eq('location_id', currentLocation.value.id)

    if (error) {
      console.error('Error fetching providers:', error)
      isLoading.value = false
      return
    }

    locationProviders.value = providers ?? []
    isLoading.value = false
  },
  { immediate: true },
)

const routeToProvider = async (provider_id: number) => {
  if (provider_id) {
    isRouting.value = true
    await router.push(`${route.path}/${provider_id}`)
    isRouting.value = false
  }
}
</script>

<template>
  <div>
    <h1 class="font-bold text-2xl mb-3">{{ locationName }}</h1>

    <h1 class="font-semibold text-xl mb-2">List of Providers</h1>
    <template v-if="locationProviders.length !== 0">
      <div class="w-full flex flex-col gap-y-2 justify-center items-start">
        <template v-for="(provider, _idx) in locationProviders" :key="_idx">
          <div
            @click="() => routeToProvider(provider.id)"
            :class="`w-full cursor-pointer flex flex-col justify-center p-2 ${locationProviders.length > 1 && _idx === locationProviders.length - 1 ? '' : 'border-b-1'} border-slate-200 rounded-md`"
          >
            <div class="flex gap-x-2 items-center">
              <h1 class="font-bold mb-1 text-xl capitalize">{{ provider.name }}</h1>
              <h1 class="text-sm text-gray-600">({{ provider.total_reviews }} reviews)</h1>
            </div>
            <div class="flex items-center gap-2">
              <AppRating
                readonly
                :model-value="Math.round(provider.overall_rating ?? 0)"
                :cancel="false"
                class="custom-rating"
              />
              <span class="text-sm text-gray-600"
                >({{ (provider.overall_rating ?? 0).toFixed(1) }})</span
              >
            </div>
          </div>
        </template>
      </div>
    </template>
  </div>

  <div
    v-if="isRouting || isLoading"
    class="fixed inset-0 bg-black/30 backdrop-blur-sm z-20 flex items-center justify-center"
  >
    <AppProgressSpinner />
  </div>
</template>

<style>
.custom-rating {
  --p-rating-icon-size: 1rem;
  --p-rating-icon-color: #d1d5db; /* Color for inactive stars */
  --p-rating-icon-active-color: #00b8db; /* Color for active stars */
  --p-rating-gap: 0.25rem; /* Space between stars */
}
</style>
