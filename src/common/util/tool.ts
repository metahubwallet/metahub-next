export const briefAccount = (account: string, prefixLength = 6, subfixLength = 5) => {
    if (account.length <= 12) {
        return account;
    }
    return (
        account.substring(0, prefixLength) +
        '...' +
        account.substring(subfixLength * -1, subfixLength)
    );
};
