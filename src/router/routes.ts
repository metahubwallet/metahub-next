import { RouteRecordRaw } from 'vue-router';

import Wallet from '@/entries/popup/wallet/index.vue';
import ImportKey from '@/entries/popup/wallet/ImportKey.vue';
import ImportProtocol from '@/entries/popup/wallet/ImportProtocol.vue';

export const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'wallet',
        component: Wallet,
        meta: {
            index: 1,
        },
    },
    {
        path: '/wallet/import-key',
        name: 'import-key',
        component: ImportKey,
        meta: {
            index: 10,
        },
    },
    {
        path: '/wallet/import-protocol',
        name: 'import-protocol',
        component: ImportProtocol,
        meta: {
            index: 10,
        },
    },
];
