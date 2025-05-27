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
  return allLocations.value.slice(first.value, first.value + 25)
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
  <div class="all-providers-view px-5 max-w-[1280px] mx-auto pt-[80px] location-view lg:px-8 pb-8">
    <h1 class="font-bold text-3xl text-gray-900 dark:text-white capitalize mb-2">All Locations</h1>
    <template v-if="paginatedLocations.length !== 0">
      <div class="flex flex-col justify-center gap-y-2">
        <template v-for="(loc, _idx) in paginatedLocations" :key="_idx">
          <h1
            v-if="loc.num_of_providers > 0"
            class="font-semibold text-md capitalize text-gray-900 dark:text-white"
          >
            <router-link
              :to="{
                path: `/${loc.location}`,
                query: {
                  from: 'search',
                },
              }"
              >{{ loc.locationFormatted }}</router-link
            >
          </h1>
        </template>
      </div>
    </template>
    <AppPaginator
      v-if="allLocations.length > 25"
      :rows="8"
      :total-records="allLocations.length"
      v-model:first="first"
      class="mt-4"
      template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown"
    />
  </div>

  <div
    v-if="isLoading || isRouting"
    class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-20 flex items-center justify-center"
  >
    <AppProgressSpinner />
  </div>

  <AppFooter />
</template>
