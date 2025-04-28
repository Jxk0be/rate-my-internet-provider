<script setup lang="ts">
import { useRoute } from 'vue-router'

definePage({
  meta: { requiresAuth: true },
})

const route = useRoute()
const profileId = route.params.profileId
</script>

<template>
  <div>
    <h1>Profile: {{ profileId }}</h1>
  </div>
</template>
