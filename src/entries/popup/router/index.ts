import { App } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import { baseRoutes } from './base.routes';
import { setupModuleRoutes } from './module';

export const router = createRouter({
    history: createWebHashHistory(),
    routes: baseRoutes,
});

export const setupRouter = async (app: App) => {
    setupModuleRoutes(router); // 加载模块路由
    app.use(router); // 注册路由
};
