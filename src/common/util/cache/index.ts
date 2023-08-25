import { CacheKey } from './type';

interface CacheData {
    value: any;
    expire?: number;
}

// 配置完后，到chrome://extensions刷新整个扩展
export const localCache = {
    async set(key: CacheKey, value: any, liveSeconds?: number): Promise<void> {
        const data: CacheData = { value: JSON.stringify(value) };
        if (liveSeconds) {
            data.expire = new Date().getTime() + liveSeconds * 1000;
        }
        await chrome.storage.local.set({ [key]: data }, () => {});
    },

    async get(key: CacheKey, defaultValue: any = null): Promise<any> {
        const items = await chrome.storage.local.get(key);
        const data = items[key];
        if (typeof data == 'object') {
            // 超时清空
            if (typeof data.value === 'undefined' || (data.expire && data.expire < new Date().getTime())) {
                await localCache.remove(key);
                return defaultValue;
            } else {
                return JSON.parse(data.value);
            }
        } else {
            return defaultValue;
        }
    },

    async remove(key: CacheKey) {
        await chrome.storage.local.remove(key);
    },
};
