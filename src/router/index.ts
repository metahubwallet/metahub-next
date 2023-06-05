import { App } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import { baseRoutes } from './base';
import { setupModuleRoutes } from './module';

export const router = createRouter({
    history: createWebHashHistory(),
    routes: baseRoutes,
});

export const setupRouter = (app: App) => {
    // setupModuleRoutes(router);
    app.use(router); // 注册路由
};
