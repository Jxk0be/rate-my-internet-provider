<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const previousLocation = route.query.from
const locationName = route.query.locationName
</script>

<template>
  <div class="max-w-7xl location-view mx-auto lg:px-8 pb-8">
    <div
      class="bg-white w-full dark:bg-gray-800 rounded-lg flex gap-x-3 items-center shadow-sm p-3 mb-6"
    >
      <div
        class="flex items-center gap-x-2 text-lg font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer transition-colors duration-200"
      >
        <i class="pi pi-map-marker"></i>
        <h1 @click="async () => await router.push(`/${previousLocation}`)">{{ locationName }}</h1>
      </div>

      <span class="text-lg text-gray-400">/</span>
      <div
        class="flex items-center gap-x-2 text-lg font-semibold text-gray-900 dark:text-white capitalize"
      >
        Add Provider
      </div>
    </div>
  </div>
</template>
