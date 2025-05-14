<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const city = route.params.city
const provider = route.params.provider
</script>

<template>
  <div>
    <h1>City: {{ city }}</h1>
    <h2>Provider: {{ provider }}</h2>
    <!-- Add your provider-specific content here -->
  </div>
</template>
