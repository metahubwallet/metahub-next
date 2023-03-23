import { App } from 'vue';
import { setupPinia } from './pinia';

export const setupPlugins = (app: App) => {
    setupPinia(app);
};
