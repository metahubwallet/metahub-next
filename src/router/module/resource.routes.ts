import { RouteRecordRaw } from 'vue-router';

import Resource from '@/entries/popup/resource/index.vue';
import Recharge from '@/entries/popup/resource/Recharge.vue';

export default {
    path: '/resource',
    children: [
        {
            path: 'index',
            name: 'resource',
            component: Resource,
            meta: {
                index: 3,
            },
        },
        {
            path: 'recharge',
            name: 'recharge',
            component: Recharge,
            meta: {
                index: 4,
            },
        },
    ],
} as RouteRecordRaw;
