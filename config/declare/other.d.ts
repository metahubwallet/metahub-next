// 声明Window
declare interface Window {
    msg: any;
    dialog: any;
    // inject wallet
    metahub: any;
    scatter: any;
}

declare module 'eos-rc-parser';
declare module 'eosjs-ecc';
declare module 'vite-plugin-node-stdlib-browser';
