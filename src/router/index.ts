import { createRouter, createWebHashHistory } from 'vue-router';

import Home from '../components/Home.vue';
import Test from '../components/Test.vue';

const routes = [
    { path: '/', name: 'home', component: Home },
    { path: '/test', name: 'test', component: Test }
  ]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

