<script setup lang="ts">
defineProps<{
  loginVisible: boolean
  registerVisible: boolean
}>()

const emit = defineEmits<{
  'update:loginVisible': [value: boolean]
  'update:registerVisible': [value: boolean]
}>()
</script>

<template>
  <AppDialog
    :visible="loginVisible"
    @update:visible="(value: boolean) => emit('update:loginVisible', value)"
    modal
    header="Login"
    :draggable="false"
    :style="{ width: '25rem' }"
    pt:root:class="!border-0"
    pt:mask:class="backdrop-blur-sm"
  >
    <div class="flex items-center gap-4 mb-4">
      <label for="username" class="font-semibold w-24">Username</label>
      <AppInputText id="username" class="flex-auto" />
    </div>
    <div class="flex items-center gap-4 mb-8">
      <label for="email" class="font-semibold w-24">Email</label>
      <AppInputText id="email" class="flex-auto" />
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
    :visible="registerVisible"
    @update:visible="(value: boolean) => emit('update:registerVisible', value)"
    modal
    header="Register"
    :draggable="false"
    :style="{ width: '25rem' }"
    pt:root:class="!border-0"
    pt:mask:class="backdrop-blur-sm"
  >
    <div class="flex items-center gap-4 mb-4">
      <label for="username" class="font-semibold w-24">Username</label>
      <AppInputText id="username" class="flex-auto" />
    </div>
    <div class="flex items-center gap-4 mb-8">
      <label for="email" class="font-semibold w-24">Email</label>
      <AppInputText id="email" class="flex-auto" />
    </div>
    <div class="flex justify-end gap-2">
      <button class="cursor-pointer" type="button" @click="emit('update:registerVisible', false)">
        Cancel
      </button>
      <button class="cursor-pointer" type="button" @click="emit('update:registerVisible', false)">
        Save
      </button>
    </div>
  </AppDialog>
</template>
