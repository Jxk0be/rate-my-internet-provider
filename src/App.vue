<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="w-full bg-amber-400 flex justify-center">
    <div class="max-w-[1280px] w-full bg-red-500">
      <RouterView />
    </div>
  </div>
</template>

