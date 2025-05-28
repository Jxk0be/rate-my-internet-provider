import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import { useUserStore } from '@/stores/user.ts'

const router = createRouter({
  history: createWebHistory('/'),
  scrollBehavior() {
    return { top: 0 }
  },
  routes,
})

router.beforeEach((to, _from, next) => {
  const userStore = useUserStore()

  if (to.meta.requiresAuth && !userStore.user) {
    console.log('requires auth')
    return next('/')
  }

  next()
})

export default router
