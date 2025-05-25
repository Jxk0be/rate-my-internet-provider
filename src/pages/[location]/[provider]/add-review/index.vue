<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed, ref } from 'vue'

const route = useRoute()
const router = useRouter()
const reviewData = ref({
  reliability: null,
  speed: null,
  price: null,
  value: null,
  setup: null,
  support: null,
  transparency: null,
  comment: '',
  isAnonymous: false,
})
const isSaving = ref(false)
const provider = computed(() => route.params.provider)
const providerName = computed(() => route.query.providerName)
const pastLocation = computed(() => route.query.previousLocation)

const saveReview = async () => {
  console.log(reviewData.value)
  if (
    !reviewData.value.value ||
    !reviewData.value.reliability ||
    !reviewData.value.speed ||
    !reviewData.value.price ||
    !reviewData.value.setup ||
    !reviewData.value.support ||
    !reviewData.value.transparency ||
    reviewData.value.comment === ''
  )
    return

  isSaving.value = true
  console.log(reviewData.value)

  isSaving.value = false
  await router.push(`/${pastLocation.value}/${provider.value}`)
}
</script>

<template>
  <div class="max-w-7xl add-review-view mx-auto lg:px-8 pb-8">
    <div
      class="bg-white w-full dark:bg-gray-800 rounded-lg flex gap-x-3 items-center shadow-sm p-3 mb-6"
    >
      <div
        class="flex items-center gap-x-2 text-lg font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer transition-colors duration-200"
      >
        <i class="pi pi-wifi"></i>
        <h1
          class="capitalize"
          @click="async () => await router.push(`/${pastLocation}/${provider}`)"
        >
          {{ providerName }}
        </h1>
      </div>

      <span class="text-lg text-gray-400">/</span>
      <div
        class="flex items-center gap-x-2 text-lg font-semibold text-gray-900 dark:text-white capitalize"
      >
        Add Review
      </div>
    </div>

    <!-- Review Form -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Rate Your Experience</h2>

      <form @submit.prevent="saveReview" class="space-y-6">
        <!-- Rating Fields -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="field in [
              'reliability',
              'speed',
              'price',
              'value',
              'setup',
              'support',
              'transparency',
            ]"
            :key="field"
            class="space-y-2"
          >
            <label
              :for="field"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize"
            >
              {{ field }}
            </label>
            <AppRating
              v-model="(reviewData as any)[field]"
              :id="field"
              :cancel="false"
              class="custom-rating"
            />
          </div>
        </div>

        <!-- Comment Field -->
        <div class="space-y-2">
          <label for="comment" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Your Review
          </label>
          <AppTextarea
            v-model="reviewData.comment"
            id="comment"
            rows="4"
            class="w-full"
            placeholder="Share your experience..."
          />
        </div>

        <!-- Anonymous Checkbox -->
        <div class="flex items-center">
          <input
            type="checkbox"
            v-model="reviewData.isAnonymous"
            class="w-6 rounded-md mr-2 h-6 border-2 border-gray-300 appearance-none checked:bg-[#00b8db] hover:border-[#00b8db] cursor-pointer focus:ring-0 relative before:content-['✓'] before:hidden checked:before:block before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:text-white"
          />

          <label for="anonymous" class="text-sm text-gray-700 dark:text-gray-300">
            Post as anonymous
          </label>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end">
          <button
            type="submit"
            :disabled="isSaving"
            class="px-6 cursor-pointer py-3 rounded-lg bg-[#00b8db] text-white font-semibold text-base hover:bg-[#00a3c4] transition-colors duration-200 shadow-sm hover:shadow-md active:transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i v-if="isSaving" class="pi pi-spinner pi-spin mr-2"></i>
            {{ isSaving ? 'Submitting...' : 'Submit Review' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style>
.add-review-view {
  .custom-rating {
    --p-rating-icon-size: 1.5rem;
    --p-rating-icon-color: #e5e7eb;
    --p-rating-icon-active-color: #00b8db;
    --p-rating-gap: 0.25rem;
  }

  [data-pc-section='officon']:hover {
    color: #00b8db !important;
  }

  [data-pc-section='onicon']:hover {
    color: #00b8db !important;
  }

  [data-pc-section='officon'] {
    color: #00b8db !important;
  }

  [data-pc-section='onicon'] {
    color: #00b8db !important;
  }

  [data-pc-name='textarea']:focus {
    outline: none !important;
    border-color: #00b8db !important;
  }
}
</style>
