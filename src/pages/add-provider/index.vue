<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user.ts'
import { ref, watch } from 'vue'
import { supabase } from '@/supabase.ts'
import { Filter } from 'bad-words'
import type { Provider } from '@/types/supabaseTables'
import { PostgrestError } from '@supabase/supabase-js'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const previousLocation = route.query.from
const locationId = route.query.locationId
const locationName = route.query.locationName
const providerName = ref('')
const isSaving = ref(false)
const filter = new Filter()
const sanitizedProviderName = ref('')

watch(
  () => providerName.value,
  (newValue) => {
    try {
      // Replace bad words with asterisks
      sanitizedProviderName.value = filter.clean(newValue)

      // If the cleaned version is different, update the input
      if (sanitizedProviderName.value !== newValue) {
        providerName.value = sanitizedProviderName.value
      }
    } catch (error) {
      console.error('Error filtering text:', error)
    }
  },
)

const saveProvider = async () => {
  if (
    !providerName.value ||
    !locationId ||
    !providerName.value ||
    !userStore.user ||
    providerName.value.includes('*')
  )
    return

  isSaving.value = true

  const { data: newProvider, error }: { data: Provider | null; error: PostgrestError | null } =
    await supabase
      .from('providers')
      .insert([{ name: providerName.value, location_id: locationId, user_id: userStore.user.id }])
      .select()
      .single()

  if (error) {
    console.log('Cannot add Provider', error)
    return
  }

  isSaving.value = false
  if (newProvider) await router.push(`/${previousLocation}/${newProvider?.id}`)
  else await router.push(`/${previousLocation}`)
}

const routeToPreviousLocation = async () => {
  await router.push({
    path: `/${previousLocation}`,
    query: { from: 'search' },
  })
}
</script>

<template>
  <div v-if="!isSaving" class="max-w-[1280px] mx-auto sm:px-5 pt-[80px] location-view lg:px-8 pb-8">
    <div class="w-full dark:bg-black/20 rounded-lg flex gap-x-3 items-center shadow-sm p-3 mb-6">
      <div
        class="flex items-center gap-x-2 text-lg font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer transition-colors duration-200"
      >
        <i class="pi pi-map-marker"></i>
        <h1 @click="async () => await router.push(`/${previousLocation}`)">{{ locationName }}</h1>
      </div>

      <span class="text-lg text-gray-400">/</span>
      <div
        class="flex text-nowrap items-center gap-x-2 text-lg font-semibold text-gray-900 dark:text-white capitalize"
      >
        Add Provider
      </div>
    </div>

    <!-- Authentication check -->
    <div v-if="!userStore.user" class="dark:bg-black/20 rounded-lg shadow-sm p-6">
      <div class="text-center">
        <i class="pi pi-lock text-4xl text-gray-400 mb-4"></i>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Login Required</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          To maintain quality and prevent misuse, provider submissions require authentication.
          Please sign in to continue.
        </p>

        <button
          class="cursor-pointer px-4 py-2 rounded-lg bg-[#00b8db] text-white font-semibold text-base hover:bg-[#00a3c4] transition-colors duration-200 shadow-sm hover:shadow-md active:transform active:scale-95"
          @click="() => (userStore.isLoginVisible = true)"
        >
          Sign In
        </button>
      </div>
    </div>

    <form v-else @submit.prevent="saveProvider" class="dark:bg-black/20 rounded-lg shadow-sm p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Provider Name
          </label>
          <AppInputText
            :maxlength="35"
            v-model="providerName"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Enter provider name"
          />
        </div>
      </div>

      <div class="mt-6 flex justify-end space-x-4">
        <button
          type="button"
          class="px-4 cursor-pointer py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          @click="routeToPreviousLocation"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="cursor-pointer px-4 py-2 rounded-lg bg-[#00b8db] text-white font-semibold text-base hover:bg-[#00a3c4] transition-colors duration-200 shadow-sm hover:shadow-md active:transform active:scale-95"
          :disabled="isSaving"
        >
          <i v-if="isSaving" class="pi pi-spinner animate-spin mr-2"></i>
          {{ isSaving ? 'Saving...' : 'Save Provider' }}
        </button>
      </div>
    </form>
  </div>

  <div
    v-else
    class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-20 flex items-center justify-center"
  >
    <AppProgressSpinner />
  </div>
</template>
