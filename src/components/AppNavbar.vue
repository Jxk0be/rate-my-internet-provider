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
const isSearchVisible = ref(false)
const isMobileMenuOpen = ref(false)

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

const toggleSearch = () => {
  isSearchVisible.value = !isSearchVisible.value
  isMobileMenuOpen.value = false
  if (!isSearchVisible.value) {
    selectedState.value = null
    selectedCity.value = null
  }
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  isSearchVisible.value = false
  if (!isSearchVisible.value) {
    selectedState.value = null
    selectedCity.value = null
  }
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
  allCities.value = allCities.value.filter((cty) => !cty.name.toLowerCase().includes('county'))
  isLoading.value = false
}

const routeToLocation = async () => {
  if (selectedState.value && selectedCity.value) {
    isRouting.value = true

    const city = selectedCity.value?.name.replace(/\s+/g, '')
    const state = selectedState.value?.name.replace(/\s+/g, '')
    const locationRoute = city + '_' + state

    await router.push(`/${locationRoute}`)
    isSearchVisible.value = false
    isRouting.value = false
  }
}

const mobileLogout = async () => {
  await userStore.logout()
  isMobileMenuOpen.value = false
}
</script>

<template>
  <div
    class="fixed z-[10] flex text-white justify-center items-center top-0 right-0 mx-auto w-full h-[68px] bg-black"
  >
    <div class="md:hidden z-[20] relative flex items-center justify-between w-full px-4 py-2">
      <AppButton
        class="!text-white dark:!text-gray-200 h-[10px] !bg-transparent !border-none"
        @click="toggleMobileMenu"
      >
        <i class="pi pi-bars !text-2xl"></i>
      </AppButton>

      <div class="flex gap-x-2 pl-[20px] justify-center items-center">
        <h1 class="text-lg text-nowrap font-semibold">
          rate my <span class="text-cyan-500">internet</span>
        </h1>

        <AppButton
          v-if="!isSearchVisible"
          @click="toggleSearch"
          class="p-button-rounded !text-white !pt-[12px] !bg-transparent !border-none w-[5px] h-[5px]"
        >
          <i class="pi pi-search !font-bold !text-[12px]"></i>
        </AppButton>

        <AppButton
          v-else
          @click="toggleSearch"
          class="p-button-rounded !text-white !pt-[12px] !bg-transparent !border-none w-[5px] h-[5px]"
        >
          <i class="pi pi-times !font-bold !text-[12px]"></i>
        </AppButton>
      </div>

      <AppButton
        @click="toggleDarkMode"
        :class="`p-button-rounded p-button-text ${darkMode ? '!bg-yellow-500' : '!bg-gray-400 '}`"
      >
        <i :class="`${darkMode ? 'pi pi-sun' : 'pi pi-moon'} !text-white !font-semibold`"></i>
      </AppButton>

      <div
        v-if="isSearchVisible"
        class="absolute bottom-[-96px] z-[4] right-0 w-full h-[90px] bg-black flex justify-center items-center"
      >
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
          >
          </AppAutocomplete>
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
          >
          </AppAutocomplete>
          <AppButton
            @click="routeToLocation"
            class="p-button-rounded !bg-cyan-500 w-[40px] h-[40px]"
          >
            <i class="pi pi-search text-xl"></i>
          </AppButton>
        </div>
      </div>

      <div
        v-if="isMobileMenuOpen"
        class="md:hidden fixed inset-0 top-[254px] z-40 backdrop-blur-sm bg-black/30"
        @click="isMobileMenuOpen = false"
      ></div>

      <div
        v-if="isMobileMenuOpen"
        class="absolute bottom-[-96px] gap-y-6 z-[4] !text-white right-0 w-full py-[30px] bg-red-400 flex-col flex justify-center items-center"
      >
        <div
          v-if="isMobileMenuOpen"
          class="md:hidden absolute bottom-[-99px] left-0 w-full !bg-white dark:!bg-black shadow-lg"
        >
          <div class="flex flex-col py-[15px]">
            <div class="flex flex-col items-start px-6 gap-y-3">
              <RouterLink
                @click="() => (isMobileMenuOpen = false)"
                class="text-lg font-bold text-center py-2 !text-gray-800 dark:!text-white"
                to="/"
              >
                Home
              </RouterLink>
              <template v-if="userStore.user">
                <RouterLink
                  @click="() => (isMobileMenuOpen = false)"
                  to="/account"
                  class="text-lg font-bold text-center py-2 !text-gray-800 dark:!text-white"
                >
                  {{
                    userStore.user.app_metadata.provider === 'google'
                      ? 'Profile'
                      : userStore.username
                  }}
                </RouterLink>
                <button
                  @click="mobileLogout"
                  class="text-lg cursor-pointer font-bold text-center py-2 !text-gray-800 dark:!text-white"
                >
                  Logout
                </button>
              </template>
              <template v-else>
                <button
                  @click="
                    () => {
                      isMobileMenuOpen = false
                      userStore.isLoginVisible = true
                    }
                  "
                  class="text-lg cursor-pointer font-bold text-center py-2 !text-gray-800 dark:!text-white"
                >
                  Login
                </button>
                <button
                  @click="
                    () => {
                      isMobileMenuOpen = false
                      userStore.isRegisterVisible = true
                    }
                  "
                  class="text-lg cursor-pointer font-bold text-center py-2 !text-gray-800 dark:!text-white"
                >
                  Register
                </button>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-[1280px] hidden w-full h-full px-5 md:flex justify-between items-center">
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
          <RouterLink to="/account">{{
            userStore.user.app_metadata.provider === 'google' ? 'Profile' : userStore.username
          }}</RouterLink>
          <button
            @click="userStore.logout()"
            class="bg-cyan-500 cursor-pointer rounded-[40px] py-1 px-3"
          >
            Logout
          </button>
        </div>
        <div v-else class="flex justify-center items-center gap-x-6">
          <h1 @click="() => (userStore.isLoginVisible = true)" class="cursor-pointer">Login</h1>

          <button
            @click="() => (userStore.isRegisterVisible = true)"
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

  <LoginRegisterModal />
</template>

<style scoped></style>
