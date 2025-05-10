import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { State, City } from '@/types/countryStateCity'
export const useCountryStateCityAPI = defineStore('countryStateCityAPI', () => {
  const states = ref<State[]>([])

  const loadAllStates = async () => {
    if (states.value.length === 0) {
      const headers = new Headers()
      headers.append('X-CSCAPI-KEY', import.meta.env.VITE_COUNTRY_STATE_API_KEY)

      const requestOptions: RequestInit = {
        method: 'GET',
        headers: headers,
        redirect: 'follow',
      }

      const response = await fetch(
        'https://api.countrystatecity.in/v1/countries/US/states',
        requestOptions,
      )

      states.value = await response.json()
      states.value = states.value.filter((st) => st.iso2.length < 3)
    }
    return states.value
  }

  return { loadAllStates }
})
