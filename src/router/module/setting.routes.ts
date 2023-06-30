import { RouteRecordRaw } from 'vue-router';

import Setting from '@/entries/popup/setting/index.vue';
import WalletManage from '@/entries/popup/setting/wallet/WalletManage.vue';
import AccountManage from '@/entries/popup/setting/account/AccountManage.vue';
import AccountDetail from '@/entries/popup/setting/account/AccountDetail.vue';
import AccountChange from '@/entries/popup/setting/account/AccountChange.vue';
import WhiteList from '@/entries/popup/setting/whitelist/WhiteList.vue';
import WhiteListDetail from '@/entries/popup/setting/whitelist/WhiteListDetail.vue';
import NetworkManage from '@/entries/popup/setting/network/NetworkManage.vue';

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
        {
            path: 'account-manage',
            name: 'account-manage',
            component: AccountManage,
            meta: {
                index: 5,
            },
        },
        {
            path: 'account-detail',
            name: 'account-detail',
            component: AccountDetail,
            meta: { index: 6 },
        },
        {
            path: 'account-change',
            name: 'account-change',
            component: AccountChange,
            meta: { index: 7 },
        },
        {
            path: 'whitelist',
            name: 'whitelist',
            component: WhiteList,
            meta: {
                index: 4,
            },
        },
        {
            path: 'whitelist-detail',
            name: 'whitelist-detail',
            component: WhiteListDetail,
            meta: {
                index: 5,
            },
        },
        {
            path: 'network-manage',
            name: 'network-manage',
            component: NetworkManage,
            meta: {
                index: 14,
            },
        },
    ],
} as RouteRecordRaw;
