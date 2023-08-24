import { CacheABI } from '@/types/settings';
import BigNumber from 'bignumber.js';
import moment from 'moment';

export const tool = {
    // 账号模糊
    briefAccount: (account: string, prefixLength = 6, subfixLength = 5) => {
        if (account.length <= 12) return account;

        return (
            account.substring(0, prefixLength) +
            '...' +
            account.substring(subfixLength * -1, subfixLength)
        );
    },

    // 转BigNumber
    bignum: (number: string, base = 10) => {
        let num = isNaN(parseFloat(number)) ? 0 : number;
        return new BigNumber(num, base);
    },

    // 时间格式化
    timeFormat: (date: string | number) => {
        return moment(date).format('YYYY/MM/DD HH:mm:ss');
    },

    // 读写CacheABI
    getCachedABI: async (chainId: string, contract: string) => {
        const cachedAbis = (await localCache.get('cachedAbis', [])) as CacheABI[];
        const cachedAbi = cachedAbis.find((x) => x.chainId == chainId && x.contract == contract);
        return cachedAbi ? cachedAbi : '';
    },
    setCacheABI: async (abi: CacheABI) => {
        const cachedAbis = (await localCache.get('cachedAbis', [])) as CacheABI[];
        const index = cachedAbis.findIndex(
            (x) => x.chainId == abi.chainId && x.contract == abi.contract
        );
        if (index >= 0) {
            cachedAbis[index] = abi;
        } else {
            cachedAbis.push(abi);
        }
        await localCache.set('cachedAbis', cachedAbis);
    },

    // 随机整数
    randomInt: (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min) + min);
    },
};
