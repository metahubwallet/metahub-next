import Components from 'unplugin-vue-components/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';

export const setupComponent = () => {
    return Components({
        // 需要自动注册的组件目录
        dirs: ['src/**/component'],
        resolvers: [
            NaiveUiResolver(),
            (componentName) => {
                if (componentName.startsWith('Icon')) {
                    return { name: componentName.slice(4), from: '@icon-park/vue-next' };
                }
            },
        ],
        // 声明文件位置
        dts: 'config/declare/component.d.ts',
    });
};
