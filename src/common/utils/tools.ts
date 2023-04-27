import BigNumber from 'bignumber.js';
import moment from 'moment';

export const briefAccount = (account: string, prefixLength = 6, subfixLength = 5) => {
    if (account.length <= 12) {
        return account;
    }
    return (
        account.substr(0, prefixLength) + '...' + account.substr(subfixLength * -1, subfixLength)
    );
};

export const bignum = (number: string, base = 10) => {
    let num = isNaN(parseFloat(number)) ? 0 : number;
    return new BigNumber(num, base);
};

export const randomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min) + min);
};

export const timeUtcFormat = (utcDate: string) => {
    return moment(new Date(moment.utc(utcDate))).format('YYYY/MM/DD HH:mm:ss');
};
