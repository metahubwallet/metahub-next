// 声明Window
declare interface Window {
    msg: any;
    dialog: any;
    // inject wallet
    metahub: any;
    scatter: any;
}

declare module 'vite-plugin-node-stdlib-browser';