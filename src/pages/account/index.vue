<script setup lang="ts">
  // onMounted()
  // if user not signed in, show login/register
  definePage({
    meta: { requiresAuth: true },
  })
</script>

<template>
<div class="flex w-full justify-center items-center flex-col">
  <h1>Imagine a Tab Panel PrimeVue here</h1>
  <div class="flex justify-center w-full gap-x-6 items-center h-8">
    <h1>Profile</h1>
    <h1>Account Settings</h1>
    <h1>Ratings</h1>
    <h1>Saved Providers</h1>
  </div>
</div>
</template>
