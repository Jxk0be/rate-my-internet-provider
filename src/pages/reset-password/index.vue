<script setup lang="ts">
definePage({
  meta: { requiresAuth: true },
})
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const newPassword = ref('')

const handleResetPassword = async () => {
  if (newPassword.value === '') return

  await userStore.updatePassword(newPassword.value)

  setTimeout(() => {
    window.location.href = '/'
  }, 2000)
}
</script>

<template>
  <div class="flex h-[calc(100vh-6.25rem)] items-center justify-center px-4">
    <div class="sm:max-w-md w-full">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <form @submit.prevent="handleResetPassword" class="flex flex-col gap-y-6">
          <h1 class="text-2xl font-bold pb-2">Reset Password</h1>

          <div class="flex flex-col gap-y-2">
            <label
              for="new-password"
              class="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              New Password
            </label>
            <AppInputText
              id="new-password"
              v-model="newPassword"
              type="password"
              class="w-full"
              pt:root:class="rounded-lg"
              required
            />
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-x-3">
            <AppButton
              type="submit"
              label="Reset Password"
              severity="primary"
              pt:root:class="px-4 py-2 w-full rounded-lg !bg-cyan-500 hover:!bg-cyan-600"
            />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
