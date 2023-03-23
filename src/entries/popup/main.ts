import { createApp } from 'vue';
import { router } from '../../router';
import App from './App.vue';
import 'element-plus/dist/index.css';

// todo: 弃用element ui，改用 naive ui

const app = createApp(App);
app.use(router);
app.mount('#app');
