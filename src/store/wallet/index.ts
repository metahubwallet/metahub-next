import { Coin, Wallet, WalletState, WhiteItem } from './type';

export default defineStore('wallet', {
    state: (): WalletState => ({
        wallets: [
            {
                keys: [],
                seed: '',
                chainId: 'qweqwe',
                name: 'sdfd',
                symbol: 'eos',
                account: '12312123123123123123123123',
                isSelected: true,
                index: 1,
                chainName: '',
                privateKey: '',
                publicKey: '',
                smoothMode: true,
            },
        ],
        selectedIndex: -1,
        currentWallet: {
            keys: [],
            seed: '',
            chainId: 'qweqwe',
            name: 'sdfd',
            symbol: 'eos',
            account: '12312123123123123123123123',
            isSelected: true,
            index: 1,
            chainName: '',
            privateKey: '',
            publicKey: '',
            smoothMode: true,
        },
        walletCaches: {},
        whitelist: [
            {
                id: '',
                action: '123',
                actor: 'q',
                contract: 'z',
                domain: 2,
                hash: '',
                properties: {},
            },
            {
                id: '',
                action: '456',
                actor: 'w',
                contract: 'x',
                domain: 3,
                hash: '',
                properties: {
                    a: '123123',
                    b: '2223123',
                },
            },
            {
                id: '',
                action: '789',
                actor: 'e',
                contract: 'c',
                domain: 4,
                hash: '',
                properties: {},
            },
        ],
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

    actions: {
        async setWallets(wallets: Wallet[]) {
            this.wallets = wallets;
            await localCache.set('wallets', wallets);
        },
        async setSelectedIndex(index: number) {
            this.selectedIndex = index;
            await localCache.set('selectedIndex', index);
        },
        async setAllTokens(tokens: Record<string, Coin[]>) {
            this.allTokens = tokens;
            await localCache.set('allTokens', tokens);
        },
        async setUserTokens(coins: Coin[]) {
            this.userTokens = coins;
            await localCache.set('userTokens', coins);
        },
        async setWhitelist(list: WhiteItem[]) {
            this.whitelist = list;
            await localCache.set('whitelist', list);
        },
    },
});
