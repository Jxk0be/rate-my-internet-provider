<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { supabase } from '@/supabase.ts'
import AppFooter from '@/components/AppFooter.vue'
import type { Location } from '@/types/supabaseTables'

const isLoading = ref(false)
const isRouting = ref(false)
const fetchedLocations = ref<Location[]>([])
const allLocations = ref<Location[]>([])
const first = ref(0)

const paginatedLocations = computed(() => {
  const sortedLocations = [...allLocations.value].sort(
    (a, b) => (b.num_of_providers || 0) - (a.num_of_providers || 0),
  )
  return sortedLocations.slice(first.value, first.value + 25)
})

onMounted(async () => {
  isLoading.value = true
  try {
    const { data: locations } = await supabase.from('locations').select('*')
    if (locations) {
      fetchedLocations.value = locations
      allLocations.value = fetchedLocations.value.map((loc) => ({
        ...loc,
        locationFormatted: formatLocationName(loc),
      }))
    }
  } catch (error) {
    console.log('Could not fetch all locations:', error)
  }
  isLoading.value = false
})

const formatLocationName = (loc: Location) => {
  if (!loc.location) return ''
  const [cityPart, state] = loc.location.toString().split('_')
  const city = cityPart.replace(/([A-Z])/g, ' $1').trim()
  return `${city}, ${state}`
}
</script>

<template>
  <div class="all-providers-view min-h-[90vh] max-w-[1280px] mx-auto pt-[80px] pb-8 w-full">
    <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
          Available Locations
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-300">Browse providers by location</p>
      </div>

      <div v-if="paginatedLocations.length !== 0" class="dark:bg-black/20 rounded-lg shadow-sm p-6">
        <div class="grid grid-cols-1 gap-4">
          <template v-for="(loc, idx) in paginatedLocations" :key="idx">
            <router-link
              v-if="loc.num_of_providers > 0"
              :to="{ path: `/${loc.location}`, query: { from: 'search' } }"
              class="block p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
            >
              <div class="flex items-center justify-between">
                <h2
                  class="text-lg font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400"
                >
                  {{ loc.locationFormatted }}
                </h2>
                <span class="text-sm text-nowrap text-gray-500 dark:text-gray-400">
                  {{ loc.num_of_providers }} provider(s)
                </span>
              </div>
            </router-link>
          </template>
        </div>
      </div>

      <AppPaginator
        v-if="allLocations.length > 25"
        :rows="8"
        :total-records="allLocations.length"
        v-model:first="first"
        class="mt-8"
        template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown"
      />
    </div>

    <!-- Loading Overlay -->
    <div
      v-if="isLoading || isRouting"
      class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-20 flex items-center justify-center"
    >
      <AppProgressSpinner />
    </div>
  </div>
  <AppFooter />
</template>
