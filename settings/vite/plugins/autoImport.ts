import AutoImport from 'unplugin-auto-import/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

export const autoImport = () => {
    return AutoImport({
        imports: [
            // 内置api
            'vue',
            'vue-router',
            'pinia',
            // 自定义api
            {
                '@/store': ['store'],
                '@/common/utils/env': ['env'],
                '@/common/plugins/axios': ['http'],
                '@/api': ['api'],
            },
        ],
        resolvers: [ElementPlusResolver()],
        // 声明文件位置
        dts: 'settings/declare/auto-imports.d.ts',
    });
};
