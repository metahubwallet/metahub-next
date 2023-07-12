import { createApp } from 'vue';
import { setupRouter } from '@/router';
import App from './App.vue';
import '@/asset/css/base.scss';
import 'animate.css';
import '@/entries/background/main.ts';

import { setupPlugins } from '@/common/plugin';

const bootstrap = () => {
    const app = createApp(App);
    setupPlugins(app);
    setupRouter(app);
    app.mount('#app');
};

bootstrap();
