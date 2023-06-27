import { CacheKey } from './type';

interface CacheData {
    value: any;
    expire?: number;
}

// 配置完后，到chrome://extensions刷新整个扩展
export const localCache = {
    async set(key: CacheKey, value: any, liveSeconds?: number) {
        new Promise(() => {
            let data: CacheData = { value };
            if (liveSeconds) data.expire = new Date().getTime() + liveSeconds * 1000;
            chrome.storage.local.set({ [key]: data }, () => {});
        });
    },

    async get(key: CacheKey, defaultValue: any = null) {
        return new Promise((resolve) => {
            chrome.storage.local.get(key, (items) => {
                let data = items[key];
                if (data) {
                    // 超时清空
                    if (data.expire && data.expire < new Date().getTime()) {
                        localCache.remove(key).then(() => {
                            resolve(defaultValue);
                        });
                    } else resolve(data.value);
                } else resolve(defaultValue);
            });
        });
    },

    async remove(key: CacheKey) {
        chrome.storage.local.remove(key, () => {});
    },
};
