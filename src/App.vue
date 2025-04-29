<script setup lang="ts">
import { RouterView } from 'vue-router'

const testing = () => {
  document.documentElement.classList.toggle('my-app-dark')
}
</script>

<template>
  <div class="w-full h-[100vh] flex justify-center">
    <div class="max-w-[1280px] w-full">
      <AppButton @click="testing" label="submit" />
      <RouterView />
    </div>
  </div>
</template>
