<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const city = route.params.city
</script>

<template>
  <div>
    <h1>City: {{ city }}</h1>
    <!-- Add your city-specific content here -->
  </div>
</template>
