import BigNumber from 'bignumber.js';

export const briefAccount = (account: string, prefixLength = 6, subfixLength = 5) => {
    if (account.length <= 12) {
        return account;
    }
    return (
        account.substr(0, prefixLength) + '...' + account.substr(subfixLength * -1, subfixLength)
    );
};

export function bignum(number: string, base = 10) {
    let num = isNaN(parseFloat(number)) ? 0 : number;
    return new BigNumber(num, base);
}
