import webExtension from '@samrum/vite-plugin-web-extension';
import { getManifest } from '../../../src/manifest';

export const setupManifest = (): any => {
    return webExtension({
        manifest: getManifest(),
    });
};
