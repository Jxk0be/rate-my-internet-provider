<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed, ref } from 'vue'
import { useUserStore } from '@/stores/user.ts'
import { supabase } from '@/supabase.ts'
import { Filter } from 'bad-words'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
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
const statIcons = {
  speed: 'pi-bolt',
  price: 'pi-dollar',
  value: 'pi-face-smile',
  setup: 'pi-wrench',
  reliability: 'pi-check-circle',
  support: 'pi-headphones',
  transparency: 'pi-circle',
} as const
const categoryExplanations = {
  reliability: 'How dependable is the service? Rate the uptime and consistency of performance.',
  speed: 'How fast are the connection speeds? Consider both download and upload speeds.',
  price: 'How reasonable is the pricing compared to similar services and features offered?',
  value: 'How good is the overall value for money, considering all features and service quality?',
  setup: 'How smooth was the installation and initial setup process?',
  support: 'How helpful and responsive is their customer support team?',
  transparency: 'How clear and honest are they about their services, pricing, and policies?',
} as const

const filter = new Filter()
const sanitizedComment = ref('')

const provider = computed(() => route.params.provider)
const providerName = computed(() => route.query.providerName)
const pastLocation = computed(() => route.query.previousLocation)

const saveReview = async () => {
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

  try {
    sanitizedComment.value = filter.clean(reviewData.value.comment)

    if (sanitizedComment.value !== reviewData.value.comment) {
      reviewData.value.comment = sanitizedComment.value
    }
  } catch (error) {
    console.error('Error filtering text:', error)
  }

  const { error: error } = await supabase
    .from('reviews')
    .insert([
      {
        provider_id: provider.value,
        provider_name: providerName.value,
        comment: reviewData.value.comment,
        user_id: userStore.user?.id ?? null,
        loc_name: pastLocation.value ?? null,
        reliability: reviewData.value.reliability,
        speed: reviewData.value.speed,
        price: reviewData.value.price,
        value: reviewData.value.value,
        setup: reviewData.value.setup,
        support: reviewData.value.support,
        transparency: reviewData.value.transparency,
        user_display: reviewData.value.isAnonymous
          ? null
          : (userStore.user?.user_metadata?.name ?? userStore.user?.user_metadata?.username),
      },
    ])
    .select()
    .single()

  if (error) {
    console.log('Adding review error:', error)
    return
  }

  isSaving.value = false
  await router.push(`/${pastLocation.value}/${provider.value}`)
}
</script>

<template>
  <div class="add-review-view max-w-[1280px] mx-auto sm:px-5 pt-[80px] location-view lg:px-8 pb-8">
    <div
      class="px-5 w-full dark:bg-black/20 rounded-lg flex gap-x-3 items-center shadow-sm p-3 mb-6"
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
    <div class="dark:bg-black/20 rounded-lg shadow-sm p-6">
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
              class="block text-sm font-medium text-gray-700 dark:text-white capitalize flex items-center gap-x-2"
            >
              <i :class="`pi ${statIcons[field as keyof typeof statIcons]}`"></i>
              {{ field }}
            </label>

            <AppRating
              v-model="(reviewData as any)[field]"
              :id="field"
              :cancel="false"
              class="custom-rating"
            />

            <p class="text-xs text-gray-500 dark:text-gray-400 italic">
              {{ categoryExplanations[field as keyof typeof categoryExplanations] }}
            </p>
          </div>
        </div>

        <div class="space-y-2">
          <label for="comment" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Your Review
          </label>
          <AppTextarea
            :maxlength="3000"
            v-model="reviewData.comment"
            id="comment"
            rows="4"
            class="w-full"
            placeholder="Share your experience..."
          />
          <div class="text-sm text-gray-500 dark:text-gray-400 text-right">
            {{ 3000 - reviewData.comment.length }} characters remaining
          </div>
        </div>

        <!-- Anonymous Checkbox -->
        <div v-if="userStore.user" class="flex items-center">
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
    border-color: #00b8db !important;
  }

  [data-pc-section='onicon']:hover {
    color: #00b8db !important;
    border-color: #00b8db !important;
  }

  [data-pc-section='officon'] {
    color: #00b8db !important;
    border-color: #00b8db !important;
  }

  [data-pc-section='onicon'] {
    color: #00b8db !important;
    border-color: #00b8db !important;
  }

  [data-pc-name='textarea']:focus {
    outline: none !important;
    border-color: #00b8db !important;
  }
}
</style>
