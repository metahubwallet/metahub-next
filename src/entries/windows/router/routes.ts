import { RouteRecordRaw } from 'vue-router';

import Login from '@/entries/windows/views/Login.vue';
import Transcation from '@/entries/windows/views/Transcation.vue';


export const routes: RouteRecordRaw[] = [
    {
        path: '/login',
        name: 'login',
        component: Login,
    },
    {
        path: '/transcation',
        name: 'transcation',
        component: Transcation,
    },

];