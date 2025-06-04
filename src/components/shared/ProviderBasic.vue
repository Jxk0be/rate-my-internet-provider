<script setup lang="ts">

const props = defineProps<{
  provider: any;
}>();

import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const routeToProvider = async (provider_id: number) => {
  if (provider_id) {
    await router.push(`${route.path}/${provider_id}`)
  }
}

</script>

<template>
  <div
    @click="() => routeToProvider(props.provider.id)"
    class="w-full cursor-pointer flex flex-col justify-center border-b border-gray-200 dark:border-gray-700 last:border-0 last:pb-0 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors duration-200"
  >
    <div class="flex gap-x-2 items-center">
      <h1 class="font-bold mb-1 text-xl capitalize text-gray-900 dark:text-white">
        {{ props.provider.name }}
      </h1>
      <h1 class="text-sm text-gray-500 dark:text-gray-400">
        ({{ props.provider.total_reviews }} reviews)
      </h1>
    </div>
    <div class="flex items-center gap-2">
      <AppRating
        readonly
        :model-value="Math.round(props.provider.overall_rating ?? 0)"
        :cancel="false"
        class="custom-rating"
      />
      <span class="text-sm text-gray-600 dark:text-gray-400">
                ({{ (props.provider.overall_rating ?? 0).toFixed(1) }})
              </span>
    </div>
  </div>
</template>

<style>

.custom-rating {
  --p-rating-icon-size: 1.25rem;
  --p-rating-icon-color: #e5e7eb;
  --p-rating-icon-active-color: #00b8db;
  --p-rating-gap: 0.25rem;
}


@media (min-width: 640px) {
  .custom-rating {
    --p-rating-icon-size: 1.5rem;
  }
}
</style>
