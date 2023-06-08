import { SettingState } from './type';

export default defineStore('setting', {
    state: (): SettingState => ({
        language: 'zh-CN',
        isLock: true,
    }),
});
