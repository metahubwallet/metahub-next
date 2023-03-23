import vue from '@vitejs/plugin-vue';
import { Plugin } from 'vite';
import { setupManifest } from './manifest';

export const setupPlugins = () => {
    let plugins: Plugin[] = [vue()];
    plugins.push(setupManifest());

    return plugins;
};
