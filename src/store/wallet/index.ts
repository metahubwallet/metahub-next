import { Coin, Wallet, WalletState, WhiteItem } from './type';

export default defineStore('wallet', {
    state: (): WalletState => ({
        wallets: [],
        selectedIndex: -1,
        currentWallet: {} as Wallet,
        walletCaches: {},
        whitelist: [],
        recentTransations: [],
        allTokens: {},
        userTokens: [],
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
