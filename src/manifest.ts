import pkg from '../package.json';

const manifest: Partial<chrome.runtime.ManifestV3> = {
    action: {
        default_icon: {
            16: 'icons/16.png',
            32: 'icons/32.png',
            64: 'icons/64.png',
        },
        default_popup: 'src/entries/popup/index.html',
    },
    background: {
        service_worker: 'src/entries/background/main.ts',
    },
    content_scripts: [
        {
            js: ['src/entries/contentScript/main.ts'],
            matches: ['*://*/*'],
            run_at: 'document_start',
        },
    ],
    host_permissions: ['*://*/*'],
    icons: {
        16: 'icons/16.png',
        32: 'icons/32.png',
        64: 'icons/64.png',
        128: 'icons/128.png',
    },
    options_ui: {
        page: 'src/entries/options/index.html',
        open_in_tab: true,
    },
    // web_accessible_resources: [
    //     {
    //       resources: ['src/entries/contentScript/content.ts'],
    //       matches: [ '*://*/*' ],
    //     },
    // ],
    permissions: ['storage', 'unlimitedStorage', 'alarms'],
};

export function getManifest(): chrome.runtime.ManifestV3 {
    return {
        author: pkg.author,
        description: pkg.description,
        name: pkg.displayName ?? pkg.name,
        version: pkg.version,
        manifest_version: 3,
        ...manifest,
    };
}

export function additionalInputs() {
    return {
        scripts: [
            {
                fileName: 'src/entries/contentScript/content.ts',
                webAccessible: true,
            }
        ],
    };
}
