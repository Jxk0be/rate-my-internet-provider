<script setup lang="ts">
import { ref, watch } from 'vue'
import LoginRegisterModal from '@/components/LoginRegisterModal.vue'
import { useUserStore } from '@/stores/user.ts'

const loginVisible = ref(false)
const registerVisible = ref(false)
const userStore = useUserStore()
// You'll need this to track the current mode for the icon
const darkMode = ref(document.documentElement.classList.contains('dark'))

const toggleDarkMode = () => {
  darkMode.value = !darkMode.value
  document.documentElement.classList.toggle('dark')
}
</script>

<template>
  <div
    class="fixed z-3 flex text-white justify-center items-center top-0 right-0 mx-auto w-full h-[68px] bg-black"
  >
    <div class="max-w-[1280px] w-full h-full px-5 flex justify-between items-center">
      <h1 class="font-bold text-lg">rate my <span class="text-cyan-500">internet</span></h1>
      <div class="gap-x-6 font-semibold text-lg flex justify-between items-center h-full">
        <h1>Test_1</h1>
        <div v-if="userStore.user" class="flex justify-center items-center gap-x-6">
          <RouterLink to="/account">{{ userStore.username }}</RouterLink>
          <button
            @click="userStore.logout()"
            class="bg-cyan-500 cursor-pointer rounded-[40px] py-1 px-3"
          >
            Logout
          </button>
        </div>
        <div v-else class="flex justify-center items-center gap-x-6">
          <h1 @click="() => (loginVisible = true)" class="cursor-pointer">Login</h1>

          <button
            @click="() => (registerVisible = true)"
            class="bg-cyan-500 cursor-pointer rounded-[40px] py-1 px-3"
          >
            Register
          </button>
        </div>

        <AppButton
          @click="toggleDarkMode"
          :class="`p-button-rounded p-button-text ${darkMode ? '!bg-yellow-500' : '!bg-gray-400 '}`"
        >
          <i :class="`${darkMode ? 'pi pi-sun' : 'pi pi-moon'} !text-white !font-semibold`"></i>
        </AppButton>
      </div>
    </div>
  </div>

  <LoginRegisterModal
    v-model:login-visible="loginVisible"
    v-model:register-visible="registerVisible"
  />
</template>

<style scoped></style>
