import { SettingState } from './type';

export default defineStore('setting', {
    state: (): SettingState => ({
        language: 'zh-CN',
        isLock: true,
    }),
    actions: {
        async setLang(lang: 'zh-CN' | 'en') {
            this.language = lang;
            await localCache.set('lang', lang);
        },
        async setIsLock(flag: boolean) {
            this.isLock = flag;
            await localCache.set('isLock', flag, 60 * 60 * 24);
        },
    },
});
