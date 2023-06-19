import { RouteRecordRaw } from 'vue-router';

import Wallet from '@/entries/popup/wallet/index.vue';
import ImportKey from '@/entries/popup/wallet/ImportKey.vue';
import ImportProtocol from '@/entries/popup/wallet/ImportProtocol.vue';
import AddToken from '@/entries/popup/wallet/AddToken.vue';
import TokenTraces from '@/entries/popup/wallet/TokenTraces.vue';

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
            index: 14,
        },
    },
    {
        path: '/wallet/add-token',
        name: 'add-token',
        component: AddToken,
        meta: {
            index: 2,
        },
    },
    {
        path: '/wallet/token-traces/:token',
        name: 'token-traces',
        component: TokenTraces,
        meta: {
            index: 2,
        },
    },
];
