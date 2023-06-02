import { RouteRecordRaw } from 'vue-router';

export const baseRoutes: RouteRecordRaw[] = [
    // 首页
    {
        path: '/',
        name: 'index',
        redirect: '/wallet',
        children: [],
    },
];
