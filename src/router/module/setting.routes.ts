import { RouteRecordRaw } from 'vue-router';

import Setting from '@/entries/popup/setting/index.vue';
import WalletManage from '@/entries/popup/setting/wallet/WalletManage.vue';

export default {
    path: '/setting',
    children: [
        {
            path: 'index',
            name: 'setting',
            component: Setting,
            meta: {
                index: 3,
            },
        },
        {
            path: 'wallet-manage',
            name: 'wallet-manage',
            component: WalletManage,
            meta: {
                index: 4,
            },
        },
    ],
} as RouteRecordRaw;
