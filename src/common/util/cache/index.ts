import { CacheKey } from './type';

interface CacheData {
    value: string;
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
        if (typeof data == 'object' && data.value) {
            // 超时清空
            if (typeof data.value === 'undefined' || (data.expire && data.expire < new Date().getTime())) {
                await localCache.remove(key);
                return defaultValue;
            } else {
                return JSON.parse(data.value);
            }
        } else {
            await localCache.remove(key);
            return defaultValue;
        }
    },

    async remove(key: CacheKey) {
        if (key == 'wallets') {
            // do not remove wallets
            return;
        }
        await chrome.storage.local.remove(key);
    },

    async upgrade() {
        // update data from version 1 to version 2
        const data = await chrome.storage.local.get('passwordHash');
        if (data && data.passwordHash) {
            console.log('start upgrade...');
            // old data
            const keys = [
                'networks',
                'wallets',
                'selectedRpc',
                'customRpcs',
                'selectedIndex',
                'passwordHash',
                'language',
                'whitelist',
                'recentTransfers',
                // 'allTokens', // don't need
                'userTokens',
            ];
            const states = await chrome.storage.local.get(keys);
            keys.forEach(k => {
                let nk = k;
                if (nk == 'selectedRpc') {
                    nk = 'selectedRpcs';
                } else if (nk == 'passwordHash') {
                    nk = 'passhash';
                }
                if (typeof states[k] == 'undefined' || states[k] === null) {
                    return;
                }
                let v = k == 'language' || k == 'passwordHash' ? states[k] : JSON.parse(states[k]);
                if (k == 'wallets') {
                    v = (v as any[]).map(x => {
                        if (x.account) {
                            delete x.account;
                        }
                        if (x.symbol) {
                            delete x.symbol;
                        }
                        return x;
                    });
                }
                localCache.set(nk as CacheKey, v);
            });
            await chrome.storage.local.remove('passwordHash');
            console.log('upgrade finished.');
        }
        
    },
};
