import { WhiteItem } from '@/types/settings';
import { SettingState } from './type';

export const useSettingStore = defineStore('setting', {
    state: (): SettingState => ({
        language: 'zh-CN',
        whitelist: [],
    }),
    actions: {
        async init() {
        },
        async setLang(lang: 'zh-CN' | 'en') {
            this.language = lang;
            await localCache.set('language', lang);
        },
        async setWhitelist(list: WhiteItem[]) {
            this.whitelist = list;
            await localCache.set('whitelist', list);
        },
    },
});
