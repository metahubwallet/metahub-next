export const css = {
    preprocessorOptions: {
        scss: {
            // 加载全局scss变量
            additionalData: `
                @import "@/assets/css/color.scss";
                `,
        },
    },
};
