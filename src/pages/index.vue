<script setup lang="ts">
import { statesKey } from '@/injectionKeys.ts'
import { inject, ref } from 'vue'
import type { State } from '@/types/countryStateCity'
import type { AutoCompleteCompleteEvent } from 'primevue/autocomplete'

const states = inject(statesKey) ?? ref<State[]>([])
const selectedState = ref<State | null>(null)
const stateSuggestions = ref([...states.value])

const stateSearch = (event: AutoCompleteCompleteEvent) => {
  stateSuggestions.value = [...states.value].filter((st) =>
    st.name.toLowerCase().includes(event.query.toLowerCase()),
  )
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
    >
    </AppAutocomplete>
    <h1>
      Selected State: <span v-if="selectedState">{{ selectedState.name }}</span>
    </h1>
  </div>
</template>
