import { RouteRecordRaw } from 'vue-router';

import Setting from '@/entries/popup/setting/index.vue';

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
    ],
} as RouteRecordRaw;
