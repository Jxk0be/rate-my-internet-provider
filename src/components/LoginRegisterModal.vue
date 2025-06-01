<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/user.ts'
import { Button as AppButton } from 'primevue'

const userStore = useUserStore()
const loginEmail = ref('')
const loginPassword = ref('')
const registerEmail = ref('')
const registerPassword = ref('')
const registerUsername = ref('')
const registerName = ref('')

const handleRegister = async () => {
  if (registerEmail.value === '' || registerPassword.value === '') return

  await userStore.register(registerEmail.value, registerPassword.value, {
    name: registerName.value,
    username: registerUsername.value,
  })

  clearFields()
  userStore.isRegisterVisible = false
}

const handleLogin = async () => {
  if (loginEmail.value === '' || loginPassword.value === '') return

  await userStore.login(loginEmail.value, loginPassword.value)

  clearFields()
  userStore.isLoginVisible = false
}

const clearFields = () => {
  loginEmail.value = ''
  loginPassword.value = ''
  registerEmail.value = ''
  registerPassword.value = ''
}
</script>

<template>
  <AppDialog
    :visible="userStore.isLoginVisible"
    @update:visible="(value: boolean) => (userStore.isLoginVisible = value)"
    modal
    header="Login"
    :draggable="false"
    class="sm:max-w-md w-[95%]"
    pt:root:class="border-0 rounded-xl"
    pt:header:class="text-2xl font-bold pb-2"
    pt:content:class="px-6 py-4"
    pt:mask:class="backdrop-blur-sm"
  >
    <div class="flex flex-col gap-y-6">
      <!-- Email Field -->
      <div class="flex flex-col gap-y-2">
        <label for="login-email" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Email
        </label>
        <AppInputText
          :maxlength="35"
          id="login-email"
          v-model="loginEmail"
          class="w-full"
          pt:root:class="rounded-lg"
        />
      </div>

      <!-- Password Field -->
      <div class="flex flex-col gap-y-2">
        <label
          for="login-password"
          class="block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Password
        </label>
        <AppInputText
          id="login-password"
          type="password"
          v-model="loginPassword"
          class="w-full"
          pt:root:class="rounded-lg"
        />
      </div>

      <div class="relative my-4">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300 dark:border-gray-700"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 text-gray-500 dark:text-gray-200 bg-white dark:bg-gray-700 rounded-lg"
            >Or continue with</span
          >
        </div>
      </div>

      <!-- Google Login Button -->
      <button
        @click="userStore.googleLogin"
        class="w-full flex items-center cursor-pointer justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
      >
        <svg class="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Sign in with Google
      </button>
      <div class="flex justify-end gap-x-3">
        <AppButton
          label="Cancel"
          severity="secondary"
          text
          @click="() => (userStore.isLoginVisible = false)"
          pt:root:class="px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800"
        />
        <AppButton
          label="Login"
          severity="primary"
          @click="handleLogin"
          pt:root:class="px-4 py-2 rounded-lg !bg-cyan-500 hover:!bg-cyan-600"
        />
      </div>

      <div class="text-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p class="text-gray-600 dark:text-gray-400">
          Don't have an account?
          <a
            href="#"
            class="text-cyan-500 font-medium ml-1 cursor-pointer"
            @click.prevent="
              () => {
                userStore.isLoginVisible = false
                userStore.isRegisterVisible = true
              }
            "
          >
            Create one now
          </a>
        </p>
      </div>
    </div>
  </AppDialog>

  <AppDialog
    :visible="userStore.isRegisterVisible"
    @update:visible="(value: boolean) => (userStore.isRegisterVisible = value)"
    modal
    header="Create your account"
    :draggable="false"
    class="sm:max-w-md w-[95%]"
    pt:root:class="!border-0 rounded-xl"
    pt:header:class="text-2xl font-bold pb-2"
    pt:content:class="px-6 py-4"
    pt:mask:class="backdrop-blur-sm"
  >
    <div class="flex flex-col justify-center w-full gap-y-3">
      <div class="w-full flex flex-col gap-y-1">
        <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Username
        </label>
        <AppInputText
          :maxlength="25"
          id="username"
          v-model="registerUsername"
          class="w-full"
          pt:root:class="rounded-lg"
        />
      </div>

      <div class="w-full flex flex-col gap-y-1">
        <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Email
        </label>
        <AppInputText
          :maxlength="35"
          id="email"
          v-model="registerEmail"
          class="w-full"
          pt:root:class="rounded-lg"
        />
      </div>

      <div class="w-full flex flex-col gap-y-1">
        <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Password
        </label>
        <AppInputText
          id="password"
          type="password"
          v-model="registerPassword"
          class="w-full"
          pt:root:class="rounded-lg"
        />
      </div>

      <div class="w-full flex flex-col gap-y-1">
        <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Preferred Name
        </label>
        <AppInputText
          :maxlength="25"
          id="name"
          v-model="registerName"
          class="w-full"
          pt:root:class="rounded-lg"
        />
      </div>

      <div class="flex justify-end gap-3 pt-4">
        <AppButton
          label="Cancel"
          severity="secondary"
          text
          @click="() => (userStore.isRegisterVisible = false)"
          pt:root:class="px-4 py-2 rounded-lg hover:!bg-gray-200 dark:hover:!bg-gray-800"
        />
        <AppButton
          label="Create Account"
          severity="primary"
          @click="handleRegister"
          pt:root:class="px-4 py-2 rounded-lg !bg-cyan-500 hover:!bg-cyan-600"
        />
      </div>
    </div>
  </AppDialog>
</template>
