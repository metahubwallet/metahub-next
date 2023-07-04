import vue from '@vitejs/plugin-vue';
import { Plugin } from 'vite';
import nodePolyfills from 'vite-plugin-node-stdlib-browser';

import { autoImport } from './autoImport';
import { setupComponent } from './component';
import { setupManifest } from './manifest';

export const setupPlugins = () => {
    let plugins: Plugin[] = [vue()];

    plugins.push(setupManifest());
    plugins.push(autoImport());
    plugins.push(setupComponent());
    plugins.push(nodePolyfills());

    return plugins;
};
