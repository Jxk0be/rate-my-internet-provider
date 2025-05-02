<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppNavbar from '@/components/AppNavbar.vue'

const testing = () => {
  document.documentElement.classList.toggle('my-app-dark')
}
</script>

<template>
  <div class="w-full h-[100vh] flex justify-center">
    <AppNavbar />
    <div class="max-w-[1280px] pt-[78px] px-5 w-full">
      <AppButton @click="testing" label="Theme Switcher Test" />
      <RouterView />
    </div>
  </div>
</template>
