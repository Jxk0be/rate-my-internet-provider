<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { supabase } from '@/supabase.ts'
import type { Provider, Review } from '@/types/supabaseTables'
import AppFooter from '@/components/AppFooter.vue'

const route = useRoute()
const router = useRouter()
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
const expandedReviews = ref<{ [key: number]: boolean }>({})
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

const paginatedReviews = computed(() => {
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
const sequentialTime = computed(() =>
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
  { immediate: true },
)

const calculateOverallRating = (review: Review) => {
  const ratings = [
    review.speed,
    review.price,
    review.value,
    review.setup,
    review.support,
    review.transparency,
    review.reliability,
  ]

  // Filter out null values and calculate average
  const validRatings = ratings.filter((rating): rating is number => rating !== null)

  if (validRatings.length === 0) {
    return null
  }

  const sum = validRatings.reduce((acc, curr) => acc + curr, 0)
  return sum / validRatings.length // Divide by number of non-null ratings
}

const formatLabel = (key: string) => {
  return key.replace('overall_', '').replace('_', ' ')
}

const getRelativeTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (years > 0) return `${years} ${years === 1 ? 'year' : 'years'} ago`
  if (months > 0) return `${months} ${months === 1 ? 'month' : 'months'} ago`
  if (days > 0) return `${days} ${days === 1 ? 'day' : 'days'} ago`
  if (hours > 0) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
  if (minutes > 0) return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`
  return 'just now'
}

const getWordCount = (text: string) => {
  return text.trim().split(/\s+/).length
}

const getFirstWords = (text: string, count: number) => {
  return text.trim().split(/\s+/).slice(0, count).join(' ')
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
</script>

<template>
  <div
    v-if="!isLoading"
    class="max-w-[1280px] provider-view min-h-[75vh] mx-auto sm:px-5 pt-[80px] location-view lg:px-8 pb-8"
  >
    <div
      class="bg-white px-5 dark:bg-gray-800 rounded-lg flex gap-x-3 items-center shadow-sm p-3 mb-6"
    >
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
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
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
            <span class="text-2xl font-semibold text-gray-700 dark:text-gray-300">
              {{ (activeProvider.overall_rating ?? 0).toFixed(1) }}
            </span>
          </div>
        </div>

        <div class="flex items-start mb-6 sm:mb-0">
          <button
            @click="routeToAddReview"
            class="cursor-pointer px-6 py-3 rounded-lg bg-[#00b8db] text-white font-semibold text-base hover:bg-[#00a3c4] transition-colors duration-200 shadow-sm hover:shadow-md active:transform active:scale-95"
          >
            Add Review
          </button>
        </div>
      </div>

      <div class="space-y-4">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Rating Details</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="[key, value] in visibleStats"
            :key="key"
            class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4"
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
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div class="flex flex-col mb-6">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ providerReviews.length }} Customer Reviews
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">Anonymous reviews are welcome</p>
      </div>

      <div class="space-y-6 review-view">
        <template v-if="paginatedReviews.length !== 0">
          <div
            v-for="(review, _idx) in paginatedReviews"
            :key="_idx"
            class="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-6 last:pb-0"
          >
            <div class="flex flex-col gap-x-6 mb-4">
              <h1 class="flex items-center gap-2">
                <i
                  :class="[
                    'pi',
                    review.user_display ? 'pi-verified' : 'pi-user',
                    'text-gray-600 dark:text-gray-400',
                  ]"
                ></i>
                {{ review.user_display ?? 'Anonymous' }}
              </h1>
              <div class="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500">
                <i class="pi pi-clock"></i>
                {{ getRelativeTime(review.created_at) }}
              </div>
            </div>

            <div class="flex items-center gap-3 mb-4">
              <AppRating
                readonly
                :model-value="Math.round(calculateOverallRating(review) ?? 0)"
                :cancel="false"
                class="custom-rating"
              />
              <span class="text-sm text-gray-600 dark:text-gray-400">
                {{ (calculateOverallRating(review) ?? 0).toFixed(1) }}
              </span>
            </div>
            <div class="text-gray-700 dark:text-gray-300">
              <p v-if="!expandedReviews[_idx] && getWordCount(review.comment) > 40">
                {{ getFirstWords(review.comment, 40) }}...
                <button
                  @click="expandedReviews[_idx] = true"
                  class="ml-1 text-blue-500 cursor-pointer hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                >
                  Read more
                </button>
              </p>
              <p class="preserved-text" v-else>
                {{ review.comment }}
                <button
                  v-if="getWordCount(review.comment) > 40"
                  @click="expandedReviews[_idx] = false"
                  class="ml-1 text-blue-500 cursor-pointer hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                >
                  Show less
                </button>
              </p>
            </div>
          </div>
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

.preserved-text {
  white-space: pre-wrap; /* Preserves line breaks and spaces */
  word-wrap: break-word; /* Ensures long words don't overflow */
}
</style>
