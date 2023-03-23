import vue from '@vitejs/plugin-vue';
import { Plugin } from 'vite';

import { autoImport } from './autoImport';
import { setupComponent } from './components';
import { setupManifest } from './manifest';

export const setupPlugins = () => {
    let plugins: Plugin[] = [vue()];

    plugins.push(setupManifest());
    plugins.push(autoImport());
    plugins.push(setupComponent());

    return plugins;
};
