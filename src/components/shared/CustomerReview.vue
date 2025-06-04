<script lang="ts" setup>
import type {  Review } from '@/types/supabaseTables'
import { ref } from 'vue'


const props = defineProps<{
  review: Review;
  index: number;
}>();
const expandedReviews = ref<{ [key: number]: boolean }>({})

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
</script>

<template>
  <div class="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-6 last:pb-0">
    <div class="flex flex-col gap-x-6 mb-4">
      <h1 class="flex items-center gap-2">
        <i
          :class="[
                      'pi',
                      props.review.user_display ? 'pi-verified' : 'pi-user',
                      'text-gray-600 dark:text-gray-400',
                    ]"
        ></i>
        {{ props.review.user_display ?? 'Anonymous' }}
      </h1>
      <div class="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500">
        <i class="pi pi-clock"></i>
        {{ getRelativeTime(props.review.created_at) }}
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
      <p v-if="!expandedReviews[props.index] && getWordCount(props.review.comment) > 40">
        {{ getFirstWords(props.review.comment, 40) }}...
        <button
          @click="expandedReviews[props.index] = true"
          class="ml-1 text-blue-500 cursor-pointer hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
        >
          Read more
        </button>
      </p>
      <p class="preserved-text" v-else>
        {{ props.review.comment }}
        <button
          v-if="getWordCount(props.review.comment) > 40"
          @click="expandedReviews[props.index] = false"
          class="ml-1 text-blue-500 cursor-pointer hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
        >
          Show less
        </button>
      </p>
    </div>
  </div>

</template>

<style>
.preserved-text {
  white-space: pre-wrap; /* Preserves line breaks and spaces */
  word-wrap: break-word; /* Ensures long words don't overflow */
}
</style>
