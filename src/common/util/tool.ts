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

    // 随机整数
    randomInt: (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min) + min);
    },
};
