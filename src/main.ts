import './assets/main.css'
import App from './App.vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import ToastService from 'primevue/toastservice'
import {
  AutoComplete,
  Button,
  Dialog,
  InputText,
  Paginator,
  ProgressSpinner,
  Rating,
  Skeleton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Textarea,
  Toast,
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
app.use(ToastService)

app.component('AppAutocomplete', AutoComplete)
app.component('AppButton', Button)
app.component('AppDialog', Dialog)
app.component('AppInputText', InputText)
app.component('AppPaginator', Paginator)
app.component('AppProgressSpinner', ProgressSpinner)
app.component('AppRating', Rating)
app.component('AppSkeleton', Skeleton)
app.component('AppTab', Tab)
app.component('AppTabList', TabList)
app.component('AppTabPanel', TabPanel)
app.component('AppTabPanels', TabPanels)
app.component('AppTabs', Tabs)
app.component('AppTextarea', Textarea)
app.component('AppToast', Toast)

app.mount('#app')
