import { createWebHistory, createRouter } from 'vue-router'

import HomeView from '../pages/Home.vue'
import FormAvis from '../pages/FormAvis.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/poster-avis', component: FormAvis },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
