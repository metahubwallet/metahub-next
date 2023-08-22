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
                'vue-i18n': ['useI18n'],
                '@/store': ['store'],
                '@/api': ['api'],
                '@/common/util/env': ['env'],
                '@/common/plugin/axios': ['http'],
                '@/common/plugin/validate': ['yup', 'useForms'],
                '@/common/util/cache/index': ['localCache'],
                '@/common/util/tool': ['tool'],
            },
        ],
        // 声明文件位置
        dts: 'config/declare/auto-import.d.ts',
    });
};
