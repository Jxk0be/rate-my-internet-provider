<script setup lang="ts">
import { ref } from 'vue'
import type { User } from '@supabase/supabase-js'
import LoginRegisterModal from '@/components/LoginRegisterModal.vue'

const loginVisible = ref(false)
const registerVisible = ref(false)
const currentUser = ref<User | null>(null)
</script>

<template>
  <div
    class="fixed z-3 flex text-white justify-center items-center top-0 right-0 mx-auto w-full h-[68px] bg-black"
  >
    <div class="max-w-[1280px] w-full h-full px-5 flex justify-between items-center">
      <h1 class="font-bold text-lg">rate my <span class="text-cyan-500">internet</span></h1>
      <div class="gap-x-6 font-semibold text-lg flex justify-between items-center h-full">
        <h1>Test_1</h1>
        <h1>Test_2</h1>
        <h1>Test_3</h1>
        <h1>Test_4</h1>

        <div v-if="!currentUser" class="flex justify-center items-center gap-x-4">
          <h1 @click="() => (loginVisible = true)" class="cursor-pointer">Login</h1>
          <button
            @click="() => (registerVisible = true)"
            class="bg-cyan-500 cursor-pointer rounded-[40px] py-1 px-3"
          >
            Register
          </button>
        </div>
        <h1 v-else>{{ currentUser.email }}</h1>
      </div>
    </div>
  </div>

  <LoginRegisterModal
    v-model:login-visible="loginVisible"
    v-model:register-visible="registerVisible"
    v-model:current-user="currentUser"
  />
</template>

<style scoped></style>
