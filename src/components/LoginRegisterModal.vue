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

const handleRegister = async () => {
  await userStore.register(registerEmail.value, registerPassword.value)

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
    :style="{ width: '25rem' }"
    pt:root:class="!border-0"
    pt:mask:class="backdrop-blur-sm"
  >
    <div class="flex items-center gap-4 mb-4">
      <label for="email" class="font-semibold w-24">Email</label>
      <AppInputText v-model="loginEmail" class="flex-auto" />
    </div>
    <div class="flex items-center gap-4 mb-8">
      <label for="email" class="font-semibold w-24">Password</label>
      <AppInputText v-model="loginPassword" class="flex-auto" />
    </div>
    <div class="flex justify-end gap-2">
      <button class="cursor-pointer" type="button" @click="emit('update:loginVisible', false)">
        Cancel
      </button>
      <button @click="handleLogin" class="cursor-pointer" type="button">Save</button>
    </div>
  </AppDialog>

  <AppDialog
    :visible="props.registerVisible"
    @update:visible="(value: boolean) => emit('update:registerVisible', value)"
    modal
    header="Register"
    :draggable="false"
    :style="{ width: '25rem' }"
    pt:root:class="!border-0"
    pt:mask:class="backdrop-blur-sm"
  >
    <div class="flex items-center gap-4 mb-4">
      <label for="email" class="font-semibold w-24">Email</label>
      <AppInputText v-model="registerEmail" class="flex-auto" />
    </div>
    <div class="flex items-center gap-4 mb-8">
      <label for="email" class="font-semibold w-24">Password</label>
      <AppInputText v-model="registerPassword" class="flex-auto" />
    </div>
    <div class="flex justify-end gap-2">
      <button class="cursor-pointer" type="button" @click="emit('update:registerVisible', false)">
        Cancel
      </button>
      <button class="cursor-pointer" type="button" @click="handleRegister">Save</button>
    </div>
  </AppDialog>
</template>
