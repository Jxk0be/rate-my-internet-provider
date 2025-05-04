<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/user.ts'

const props = defineProps<{
  loginVisible: boolean
  registerVisible: boolean
}>()

const emit = defineEmits<{
  'update:loginVisible': [value: boolean]
  'update:registerVisible': [value: boolean]
}>()

const userStore = useUserStore()
const loginEmail = ref('')
const loginPassword = ref('')
const registerEmail = ref('')
const registerPassword = ref('')
const registerUsername = ref('')
const registerName = ref('')

const handleRegister = async () => {
  await userStore.register(registerEmail.value, registerPassword.value, {
    name: registerName.value,
    username: registerUsername.value,
  })

  clearFields()
  emit('update:registerVisible', false)
}

const handleLogin = async () => {
  await userStore.login(loginEmail.value, loginPassword.value)

  clearFields()
  emit('update:loginVisible', false)
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
    :visible="props.loginVisible"
    @update:visible="(value: boolean) => emit('update:loginVisible', value)"
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

      <!-- Actions -->
      <div class="flex justify-end gap-x-3">
        <AppButton
          label="Cancel"
          severity="secondary"
          text
          @click="emit('update:loginVisible', false)"
          pt:root:class="px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800"
        />
        <AppButton
          label="Login"
          severity="primary"
          @click="handleLogin"
          pt:root:class="px-4 py-2 rounded-lg !bg-cyan-500 hover:!bg-cyan-600"
        />
      </div>
    </div>
  </AppDialog>

  <AppDialog
    :visible="props.registerVisible"
    @update:visible="(value: boolean) => emit('update:registerVisible', value)"
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
        <AppInputText id="name" v-model="registerName" class="w-full" pt:root:class="rounded-lg" />
      </div>

      <div class="flex justify-end gap-3 pt-4">
        <AppButton
          label="Cancel"
          severity="secondary"
          text
          @click="emit('update:registerVisible', false)"
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
