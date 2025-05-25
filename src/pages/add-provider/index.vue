<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user.ts'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
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
        class="flex text-nowrap items-center gap-x-2 text-lg font-semibold text-gray-900 dark:text-white capitalize"
      >
        Add Provider
      </div>
    </div>

    <!-- Authentication check -->
    <div v-if="!userStore.user" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div class="text-center">
        <i class="pi pi-lock text-4xl text-gray-400 mb-4"></i>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Login Required</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          To maintain quality and prevent misuse, provider submissions require authentication.
          Please sign in to continue.
        </p>

        <button
          class="cursor-pointer px-4 py-2 rounded-lg bg-[#00b8db] text-white font-semibold text-base hover:bg-[#00a3c4] transition-colors duration-200 shadow-sm hover:shadow-md active:transform active:scale-95"
          @click="() => (userStore.isLoginVisible = true)"
        >
          Sign In
        </button>
      </div>
    </div>
  </div>
</template>
