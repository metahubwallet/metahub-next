import { Router, RouteRecordRaw } from 'vue-router';

const getModuleRoutes = (): RouteRecordRaw[] => {
    const modules = import.meta.glob('./**/*.ts', { import: 'default', eager: true });
    let routes: RouteRecordRaw[] = [];
    Object.keys(modules).forEach((key) => {
        routes.push(modules[key] as RouteRecordRaw);
    });
    return routes;
};

export const setupModuleRoutes = (router: Router) => {
    const moduleRoutes = getModuleRoutes();
    moduleRoutes.forEach((route) => router.addRoute(route));
};
