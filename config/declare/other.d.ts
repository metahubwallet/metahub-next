// 声明Window
declare interface Window {
    msg: any;
    dialog: any;
    // inject wallet
    metahub: any;
    scatter: any;
}

declare module 'vite-plugin-node-stdlib-browser';

declare module 'eosjs-ecc' {
    import { ecc } from 'eosjs/dist/eosjs-ecc-migration';
    export default ecc;
}  
