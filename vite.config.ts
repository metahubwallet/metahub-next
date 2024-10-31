import { defineConfig } from 'vite';
import { resolve } from 'path';
import { setupMainPlugins, setupContentPlugins } from './config/vite/plugin';
import { alias } from './config/vite/alias';
import { css } from './config/vite/css';
// import { env } from './src/common/util/env';

const mainConfig = defineConfig({
    plugins: setupMainPlugins(),
    resolve: { alias },
    css,
    build: {
        chunkSizeWarningLimit: 1000,
        // rollupOptions: {
        //     output: {
        //         entryFileNames: (chunkInfo) => {
        //             console.log(chunkInfo.name, chunkInfo.type);
        //             return '[name].[hash].js';
        //         }
        //     }
        // }
    },
    esbuild: {
        // drop: ['console', 'debugger'],
    },
});

const contentConfig = defineConfig({
    plugins: setupContentPlugins(),
    resolve: { alias },
    css,
    build: {
        emptyOutDir: false,
        rollupOptions: {
            input: {
                'content': resolve(__dirname, 'src/entries/contentScript/content.ts')
            },
            output: {
                entryFileNames: (chunkInfo) => {
                    // console.log(chunkInfo.name, chunkInfo.type);
                    return 'inpage.js';
                },
                inlineDynamicImports: true,
            }
        }
    },
});

export default ({ mode } : { mode: string }) => {
    if (mode === 'content') {
      return contentConfig;
    }
    return mainConfig;
};