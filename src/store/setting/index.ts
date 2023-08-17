import { SettingState } from './type';

export default defineStore('setting', {
    state: (): SettingState => ({
        language: 'zh-CN',
        isLock: true,
    }),
    actions: {
        async init() {
            const result: any = (await chrome.storage.session.get(['isLock'])) ?? {};
            this.isLock = result.isLock as boolean ?? true;
        },
        async setLang(lang: 'zh-CN' | 'en') {
            this.language = lang;
            await localCache.set('lang', lang);
        },
        async setIsLock(flag: boolean) {
            this.isLock = flag;
            await chrome.storage.session.set({isLock: this.isLock});
        },
    },
});
