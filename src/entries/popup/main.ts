import { createApp } from 'vue';
import { setupRouter } from './router';
import App from './App.vue';
import '@/assets/css/base.scss';
import 'animate.css';
import '@icon-park/vue-next/styles/index.css';

import { setupPlugins } from '@/common/plugin';

const bootstrap = async () => {
    // upgrade
    await localCache.upgrade();

    const app = createApp(App);
    setupPlugins(app);
    setupRouter(app);
    app.mount('#app');
};

bootstrap();
