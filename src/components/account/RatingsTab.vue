<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabase.ts'
import { useUserStore } from '@/stores/user.ts'
import type { Review } from '@/types/supabaseTables'

const userStore = useUserStore()
const userReviews = ref<Review[]>([])
const isLoading = ref(false)

onMounted(async () => {
  if (!userStore.user?.id) return

  isLoading.value = true
  try {
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select(
        `
        *,
        providers:provider_id (
          name,
          id
        )
      `,
      )
      .eq('user_id', userStore.user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.log("Can't get reviews:", error)
    }
    userReviews.value = reviews ?? []
  } catch (error) {
    console.error('Error fetching reviews:', error)
  } finally {
    isLoading.value = false
  }
})

// Add these to your existing refs
const showDeleteDialog = ref(false)
const reviewToDelete = ref<Review | null>(null)
const isDeleting = ref(false)

const confirmDelete = (review: Review | null) => {
  reviewToDelete.value = review
  showDeleteDialog.value = true
}

const handleDelete = async () => {
  if (!reviewToDelete.value) return

  isDeleting.value = true
  try {
    const { error } = await supabase.from('reviews').delete().eq('id', reviewToDelete.value.id)

    if (error) {
      console.log('Cannot delete review:', error)
    }

    // Remove the review from the local list
    userReviews.value = userReviews.value.filter((review) => review.id !== reviewToDelete.value?.id)

    showDeleteDialog.value = false
  } catch (error) {
    console.error('Error deleting review:', error)
  } finally {
    isDeleting.value = false
    reviewToDelete.value = null
  }
}
</script>

<template>
  <div class="max-w-[1280px] mx-auto">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Reviews</h2>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-8">
      <AppProgressSpinner />
    </div>

    <!-- No Reviews State -->
    <div
      v-else-if="userReviews.length === 0"
      class="text-center py-8 text-gray-500 dark:text-gray-400"
    >
      <i class="pi pi-comments text-4xl mb-4"></i>
      <p>You haven't written any reviews yet.</p>
    </div>

    <!-- Reviews List -->
    <div v-else class="space-y-6">
      <div
        v-for="review in userReviews"
        :key="review.id"
        class="dark:bg-black/20 rounded-lg shadow-sm p-6"
      >
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              <router-link
                :to="`/${review.loc_name}/${review.provider_id}`"
                class="hover:text-[#00b8db] transition-colors"
              >
                {{ review.provider_name ?? 'Provider N/A' }}
              </router-link>
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ new Date(review.created_at).toLocaleDateString() }}
            </p>
          </div>
        </div>

        <!-- Ratings Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div
            v-for="(value, key) in {
              reliability: review.reliability,
              speed: review.speed,
              price: review.price,
              value: review.value,
              setup: review.setup,
              support: review.support,
              transparency: review.transparency,
            }"
            :key="key"
            class="flex items-center gap-2"
          >
            <span class="text-sm text-gray-600 dark:text-gray-300 capitalize">{{ key }}:</span>
            <AppRating :modelValue="value" :cancel="false" :readonly="true" class="custom-rating" />
          </div>
        </div>

        <!-- Review Comment -->
        <p class="text-gray-700 mb-4 dark:text-gray-300 italic">{{ review.comment }}</p>

        <AppDialog
          v-model:visible="showDeleteDialog"
          modal
          header="Confirm Deletion"
          :style="{ width: '350px' }"
        >
          <p class="m-0">
            Are you sure you want to delete this review? This action cannot be undone.
          </p>
          <template #footer>
            <button
              @click="showDeleteDialog = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              @click="handleDelete"
              :disabled="isDeleting"
              class="ml-3 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              <i v-if="isDeleting" class="pi pi-spinner pi-spin mr-2"></i>
              Delete
            </button>
          </template>
        </AppDialog>

        <!-- Update your delete button to use confirmDelete -->
        <button
          @click="confirmDelete(review)"
          class="text-sm cursor-pointer text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors"
        >
          <i class="pi pi-trash mr-1"></i>
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-rating {
  --p-rating-icon-size: 1rem;
  --p-rating-icon-color: #e5e7eb;
  --p-rating-icon-active-color: #00b8db;
  --p-rating-gap: 0.25rem;
}
</style>
