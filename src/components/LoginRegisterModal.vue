<script setup lang="ts">
import { supabase } from '@/supabase.ts'
import { ref } from 'vue'
import type { User } from '@supabase/supabase-js'

const props = defineProps<{
  loginVisible: boolean
  registerVisible: boolean
  currentUser: User | null
}>()

const emit = defineEmits<{
  'update:loginVisible': [value: boolean]
  'update:registerVisible': [value: boolean]
  'update:currentUser': [value: User | null]
}>()

const loginEmail = ref('')
const loginPassword = ref('')
const registerEmail = ref('')
const registerPassword = ref('')

const registerAccount = async () => {
  const { data, error } = await supabase.auth.signUp({
    email: registerEmail.value,
    password: registerPassword.value,
  })

  if (error) {
    console.log(error)
    return
  }

  clearFields()
  emit('update:currentUser', data?.user)
  emit('update:registerVisible', false)
}

const clearFields = () => {
  loginEmail.value = ''
  loginPassword.value = ''
  registerEmail.value = ''
  registerPassword.value = ''
}

const loginAccount = async () => {}
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
      <button class="cursor-pointer" type="button" @click="emit('update:loginVisible', false)">
        Save
      </button>
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
      <button class="cursor-pointer" type="button" @click="registerAccount">Save</button>
    </div>
  </AppDialog>
</template>
