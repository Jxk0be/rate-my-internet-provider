<template>
  <footer class="bg-gray-900 md:pb-0 pb-20 text-white py-12">
    <div class="px-4 max-w-[1280px] mx-auto sm:px-5">
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <h1 class="text-2xl font-bold mb-4">Rate My Internet</h1>
        </div>

        <div>
          <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
          <ul class="space-y-2">
            <li>
              <router-link to="/all-locations" class="hover:text-cyan-400"
                >All Locations</router-link
              >
            </li>
            <li><router-link to="/account" class="hover:text-cyan-400">Account</router-link></li>
            <li>
              <router-link to="/privacy-policy" class="hover:text-cyan-400"
                >Privacy Policy</router-link
              >
            </li>
            <li>
              <router-link to="/terms-and-conditions" class="hover:text-cyan-400"
                >Terms and Conditions</router-link
              >
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-gray-800 mt-8 pt-8 text-center pb-8 text-sm text-gray-400">
        <p>© 2025 Rate My Internet. All Rights Reserved.</p>
      </div>
    </div>
  </footer>
</template>
<script setup lang="ts"></script>
