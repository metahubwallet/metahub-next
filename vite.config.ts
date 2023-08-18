import { defineConfig } from 'vite';
import { setupPlugins } from './config/vite/plugin';
import { alias } from './config/vite/alias';
import { css } from './config/vite/css';
// import { env } from './src/common/util/env';

export default defineConfig({
    plugins: setupPlugins(),
    resolve: { alias },
    css,
    build: {
        // assetsInlineLimit: 100000,
        chunkSizeWarningLimit: 1000,
        // rollupOptions: {
        //     output: {
        //         inlineDynamicImports: true
        //     }
        // }
    },
});
