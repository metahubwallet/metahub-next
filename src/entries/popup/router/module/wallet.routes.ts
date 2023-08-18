import { RouteRecordRaw } from 'vue-router';

import ImportKey from '@/entries/popup/wallet/ImportKey.vue';
import ImportProtocol from '@/entries/popup/wallet/ImportProtocol.vue';
import AddToken from '@/entries/popup/wallet/AddToken.vue';

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
    ],
} as RouteRecordRaw;
