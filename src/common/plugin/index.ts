import { App } from 'vue';
import { setupPinia } from './pinia';
import { setupTailwindcss } from './tailwindcss';

export const setupPlugins = (app: App) => {
    setupTailwindcss();
    setupPinia(app);
};
