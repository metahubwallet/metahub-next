import { RouteRecordRaw } from 'vue-router';

import Index from '@/entries/popup/wallet/index.vue';

export const baseRoutes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'index',
        component: Index,
        meta: {
            index: 1,
        },
    },
];
