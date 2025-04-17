// src/router/index.js
import { createRouter, createWebHashHistory } from 'vue-router'
import FixtureGenerator from '@/components/FixtureGenerator.vue'
import ContinueFixture from '@/components/ContinueFixture.vue'

const routes = [
  { path: '/', component: FixtureGenerator },
  { path: '/continue', component: ContinueFixture },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
