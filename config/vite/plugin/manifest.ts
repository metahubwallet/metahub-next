import webExtension from 'vite-plugin-web-extension-support-inject';
import { getManifest, additionalInputs } from '../../../src/manifest';

export const setupManifest = (): any => {
    return webExtension({
        manifest: getManifest(),
        additionalInputs: additionalInputs(),
    });
};
