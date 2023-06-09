import Components from 'unplugin-vue-components/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';

export const setupComponent = () => {
    return Components({
        // 需要自动注册的组件目录
        dirs: ['src/**/components', 'src/entries'],
        resolvers: [
            NaiveUiResolver(),
            // iconpark组件按需引入
            (componentName) => {
                if (componentName.startsWith('Icon')) {
                    return { name: componentName.slice(4), from: '@icon-park/vue-next' };
                }
            },
        ],
        // 声明文件位置
        dts: 'settings/declare/components.d.ts',
    });
};
