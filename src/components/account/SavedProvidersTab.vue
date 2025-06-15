<script setup lang="ts">
import { supabase } from '@/supabase.ts'
import { useUserStore } from '@/stores/user.ts'
import { useToast } from 'primevue'
import { onMounted, ref } from 'vue'
import type { Provider } from '@/types/supabaseTables'
import { PostgrestError } from '@supabase/supabase-js'

interface SavedProvider {
  name: string
  loc: string | null
}

const userStore = useUserStore()
const toast = useToast()
const isLoading = ref(false)
const currentFavorites = ref([])
const savedProvidersUI = ref<SavedProvider[]>([])

onMounted(async () => {
  if (!userStore.user?.id) return

  isLoading.value = true

  try {
    const { data: userData, error: fetchError } = await supabase
      .from('public_users')
      .select('favorite_locations')
      .eq('user_id', userStore.user.id)
      .single()

    if (fetchError) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: `Could not fetch user, login and try again`,
        life: 4000,
      })
      return
    }
    currentFavorites.value = userData?.favorite_locations || []

    const {
      data: savedProviders,
      error,
    }: { data: Provider[] | null; error: PostgrestError | null } = await supabase
      .from('providers')
      .select('*')
      .in('id', currentFavorites.value)

    if (error) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: `Could not find providers, try again at a later point`,
        life: 4000,
      })
      return
    }

    savedProvidersUI.value =
      savedProviders?.map((prov) => {
        return {
          name: prov.name,
          loc: formatLocationName(prov.associatedLocation) || '',
        }
      }) || []
  } catch (error) {
    console.error('Error fetching reviews:', error)
  } finally {
    isLoading.value = false
  }
})

const formatLocationName = (loc: string | null) => {
  if (!loc) return
  const [cityPart, state] = loc.toString().split('_')
  const city = cityPart.replace(/([A-Z])/g, ' $1').trim()
  return `${city}, ${state}`
}
</script>

<template>
  <div class="max-w-[1280px] mx-auto">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Saved Providers</h2>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-8">
      <AppProgressSpinner />
    </div>

    <!-- No Reviews State -->
    <div
      v-else-if="savedProvidersUI.length === 0"
      class="text-center py-8 text-gray-500 dark:text-gray-400"
    >
      <i class="pi pi-star text-4xl mb-4"></i>
      <p>You don't have any saved providers.</p>
    </div>

    <!-- Reviews List -->
    <div v-else class="space-y-6">
      <div
        v-for="(provider, _idx) in savedProvidersUI"
        :key="_idx"
        class="dark:bg-black/20 rounded-lg shadow-sm p-6"
      >
        <h1>{{ provider.loc }} | {{ provider.name }}</h1>
      </div>
    </div>

    <AppToast />
  </div>
</template>
