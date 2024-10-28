import webExtension from 'vite-plugin-web-extension-support-inject';
import { getManifest, additionalInputs } from '../../../src/manifest';

export const setupManifest = () => {
    return webExtension({
        manifest: getManifest(),
        additionalInputs: additionalInputs(),
        useDynamicUrlWebAccessibleResources: false,
    });
};
