import Components from 'unplugin-vue-components/vite';

export const setupComponent = () => {
    return Components({
        // 需要自动注册的组件目录
        dirs: ['src/components'],
        // 声明文件位置
        dts: 'settings/declare/components.d.ts',
    });
};
