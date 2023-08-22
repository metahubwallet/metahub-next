import { RouteRecordRaw } from 'vue-router';

import Layout from '@/entries/windows/views/Layout.vue';
import Login from '@/entries/windows/views/Login.vue';
import Transcation from '@/entries/windows/views/Transcation.vue';


export const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'layout',
        component: Layout,
        children: [
            {
                path: '/login',
                name: 'login',
                component: Login,
            },
            {
                path: 'transcation',
                name: '/transcation',
                component: Transcation,
            },
        ]
    },

];