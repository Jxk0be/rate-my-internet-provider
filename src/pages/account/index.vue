<script setup lang="ts">
import ProfileTab from '@/components/account/ProfileTab.vue'
import RatingsTab from '@/components/account/RatingsTab.vue'
import SavedProvidersTab from '@/components/account/SavedProvidersTab.vue'
import AppFooter from '@/components/AppFooter.vue'

definePage({
  meta: { requiresAuth: true },
})
</script>

<template>
  <div
    class="flex min-h-[75vh] max-w-[1280px] mx-auto sm:px-5 pt-[80px] location-view lg:px-8 pb-8 w-full items-center flex-col"
  >
    <AppTabs value="0" class="w-full">
      <AppTabList>
        <AppTab value="0">Profile</AppTab>
        <AppTab value="1">Ratings</AppTab>
        <AppTab value="2">Saved Providers</AppTab>
      </AppTabList>
      <AppTabPanels>
        <AppTabPanel value="0">
          <ProfileTab />
        </AppTabPanel>
        <AppTabPanel value="1">
          <RatingsTab />
        </AppTabPanel>
        <AppTabPanel value="2">
          <SavedProvidersTab />
        </AppTabPanel>
      </AppTabPanels>
    </AppTabs>
  </div>
  <AppFooter />
</template>
