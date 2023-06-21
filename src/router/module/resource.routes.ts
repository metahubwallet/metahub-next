import { RouteRecordRaw } from 'vue-router';

import Resource from '@/entries/popup/resource/index.vue';

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
    ],
} as RouteRecordRaw;
