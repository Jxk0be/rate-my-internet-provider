<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { supabase } from '@/supabase.ts'
import type { Provider, Review } from '@/types/supabaseTables'
import AppFooter from '@/components/AppFooter.vue'
import CustomerReview from '@/components/shared/CustomerReview.vue'
import { useToast } from 'primevue'
import { useUserStore } from '@/stores/user.ts'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const userStore = useUserStore()
const isLoading = ref(false)
const activeProvider = ref<Provider>({
  id: -1,
  location_id: -1,
  name: '',
  overall_rating: null,
  overall_speed: null,
  overall_price: null,
  overall_value: null,
  overall_setup: null,
  overall_support: null,
  overall_transparency: null,
  overall_reliability: null,
  total_reviews: null,
})
const providerReviews = ref<Review[]>([])
const location = ref('')
const showAllRatings = ref(false)
const isSmallScreen = ref(false)
let checkScreenSize = () => {}

const first = ref(0)
const statIcons = {
  speed: 'pi-bolt',
  price: 'pi-dollar',
  value: 'pi-face-smile',
  setup: 'pi-wrench',
  reliability: 'pi-check-circle',
  support: 'pi-headphones',
  transparency: 'pi-circle',
} as const

const paginatedReviews = computed((): Review[] => {
  return sequentialTime.value.slice(first.value, first.value + 8)
})
const visibleStats = computed(() => {
  const entries = Object.entries(statsData.value)
  return !isSmallScreen.value || showAllRatings.value ? entries : entries.slice(0, 3)
})
const providerId = computed(() => route.params.provider)
const locationName = computed(() => {
  if (!location.value) return ''

  const [cityPart, state] = location.value.split('_')
  const city = cityPart.replace(/([A-Z])/g, ' $1').trim()

  return `${city}, ${state}`
})
const statsData = computed(() => ({
  speed: activeProvider.value.overall_speed,
  price: activeProvider.value.overall_price,
  value: activeProvider.value.overall_value,
  setup: activeProvider.value.overall_setup,
  support: activeProvider.value.overall_support,
  transparency: activeProvider.value.overall_transparency,
  reliability: activeProvider.value.overall_reliability,
}))
const sequentialTime = computed((): Review[] =>
  [...providerReviews.value].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  ),
)

onMounted(() => {
  checkScreenSize = () => {
    isSmallScreen.value = window.innerWidth < 640 // sm breakpoint
  }

  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})
onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})

watch(
  () => providerId,
  async () => {
    isLoading.value = true
    const { data: provider, error } = await supabase
      .from('providers')
      .select('*') // you can specify specific columns if needed
      .eq('id', Number(providerId.value))

    if (error) {
      console.error('Error fetching providers:', error)
      isLoading.value = false
      return
    }

    const sbProvider = provider?.[0]
    if (sbProvider) {
      activeProvider.value = sbProvider
      const { data: data } = await supabase
        .from('locations')
        .select('location')
        .eq('id', activeProvider.value.location_id)

      const sbLocation = data?.[0]
      if (sbLocation) location.value = sbLocation.location

      const { data: reviews, error: reviewError } = await supabase
        .from('reviews')
        .select('*') // you can specify specific columns if needed
        .eq('provider_id', activeProvider.value.id)

      if (reviewError) {
        console.error('Error fetching providers:', error)
        isLoading.value = false
        return
      }
      providerReviews.value = reviews
    }
    isLoading.value = false
  },
  { immediate: true, flush: 'post' }, // flush: 'post' makes the DOM updates be awaited (sorta)
)

const formatLabel = (key: string) => {
  return key.replace('overall_', '').replace('_', ' ')
}

const getIconForStat = (key: string): string => {
  return statIcons[key as keyof typeof statIcons] || 'pi-circle' // fallback icon
}

const routeToAddReview = async () => {
  await router.push({
    path: `/${location.value}/${providerId.value}/add-review`,
    query: {
      providerName: activeProvider.value.name,
      previousLocation: route.params.location,
    },
  })
}

const favoriteProvider = async () => {
  if (!userStore.user?.id) return

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

  const currentFavorites = userData?.favorite_locations || []

  if (currentFavorites.includes(Number(providerId.value))) {
    toast.add({
      severity: 'info',
      summary: 'Info',
      detail: `${activeProvider.value.name} already favorited`,
      life: 4000,
    })
    return
  }

  const updatedFavorites = [...(userData?.favorite_locations || []), Number(providerId.value)]

  const { error } = await supabase
    .from('public_users')
    .update({ favorite_locations: updatedFavorites })
    .eq('user_id', userStore.user.id)
    .select()

  if (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: `Could not favorite ${activeProvider.value.name}`,
      life: 4000,
    })
    return
  }

  toast.add({
    severity: 'success',
    summary: 'Success',
    detail: `${activeProvider.value.name} added to favorites!`,
    life: 4000,
  })
}
</script>

<template>
  <div
    v-if="!isLoading"
    class="max-w-[1280px] provider-view min-h-[75vh] mx-auto sm:px-5 pt-[80px] location-view lg:px-8 pb-8"
  >
    <div class="px-5 dark:bg-black/20 rounded-lg flex gap-x-3 items-center shadow-sm p-3 mb-6">
      <div
        class="flex items-center gap-x-2 text-lg font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer transition-colors duration-200"
      >
        <i class="pi pi-map-marker"></i>
        <h1>
          <router-link
            :to="{
              path: `/${route.params.location}`,
              query: {
                from: 'search',
              },
            }"
            >{{ locationName }}</router-link
          >
        </h1>
      </div>

      <span class="text-lg text-gray-400">/</span>
      <h1 class="text-lg font-semibold text-gray-900 dark:text-white capitalize">
        {{ activeProvider.name }}
      </h1>
    </div>
    <!-- Header Section -->
    <div class="dark:bg-black/20 rounded-lg shadow-sm p-6 mb-6">
      <div class="w-full justify-between flex sm:flex-row flex-col">
        <div>
          <h1 class="font-bold text-3xl text-gray-900 dark:text-white capitalize mb-2">
            {{ activeProvider.name }}
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-300 mb-4">{{ locationName }}</p>

          <!-- Overall Rating -->
          <div class="flex items-center gap-3 mb-6">
            <AppRating
              readonly
              :model-value="Math.round(activeProvider.overall_rating ?? 0)"
              :cancel="false"
              class="custom-rating"
            />
            <span class="text-lg font-bold text-gray-500 dark:text-gray-300">
              <span class="text-3xl text-black dark:text-white">{{
                (activeProvider.overall_rating ?? 0).toFixed(1)
              }}</span>
              / 5
            </span>
          </div>
        </div>

        <div class="flex items-start mb-6 gap-4 sm:mb-0">
          <button
            @click="routeToAddReview"
            class="cursor-pointer px-6 py-3 rounded-lg bg-[#00b8db] text-white font-semibold text-base hover:bg-[#00a3c4] transition-colors duration-200 shadow-sm hover:shadow-md active:transform active:scale-95"
          >
            Add Rating
          </button>

          <button
            v-if="userStore.user"
            @click="favoriteProvider"
            class="cursor-pointer px-6 py-3 rounded-lg bg-amber-400 text-white font-semibold text-base hover:bg-amber-500 transition-colors duration-200 shadow-sm hover:shadow-md active:transform active:scale-95 flex items-center gap-2"
          >
            <i class="pi pi-star"></i>
            Favorite
          </button>
        </div>
      </div>

      <div class="space-y-4">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Rating Details</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="[key, value] in visibleStats"
            :key="key"
            class="dark:bg-gray-700/20 bg-gray-100/60 rounded-lg p-4"
          >
            <div class="flex items-center justify-between">
              <span
                class="text-sm font-medium gap-x-2 flex items-center text-gray-600 dark:text-gray-300 capitalize"
              >
                <i :class="['pi', getIconForStat(key)]"></i>
                {{ formatLabel(key) }}
              </span>
              <div class="flex items-center gap-2">
                <i class="pi pi-star-fill text-[#00b8db]"></i>
                <span class="font-semibold text-gray-900 dark:text-white">
                  {{ value?.toFixed(1) ?? 'N/A' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Read More Button - Only visible on mobile -->
        <button
          v-if="isSmallScreen && Object.keys(statsData).length > 3"
          @click="showAllRatings = !showAllRatings"
          class="mt-2 text-[#00b8db] hover:text-[#009bb8] text-sm font-medium focus:outline-none transition-colors duration-200 flex items-center gap-1"
        >
          {{ showAllRatings ? 'Show Less' : 'Show All Ratings' }}
          <i
            :class="['pi', showAllRatings ? 'pi-chevron-up' : 'pi-chevron-down']"
            class="text-xs"
          ></i>
        </button>
      </div>
    </div>

    <!-- Reviews Section -->
    <div class="dark:bg-black/20 rounded-lg shadow-sm p-6">
      <div class="flex flex-col mb-6">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ providerReviews.length }} Customer Reviews
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">Anonymous reviews are welcome</p>
      </div>

      <div class="space-y-6 review-view">
        <template v-if="paginatedReviews.length !== 0">
          <template v-for="(review, idx) in paginatedReviews" :key="idx">
            <CustomerReview :review="review" :index="idx" />
          </template>
          <AppPaginator
            v-if="sequentialTime.length > 8"
            :rows="8"
            :total-records="sequentialTime.length"
            v-model:first="first"
            class="mt-4"
            template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown"
          />
        </template>
      </div>
    </div>
  </div>

  <!-- Loading State -->
  <div
    v-else
    class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-20 flex items-center justify-center"
  >
    <AppProgressSpinner />
  </div>
  <AppToast />
  <AppFooter />
</template>

<style>
.provider-view {
  .custom-rating {
    --p-rating-icon-size: 1.25rem;
    --p-rating-icon-color: #e5e7eb;
    --p-rating-icon-active-color: #00b8db;
    --p-rating-gap: 0.25rem;
  }
}

.review-view {
  .custom-rating {
    --p-rating-icon-size: 1rem;
    --p-rating-icon-color: #e5e7eb;
    --p-rating-icon-active-color: #00b8db;
    --p-rating-gap: 0.25rem;
  }
}

@media (min-width: 640px) {
  .provider-view .custom-rating {
    --p-rating-icon-size: 1.5rem;
  }
  .review-view .custom-rating {
    --p-rating-icon-size: 1rem;
  }
}

@media (max-width: 640px) {
  .p-toast {
    width: 90vw !important;
    right: 5vw !important;
  }
}
</style>
