import { createRouter, createWebHashHistory } from 'vue-router';

import Wallet from '@/entries/popup/wallet/index.vue';

const routes = [{ path: '/', name: 'wallet', component: Wallet }];

export const router = createRouter({
    history: createWebHashHistory(),
    routes,
});
