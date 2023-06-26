import { RouteRecordRaw } from 'vue-router';

import TokenTraces from '@/entries/popup/transfer/TokenTraces.vue';
import Transfer from '@/entries/popup/transfer/Transfer.vue';
import Transation from '@/entries/popup/transfer/Transation.vue';
import Receive from '@/entries/popup/transfer/Receive.vue';

export default {
    path: '/transfer',
    children: [
        {
            path: 'index',
            name: 'transfer',
            component: Transfer,
            meta: {
                index: 3,
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
