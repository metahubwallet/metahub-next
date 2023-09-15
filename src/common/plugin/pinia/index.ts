import { App } from 'vue';
import { createPinia } from 'pinia';

export const setupPinia = async (app: App) => {
    app.use(createPinia());

    await useChainStore().init();
    await useUserStore().init();
    await useWalletStore().init();
    await useSettingStore().init();
};
