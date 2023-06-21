import { RouteRecordRaw } from 'vue-router';

import ImportKey from '@/entries/popup/wallet/ImportKey.vue';
import ImportProtocol from '@/entries/popup/wallet/ImportProtocol.vue';
import AddToken from '@/entries/popup/wallet/AddToken.vue';
import TokenTraces from '@/entries/popup/wallet/TokenTraces.vue';
import Transfer from '@/entries/popup/wallet/Transfer.vue';
import Transation from '@/entries/popup/wallet/Transation.vue';
import Receive from '@/entries/popup/wallet/Receive.vue';

export default {
    path: '/wallet',
    name: 'wallet',
    children: [
        {
            path: 'import-key',
            name: 'import-key',
            component: ImportKey,
            meta: {
                index: 10,
            },
        },
        {
            path: 'import-protocol',
            name: 'import-protocol',
            component: ImportProtocol,
            meta: {
                index: 14,
            },
        },
        {
            path: 'add-token',
            name: 'add-token',
            component: AddToken,
            meta: {
                index: 2,
            },
        },
        {
            path: 'token-traces/:token',
            name: 'token-traces',
            component: TokenTraces,
            meta: {
                index: 2,
            },
        },
        {
            path: 'transfer',
            name: 'transfer',
            component: Transfer,
            meta: {
                index: 3,
            },
        },
        {
            path: 'transation',
            name: 'transation',
            component: Transation,
            meta: {
                index: 3,
            },
        },
        {
            path: 'receive',
            name: 'receive',
            component: Receive,
            meta: {
                index: 3,
            },
        },
    ],
} as RouteRecordRaw;
