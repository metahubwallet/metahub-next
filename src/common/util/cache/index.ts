import { CacheKey } from './type';

// 配置完后，到chrome://extensions刷新整个扩展
export const localCache = {
    set(key: CacheKey, value: any): void {
        new Promise(() => {
            if (!key) return;

            let data: any = {};
            if (typeof key == 'object') {
                data = key;
            } else if (typeof key == 'string') {
                if (typeof value != 'undefined' && typeof value !== 'string') {
                    value = JSON.stringify(value);
                }
                data[key] = value;
            } else return;

            chrome.storage.local.set(data, () => {});
        });
    },
    get(key: CacheKey, defaultValue: any = null) {
        return new Promise((resolve) => {
            chrome.storage.local.get(key, (items) => {
                if (Array.isArray(key)) {
                    resolve(items);
                    return;
                }
                let value = typeof items[key] != 'undefined' ? items[key] : defaultValue;
                if (typeof value == 'string' && (value.startsWith('[') || value.startsWith('{'))) {
                    value = JSON.parse(value);
                }
                resolve(value);
            });
        });
    },
};
