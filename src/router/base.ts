import { RouteRecordRaw } from 'vue-router';

export const baseRoutes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'wallet',
        component: () => import('@/entries/wallet/index.vue'),
        meta: {
            index: 1,
        },
    },
    {
        path: '/wallet/import-wallet',
        name: 'import-wallet',
        component: () => import('@/entries/wallet/import/ImportWallet.vue'),
        meta: {
            index: 10,
        },
    },
];
