import { App } from 'vue';
import { setupI18n } from './lang';
import { setupPinia } from './pinia';
import { setupTailwindcss } from './tailwindcss';

export const setupPlugins = (app: App) => {
    setupTailwindcss();
    setupPinia(app);
    setupI18n(app);
};
