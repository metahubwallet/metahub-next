import { createApp } from 'vue';
import { setupRouter } from './router';
import App from './App.vue';
import '@/assets/css/base.scss';
import '@/assets/css/window.scss';
import '@icon-park/vue-next/styles/index.css';

import { setupPlugins } from '@/common/plugin';

const bootstrap = async () => {
    // upgrade
    await localCache.upgrade();

    const app = createApp(App);
    await setupPlugins(app);
    await setupRouter(app);
    app.mount('#app');
};

bootstrap();
