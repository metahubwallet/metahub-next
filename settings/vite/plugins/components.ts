import Components from 'unplugin-vue-components/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';

export const setupComponent = () => {
    return Components({
        // 需要自动注册的组件目录
        dirs: ['src/components'],
        resolvers: [NaiveUiResolver()],
        // 声明文件位置
        dts: 'settings/declare/components.d.ts',
    });
};
