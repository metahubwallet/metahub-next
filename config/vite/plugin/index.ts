import vue from '@vitejs/plugin-vue';
import { PluginOption } from 'vite';
import nodePolyfills from 'vite-plugin-node-stdlib-browser';
import removeConsole from "vite-plugin-remove-console";

import { autoImport } from './autoImport';
import { setupComponent } from './component';
import { setupManifest } from './manifest';

export const setupPlugins = () => {
    const plugins: PluginOption[] = [];
    plugins.push(vue());
    plugins.push(setupManifest());
    plugins.push(autoImport());
    plugins.push(setupComponent());
    plugins.push(nodePolyfills());
    plugins.push(removeConsole());

    return plugins;
};
