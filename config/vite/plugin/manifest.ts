import webExtension from '@samrum/vite-plugin-web-extension';
import { getManifest, additionalInputs } from '../../../src/manifest';

export const setupManifest = (): any => {
    return webExtension({
        manifest: getManifest(),
        additionalInputs: additionalInputs(),
    });
};
