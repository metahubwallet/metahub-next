import { RouteRecordRaw } from 'vue-router';

export default {
    path: '/wallet',
    name: 'wallet',
    component: () => import('@/entries/wallet/index.vue'),
    redirect: '/wallet/wallet-manager',
    children: [
        {
            path: 'wallet-manager',
            name: 'wallet-manager',
            component: () => import('@/entries/wallet/WalletManager.vue'),
        },
        {
            path: 'import-wallet',
            name: 'import-wallet',
            component: () => import('@/entries/wallet/import/ImportWallet.vue'),
        },
        {
            path: 'import-protocol',
            name: 'import-protocol',
            component: () => import('@/entries/wallet/import/ImportProtocol.vue'),
        },
    ],
} as RouteRecordRaw;
