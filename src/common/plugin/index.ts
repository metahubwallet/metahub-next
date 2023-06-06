import { App } from 'vue';
import { setupPinia } from './pinia';
import { setupTailwindcss } from './tailwindcss';
import { setupI18n } from './lang';

export const setupPlugins = (app: App) => {
    setupTailwindcss();
    setupPinia(app);
    setupI18n(app);
};
