import { SettingState } from './type';

export default defineStore('setting', {
    state: (): SettingState => ({
        language: 'zh-CN',
    }),
    actions: {
        async init() {
        },
        async setLang(lang: 'zh-CN' | 'en') {
            this.language = lang;
            await localCache.set('lang', lang);
        },
    },
});
