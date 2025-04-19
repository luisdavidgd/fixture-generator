// src/router/index.js
import { createRouter, createWebHashHistory } from 'vue-router'
import FixtureGenerator from '@/components/FixtureGenerator.vue'
import ContinueFixture from '@/components/ContinueFixture.vue'
import HowToUse from '@/components/HowToUse.vue'

const routes = [
  { path: '/', component: FixtureGenerator },
  { path: '/continue', component: ContinueFixture },
  { path: '/how-to-use', component: HowToUse },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
