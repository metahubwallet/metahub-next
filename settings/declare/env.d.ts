/// <reference types="vite/client" />
/// <reference types="@samrum/vite-plugin-web-extension/client" />

declare module '*.vue' {
    import type { DefineComponent } from 'vue';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

// 声明环境变量类型
declare interface MetaEnv {
    VITE_ENV: string;
}
