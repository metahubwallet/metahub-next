import { App } from 'vue';
import { setupPinia } from './pinia';
import { setupTailwindcss } from './tailwindcss';
import { setupI18n } from './lang';

export const setupPlugins = async (app: App) => {
    await setupPinia(app);
    setupTailwindcss();
    setupI18n(app);
};
