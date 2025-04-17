import { createRouter, createWebHistory } from 'vue-router';
import FixtureGenerator from '@/components/FixtureGenerator.vue';
import ContinueFixture from '@/components/ContinueFixture.vue';

const routes = [
  {
    path: '/',
    name: 'FixtureGenerator',
    component: FixtureGenerator,
  },
  {
    path: '/continue',
    name: 'ContinueFixture',
    component: ContinueFixture,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
