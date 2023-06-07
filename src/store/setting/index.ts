import { SettingState } from './types';

export default defineStore('setting', {
    state: (): SettingState => ({
        language: 'zh-CN',
        isLock: true,
    }),
});
