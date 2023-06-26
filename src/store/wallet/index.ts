import { Coin, WalletState } from './type';

export default defineStore('wallet', {
    state: (): WalletState => ({
        wallets: [
            {
                keys: [],
                seed: '',
                chainId: '',
                name: '',
                symbol: '',
                account: '',
                isSelected: true,
                index: 1,
                chainName: '',
                privateKey: '',
                publicKey: '',
            },
        ],
        selectedIndex: -1,
        currentWallet: {
            keys: [],
            seed: '',
            chainId: '',
            name: '',
            symbol: '',
            account: '12312123123123123123123123',
            isSelected: true,
            index: 1,
            chainName: '',
            privateKey: '',
            publicKey: '',
        },
        walletCaches: {},
        whitelist: [],
        recentTransations: [
            {
                sender: '11',
                receiver: '22',
                quantity: 12,
                memo: '123123',
                time: 23,
                symbol: '',
                contract: '',
            },
            {
                sender: '11',
                receiver: '22',
                quantity: 12,
                memo: '123123',
                time: 23,
                symbol: '',
                contract: '',
            },
        ],
        allTokens: {},
        userTokens: [
            {
                amount: 1,
                chain: '',
                contract: '',
                precision: 0,
                symbol: '',
            },
            {
                amount: 1,
                chain: '',
                contract: '',
                precision: 0,
                symbol: '',
            },
            {
                amount: 1,
                chain: '',
                contract: '',
                precision: 0,
                symbol: '',
            },
            {
                amount: 1,
                chain: '',
                contract: '',
                precision: 0,
                symbol: '',
            },
            {
                amount: 1,
                chain: '',
                contract: '',
                precision: 0,
                symbol: '',
            },
            {
                amount: 1,
                chain: '',
                contract: '',
                precision: 0,
                symbol: '',
            },
        ],
    }),

    getters: {
        getCoin: (state) => (coin: Coin) => {
            const chainToken = state.allTokens[coin.chain] || {};
            const k: any = `${coin.contract}-${coin.symbol}`;
            return chainToken[k] || {};
        },
    },
});
