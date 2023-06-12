import BigNumber from 'bignumber.js';

export const tool = {
    // 账号模糊
    briefAccount: (account: string, prefixLength = 6, subfixLength = 5) => {
        if (account.length <= 12) {
            return account;
        }
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
};
