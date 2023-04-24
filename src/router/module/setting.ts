import { RouteRecordRaw } from 'vue-router';

export default {
    path: '/setting',
    name: 'setting',
    component: () => import('@/entries/setting/SettingIndex.vue'),
    children: [
        {
            path: 'node',
            name: 'setting-node',
            component: () => import('@/entries/setting/SettingNode.vue'),
        },
        {
            path: 'lang',
            name: 'setting-lang',
            component: () => import('@/entries/setting/SettingLang.vue'),
        },
    ],
} as RouteRecordRaw;
