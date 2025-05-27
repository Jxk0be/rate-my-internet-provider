<script setup lang="ts">
import type { AutoCompleteCompleteEvent } from 'primevue/autocomplete'
import { statesKey } from '@/injectionKeys.ts'
import { inject, ref } from 'vue'
import type { City, State } from '@/types/countryStateCity'
import { useCountryStateCityAPI } from '@/stores/countryStateCityAPI.ts'
import { Button as AppButton } from 'primevue'
import { useRouter } from 'vue-router'
import AppFooter from '@/components/AppFooter.vue'
import HeroImage from '@/assets/hero_image_3.jpg'

const router = useRouter()
const { loadNewCities } = useCountryStateCityAPI()
const states = inject(statesKey) ?? ref<State[]>([])
const selectedState = ref<State | null>(null)
const stateSuggestions = ref([...states.value])
const selectedCity = ref<City | null>(null)
const allCities = ref<City[]>([])
const citySuggestions = ref<City[]>([])
const isLoading = ref(false)
const isRouting = ref(false)

const stateSearch = (event: AutoCompleteCompleteEvent) => {
  stateSuggestions.value = [...states.value].filter((st) =>
    st.name.toLowerCase().includes(event.query.toLowerCase()),
  )
}

const citySearch = (event: AutoCompleteCompleteEvent) => {
  citySuggestions.value = [...allCities.value].filter((cty) =>
    cty.name.toLowerCase().includes(event.query.toLowerCase()),
  )
}

const fetchCities = async () => {
  isLoading.value = true
  if (selectedState.value) {
    allCities.value = await loadNewCities(selectedState.value)
  }
  allCities.value = allCities.value.filter((cty) => !cty.name.toLowerCase().includes('county'))
  isLoading.value = false
}

const routeToLocation = async () => {
  if (selectedState.value && selectedCity.value) {
    isRouting.value = true

    const city = selectedCity.value?.name.replace(/\s+/g, '')
    const state = selectedState.value?.name.replace(/\s+/g, '')
    const locationRoute = city + '_' + state

    await router.push({
      path: `/${locationRoute}`,
      query: { from: 'search' },
    })
    isRouting.value = false
  }
}
</script>

<template>
  <div class="relative min-h-[70vh] pt-[70px] flex items-center justify-center">
    <div
      class="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
      :style="{ backgroundImage: `url(${HeroImage})` }"
    >
      <div class="absolute inset-0 bg-black/40"></div>
    </div>

    <div class="relative max-w-[1280px] mx-auto sm:px-5 z-[2] w-full">
      <h1 class="text-4xl md:text-6xl font-bold text-white text-center mb-8">
        Find Internet Providers In Your Area
      </h1>

      <div class="w-full flex items-center justify-center gap-x-4">
        <AppAutocomplete
          v-model="selectedState"
          placeholder="Your state"
          class="w-1/3"
          fluid
          force-selection
          optionLabel="name"
          :suggestions="stateSuggestions"
          @complete="stateSearch"
          @option-select="fetchCities"
        />
        <AppAutocomplete
          v-model="selectedCity"
          :placeholder="!selectedState ? 'Pick your state first' : 'Your city'"
          class="w-1/3"
          :loading="isLoading"
          fluid
          force-selection
          optionLabel="name"
          :suggestions="citySuggestions"
          :disabled="!selectedState"
          @complete="citySearch"
        />
        <AppButton @click="routeToLocation" class="p-button-rounded !bg-cyan-500 w-[40px] h-[40px]">
          <i class="pi pi-search text-xl"></i>
        </AppButton>
      </div>
    </div>
  </div>

  <section class="py-16 min-h-[30vh] max-w-[1280px] mx-auto sm:px-5">
    <div class="max-w-6xl mx-auto px-4">
      <div class="grid md:grid-cols-2 gap-12">
        <div class="text-center md:text-left">
          <div class="mb-4">
            <i class="pi pi-map-marker text-4xl text-cyan-500"></i>
          </div>
          <h2 class="text-2xl font-bold mb-4">Find your City</h2>
          <p class="text-gray-600">
            Find your closest city and see your specific ISP options and how others view them. Make
            informed decisions based on real user experiences in your area.
          </p>
        </div>

        <div class="text-center md:text-left">
          <div class="mb-4">
            <i class="pi pi-pencil text-4xl text-cyan-500"></i>
          </div>
          <h2 class="text-2xl font-bold mb-4">Write a Review</h2>
          <p class="text-gray-600">
            Share your experience with current or past ISPs in your area. Help others make better
            choices with your honest feedback.
          </p>
        </div>
      </div>
    </div>
  </section>

  <AppFooter />
</template>

<style>
.p-disabled,
.p-component:disabled {
  opacity: 1 !important;
}
</style>
