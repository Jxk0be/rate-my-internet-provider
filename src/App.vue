<script setup lang="ts">
import { RouterView } from 'vue-router'

const testing = () => {
  document.documentElement.classList.toggle('my-app-dark')
}
</script>

<template>
  <div></div>

  <div class="w-full h-[100vh] flex justify-center">
    <div
      class="fixed z-3 flex text-white justify-center items-center top-0 right-0 mx-auto w-full h-[68px] bg-black"
    >
      <div class="max-w-[1280px] w-full h-full px-5 flex justify-between items-center">
        <h1 class="font-bold text-xl">rate my <span class="text-cyan-500">internet</span></h1>
        <div class="gap-x-6 font-semibold text-xl flex justify-between items-center h-full">
          <h1>Test_1</h1>
          <h1>Test_2</h1>
          <h1>Test_3</h1>
          <h1>Test_4</h1>
        </div>
      </div>
    </div>
    <div class="max-w-[1280px] pt-[78px] px-5 w-full">
      <AppButton @click="testing" label="submit" />
      <RouterView />
    </div>
  </div>
</template>
