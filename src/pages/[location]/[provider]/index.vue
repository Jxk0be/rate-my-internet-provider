<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed, ref, watch } from 'vue'
import { supabase } from '@/supabase.ts'
import type { Provider, Review } from '@/types/supabaseTables'

const route = useRoute()
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

const providerId = computed(() => route.params.provider)
const locationName = computed(() => {
  if (!location.value) return ''

  const [cityPart, state] = location.value.split('_')
  const city = cityPart.replace(/([A-Z])/g, ' $1').trim()

  return `${city}, ${state}`
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
</script>

<template>
  <div v-if="!isLoading" class="provider-view flex w-full flex-col py-2">
    <h1 class="font-bold text-3xl capitalize">{{ activeProvider.name }}</h1>
    <h1 class="text-xl mb-1">{{ locationName }}</h1>
    <div class="flex items-center gap-2 mb-6">
      <AppRating
        readonly
        :model-value="Math.round(activeProvider.overall_rating ?? 0)"
        :cancel="false"
        class="custom-rating"
      />
      <span class="text-lg text-gray-700"
        >({{ (activeProvider.overall_rating ?? 0).toFixed(1) }})</span
      >
    </div>

    <h1 class="font-bold text-2xl capitalize">
      Browse {{ providerReviews.length }} Customer Reviews
    </h1>

    <h1 class="text-sm text-gray-600 mb-4">Anonymous reviews are welcome.</h1>
    <template v-if="providerReviews.length !== 0">
      <div class="w-full flex flex-col gap-y-2 justify-center items-start">
        <template v-for="(review, _idx) in providerReviews" :key="_idx">
          <div class="flex border-b-1 border-slate-200 py-2 gap-y-1 flex-col justify-center w-full">
            <div class="flex items-center mb-2 gap-x-2">
              <AppRating
                readonly
                :model-value="Math.round(calculateOverallRating(review) ?? 0)"
                :cancel="false"
                class="custom-rating"
              />
              <span class="text-sm text-gray-600"
                >({{ (calculateOverallRating(review) ?? 0).toFixed(1) }})</span
              >
            </div>

            <div
              class="w-full mb-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2 rounded-md"
            >
              <div class="flex items-center gap-2">
                <h1 class="text-sm md:text-base font-semibold">Speed:</h1>
                <h1 class="text-sm md:text-base">{{ review.speed }} / 5</h1>
              </div>

              <div class="flex items-center gap-2">
                <h1 class="text-sm md:text-base font-semibold">Price:</h1>
                <h1 class="text-sm md:text-base">{{ review.price }} / 5</h1>
              </div>

              <div class="flex items-center gap-2">
                <h1 class="text-sm md:text-base font-semibold">Value:</h1>
                <h1 class="text-sm md:text-base">{{ review.value }} / 5</h1>
              </div>

              <div class="flex items-center gap-2">
                <h1 class="text-sm md:text-base font-semibold">Setup:</h1>
                <h1 class="text-sm md:text-base">{{ review.setup }} / 5</h1>
              </div>

              <div class="flex items-center gap-2">
                <h1 class="text-sm md:text-base font-semibold">Support:</h1>
                <h1 class="text-sm md:text-base">{{ review.support }} / 5</h1>
              </div>

              <div class="flex items-center gap-2">
                <h1 class="text-sm md:text-base font-semibold">Transparency:</h1>
                <h1 class="text-sm md:text-base">{{ review.transparency }} / 5</h1>
              </div>

              <div class="flex items-center gap-2">
                <h1 class="text-sm md:text-base font-semibold">Reliability:</h1>
                <h1 class="text-sm md:text-base">{{ review.reliability }} / 5</h1>
              </div>
            </div>

            <div class="w-full text-sm md:text-base">
              {{ review.comment }}
            </div>
          </div>
        </template>
      </div>
    </template>
  </div>

  <div
    v-else
    class="fixed inset-0 bg-black/30 backdrop-blur-sm z-20 flex items-center justify-center"
  >
    <AppProgressSpinner />
  </div>
</template>

<style>
.provider-view {
  .custom-rating {
    --p-rating-icon-size: 1.5rem;
    --p-rating-icon-color: #d1d5db; /* Color for inactive stars */
    --p-rating-icon-active-color: #00b8db; /* Color for active stars */
    --p-rating-gap: 0.25rem; /* Space between stars */
  }
}
</style>
