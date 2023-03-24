import { createApp } from 'vue';
import { router } from '../../router';
import App from './App.vue';

import { setupPlugins } from '@/common/plugins';

const bootstrap = () => {
    const app = createApp(App);
    setupPlugins(app);
    app.use(router);
    app.mount('#app');
};

bootstrap();
