import AutoImport from 'unplugin-auto-import/vite';

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
                '@/common/plugins/validate': ['yup', 'useForms'],
            },
        ],
        // 声明文件位置
        dts: 'settings/declare/auto-imports.d.ts',
    });
};
