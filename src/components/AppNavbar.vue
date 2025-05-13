<script setup lang="ts">
import { statesKey } from '@/injectionKeys.ts'
import { inject, ref, watch } from 'vue'
import type { City, State } from '@/types/countryStateCity'
import type { AutoCompleteCompleteEvent } from 'primevue/autocomplete'
import { useCountryStateCityAPI } from '@/stores/countryStateCityAPI.ts'
import LoginRegisterModal from '@/components/LoginRegisterModal.vue'
import { useUserStore } from '@/stores/user.ts'
import { Button as AppButton } from 'primevue'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()
const { loadNewCities } = useCountryStateCityAPI()
const states = inject(statesKey) ?? ref<State[]>([])
const darkMode = ref(document.documentElement.classList.contains('dark'))
const selectedState = ref<State | null>(null)
const stateSuggestions = ref([...states.value])
const selectedCity = ref<City | null>(null)
const allCities = ref<City[]>([])
const citySuggestions = ref<City[]>([])
const isLoading = ref(false)
const isRouting = ref(false)
const loginVisible = ref(false)
const registerVisible = ref(false)

watch(
  () => selectedState.value,
  () => {
    selectedCity.value = null
  },
)

const toggleDarkMode = () => {
  darkMode.value = !darkMode.value
  document.documentElement.classList.toggle('dark')
}

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

const routeToLocation = async () => {
  if (selectedState.value && selectedCity.value) {
    isRouting.value = true
    const city = selectedCity.value?.name.replace(/\s+/g, '').toLowerCase()
    const state = selectedState.value?.name.replace(/\s+/g, '').toLowerCase()
    const locationRoute = city + '_' + state
    await router.push(locationRoute)
    isRouting.value = false
  }
}
</script>

<template>
  <div
    class="fixed z-3 flex text-white justify-center items-center top-0 right-0 mx-auto w-full h-[68px] bg-black"
  >
    <div class="max-w-[1280px] w-full h-full px-5 flex justify-between items-center">
      <RouterLink class="text-nowrap capitalize font-semibold text-lg cursor-pointer" to="/">
        rate my <span class="text-cyan-500">internet</span>
      </RouterLink>

      <div class="w-full flex items-center justify-center gap-x-4">
        <AppAutocomplete
          v-model="selectedState"
          placeholder="Your state"
          class="w-1/4"
          fluid
          force-selection
          optionLabel="name"
          :suggestions="stateSuggestions"
          @complete="stateSearch"
          @option-select="fetchCities"
        >
        </AppAutocomplete>
        <AppAutocomplete
          v-model="selectedCity"
          placeholder="Your city"
          class="w-1/4"
          :loading="isLoading"
          fluid
          force-selection
          optionLabel="name"
          :suggestions="citySuggestions"
          :disabled="!selectedState"
          @complete="citySearch"
        >
        </AppAutocomplete>
        <AppButton @click="routeToLocation" class="p-button-rounded !bg-cyan-500 w-[40px] h-[40px]">
          <i class="pi pi-search text-xl"></i>
        </AppButton>
      </div>
      <div class="gap-x-6 font-semibold text-lg flex justify-between items-center h-full">
        <div v-if="userStore.user" class="flex justify-center items-center gap-x-6">
          <RouterLink to="/account">{{ userStore.username }}</RouterLink>
          <button
            @click="userStore.logout()"
            class="bg-cyan-500 cursor-pointer rounded-[40px] py-1 px-3"
          >
            Logout
          </button>
        </div>

        <div v-else class="flex justify-center items-center gap-x-6">
          <h1 @click="() => (loginVisible = true)" class="cursor-pointer">Login</h1>

          <button
            @click="() => (registerVisible = true)"
            class="bg-cyan-500 cursor-pointer rounded-[40px] py-1 px-3"
          >
            Register
          </button>
        </div>

        <AppButton
          @click="toggleDarkMode"
          :class="`p-button-rounded p-button-text ${darkMode ? '!bg-yellow-500' : '!bg-gray-400 '}`"
        >
          <i :class="`${darkMode ? 'pi pi-sun' : 'pi pi-moon'} !text-white !font-semibold`"></i>
        </AppButton>
      </div>
    </div>
  </div>

  <div
    v-if="isRouting"
    class="fixed inset-0 bg-black/30 backdrop-blur-sm z-20 flex items-center justify-center"
  >
    <AppProgressSpinner />
  </div>

  <LoginRegisterModal
    v-model:login-visible="loginVisible"
    v-model:register-visible="registerVisible"
  />
</template>

<style scoped></style>
