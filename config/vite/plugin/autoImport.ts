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
                '@/common/util/env': ['env'],
                '@/common/plugin/axios': ['http'],
                '@/api': ['api'],
                '@/common/plugin/validate': ['yup', 'useForms'],
                '@/common/util/cache/index': ['localCache'],
                'vue-i18n': ['useI18n'],
                '@/common/util/tool': ['tool'],
            },
        ],
        // 声明文件位置
        dts: 'config/declare/auto-import.d.ts',
    });
};
