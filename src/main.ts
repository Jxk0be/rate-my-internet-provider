import './assets/main.css'
import App from './App.vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'

import {
  AutoComplete,
  Button,
  Dialog,
  InputText,
  Paginator,
  ProgressSpinner,
  Rating,
  Skeleton,
} from 'primevue'

const app = createApp(App)

app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: 'p',
      darkModeSelector: '.dark',
      cssLayer: false,
    },
  },
})

app.use(createPinia())
app.use(router)

app.component('AppAutocomplete', AutoComplete)
app.component('AppButton', Button)
app.component('AppDialog', Dialog)
app.component('AppInputText', InputText)
app.component('AppPaginator', Paginator)
app.component('AppProgressSpinner', ProgressSpinner)
app.component('AppRating', Rating)
app.component('AppSkeleton', Skeleton)

app.mount('#app')
