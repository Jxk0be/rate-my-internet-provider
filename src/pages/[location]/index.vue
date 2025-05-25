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

const routeToAddProvider = async () => {
  await router.push({
    path: '/add-provider',
    query: {
      from: location.value?.toString(),
      locationName: locationName.value,
      locationId: currentLocation.value?.id || null,
    },
  })
}
</script>

<template>
  <div v-if="!isLoading" class="max-w-7xl location-view mx-auto lg:px-8 pb-8">
    <div
      class="bg-white w-full dark:bg-gray-800 rounded-lg flex gap-x-3 items-center shadow-sm p-3 mb-6"
    >
      <div
        class="flex items-center gap-x-2 text-lg font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer transition-colors duration-200"
      >
        <h1 @click="async () => await router.push(`/`)">Home</h1>
      </div>

      <span class="text-lg text-gray-400">/</span>
      <div
        class="flex items-center gap-x-2 text-lg font-semibold text-gray-900 dark:text-white capitalize"
      >
        <i class="pi pi-map-marker"></i>
        {{ locationName }}
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h1 class="font-semibold text-xl mb-4">List of Providers</h1>

      <template v-if="locationProviders.length !== 0">
        <div class="w-full flex flex-col gap-y-4">
          <template v-for="(provider, _idx) in locationProviders" :key="_idx">
            <div
              @click="() => routeToProvider(provider.id)"
              class="w-full cursor-pointer flex flex-col justify-center border-b border-gray-200 dark:border-gray-700 last:border-0 last:pb-0 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors duration-200"
            >
              <div class="flex gap-x-2 items-center">
                <h1 class="font-bold mb-1 text-xl capitalize text-gray-900 dark:text-white">
                  {{ provider.name }}
                </h1>
                <h1 class="text-sm text-gray-500 dark:text-gray-400">
                  ({{ provider.total_reviews }} reviews)
                </h1>
              </div>
              <div class="flex items-center gap-2">
                <AppRating
                  readonly
                  :model-value="Math.round(provider.overall_rating ?? 0)"
                  :cancel="false"
                  class="custom-rating"
                />
                <span class="text-sm text-gray-600 dark:text-gray-400">
                  ({{ (provider.overall_rating ?? 0).toFixed(1) }})
                </span>
              </div>
            </div>
          </template>

          <div
            @click="routeToAddProvider"
            class="w-full cursor-pointer flex flex-col justify-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors duration-200"
          >
            <div class="flex items-center justify-between sm:flex-row flex-col">
              <div>
                <h1 class="font-bold mb-1 text-xl capitalize text-gray-900 dark:text-white">
                  Can't find your provider?
                </h1>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  Logged in users can add their provider
                </div>
              </div>
              <button
                class="cursor-pointer mt-6 sm:mt-0 px-6 py-3 rounded-lg bg-[#00b8db] text-white font-semibold text-base hover:bg-[#00a3c4] transition-colors duration-200 shadow-sm hover:shadow-md active:transform active:scale-95"
              >
                Add Provider
              </button>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>

  <div
    v-if="isRouting || isLoading"
    class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-20 flex items-center justify-center"
  >
    <AppProgressSpinner />
  </div>
</template>

<style>
.location-view {
  .custom-rating {
    --p-rating-icon-size: 1.25rem;
    --p-rating-icon-color: #e5e7eb;
    --p-rating-icon-active-color: #00b8db;
    --p-rating-gap: 0.25rem;
  }
}

@media (min-width: 640px) {
  .location-view .custom-rating {
    --p-rating-icon-size: 1.5rem;
  }
}
</style>
