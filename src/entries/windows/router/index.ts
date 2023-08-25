import { App } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import { routes } from './routes';

console.log(routes);
export const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export const setupRouter = (app: App) => {
    app.use(router); // 注册路由
};
