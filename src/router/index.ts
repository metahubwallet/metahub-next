import { createRouter, createWebHashHistory } from 'vue-router';

import Test from '@/components/Test.vue';

const routes = [
    {
        path: '/',
        name: 'wallet',
        component: () => import('@/entries/wallet/index.vue'),
        meta: {
            index: 1,
        },
    },
    { path: '/test', name: 'test', component: Test },
];

export const router = createRouter({
    history: createWebHashHistory(),
    routes,
});
