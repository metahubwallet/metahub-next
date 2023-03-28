import { SettingState } from './types';

export default defineStore('setting', {
    state: (): SettingState => ({
        language: localCache.get('language') || 'zh-CN',
        isLock: false,
    }),
});
