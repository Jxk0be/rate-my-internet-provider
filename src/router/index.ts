import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'

const router = createRouter({
  history: createWebHistory("/"),
  routes,
});

router.beforeEach((to, from, next) => {
  console.log(to.path, to.meta);
  if (to.meta.requiresAuth) {
    console.log("requires auth")
  }
  next()
})

export default router;
