<script setup lang="ts">
import { statesKey } from '@/injectionKeys.ts'
import { inject, ref, watch } from 'vue'
import type { City, State } from '@/types/countryStateCity'
import type { AutoCompleteCompleteEvent } from 'primevue/autocomplete'
import { useCountryStateCityAPI } from '@/stores/countryStateCityAPI.ts'

const { loadNewCities } = useCountryStateCityAPI()
const states = inject(statesKey) ?? ref<State[]>([])
const selectedState = ref<State | null>(null)
const stateSuggestions = ref([...states.value])
const selectedCity = ref<City | null>(null)
const allCities = ref<City[]>([])
const citySuggestions = ref<City[]>([])
const isLoading = ref(false)

watch(
  () => selectedState.value,
  () => {
    selectedCity.value = null
  },
)
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
  isLoading.value = false
}
</script>

<template>
  <div class="w-full h-screen max-h-[calc(100vh-140px)] pb-8 overflow-auto flex flex-col gap-5">
    <AppAutocomplete
      v-model="selectedState"
      fluid
      force-selection
      optionLabel="name"
      :suggestions="stateSuggestions"
      @complete="stateSearch"
      @option-select="fetchCities"
    >
    </AppAutocomplete>
    <h1>
      Selected State: <span v-if="selectedState">{{ selectedState.name }}</span>
    </h1>
    <AppAutocomplete
      v-if="!isLoading && selectedState"
      v-model="selectedCity"
      fluid
      force-selection
      optionLabel="name"
      :suggestions="citySuggestions"
      @complete="citySearch"
    >
    </AppAutocomplete>
  </div>

  <div
    v-if="isLoading"
    class="fixed inset-0 bg-black/30 backdrop-blur-sm z-20 flex items-center justify-center"
  >
    <AppProgressSpinner />
  </div>
</template>
