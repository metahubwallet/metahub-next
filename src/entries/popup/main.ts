import { createApp } from 'vue';
import { router } from '../../router';
import App from './App.vue';

import { setupPlugins } from '@/common/plugins';
import 'element-plus/dist/index.css';

const bootstrap = () => {
    const app = createApp(App);
    setupPlugins(app);
    app.use(router);
    app.mount('#app');
};

bootstrap();
