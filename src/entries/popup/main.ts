import { createApp } from 'vue';
import { router } from '../../router';
import App from './App.vue';
import '@/asset/css/base.scss';
import 'animate.css';

import { setupPlugins } from '@/common/plugin';

const bootstrap = () => {
    const app = createApp(App);
    setupPlugins(app);
    app.use(router);
    app.mount('#app');
};

bootstrap();
