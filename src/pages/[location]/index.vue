<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed, ref, watch } from 'vue'
import { supabase } from '@/supabase.ts'
import type { Provider, Location } from '@/types/supabaseTables'

const route = useRoute()
const isLoading = ref(false)
const currentLocation = ref<Location | null>(null)
const locationProviders = ref<Provider[]>([])

const location = computed(() => route.params.location)

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
</script>

<template>
  <div>
    <h1 class="font-bold text-2xl !mb-3">{{ currentLocation?.location }}</h1>

    <template v-if="locationProviders.length !== 0">
      <h1 class="font-semibold text-xl !mb-2">List of Providers</h1>
      <div class="w-full flex flex-col gap-y-2 justify-center items-start">
        <template v-for="(provider, _idx) in locationProviders" :key="_idx">
          <h1>{{ provider }}</h1>
        </template>
      </div>
    </template>
  </div>
</template>
