import vue from '@vitejs/plugin-vue';
import webExtension from '@samrum/vite-plugin-web-extension';
import { getManifest } from './src/manifest';
import { alias } from './settings/vite/alias';

export default (): any => {
    return {
        plugins: [
            vue(),
            webExtension({
                manifest: getManifest(),
            }),
        ],
        resolve: { alias },
    };
};
