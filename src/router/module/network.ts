import { RouteRecordRaw } from 'vue-router';

export default {
    path: '/network',
    name: 'network',
    component: () => import('@/entries/network/NetworkManager.vue'),
    children: [
        {
            path: 'select-network',
            name: 'network-select',
            component: () => import('@/entries/network/SelectNetwork.vue'),
        },
        {
            path: 'add-network',
            name: 'network-add',
            component: () => import('@/entries/network/AddNetwork.vue'),
        },
        {
            path: 'add-cus-network',
            name: 'network-add-cus',
            component: () => import('@/entries/network/AddCustomNetwork.vue'),
        },
    ],
} as RouteRecordRaw;
