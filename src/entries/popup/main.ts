import { createApp } from 'vue';
import { setupRouter } from '@/router';
import App from './App.vue';

import { setupPlugins } from '@/common/plugins';

const bootstrap = () => {
    const app = createApp(App);

    setupPlugins(app);
    setupRouter(app);
    app.mount('#app');
};

bootstrap();
