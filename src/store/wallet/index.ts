import { Coin, Transation, Wallet, WalletState, WhiteItem } from './type';

export default defineStore('wallet', {
    state: (): WalletState => ({
        wallets: [],
        selectedIndex: 0,
        walletCaches: {},
        whitelist: [],
        recentTransations: [],
        allTokens: {},
        userTokens: {},
    }),

    getters: {
        getCoin: (state) => (coin: Coin) => {
            const chainToken = state.allTokens[coin.chain] || {};
            const k: any = `${coin.contract}-${coin.symbol}`;
            return chainToken[k] || {};
        },
        currentWallet: (state) => {
            return state.wallets[state.selectedIndex];
        },
        currentWalletKey(): string {
            const account = this.currentWallet;
            return account.name + '@' + account.chainId.substring(0, 16);
        },
        currentUserTokens(state): Coin[] {
            const key = this.currentWalletKey;
            return state.userTokens[key] ? state.userTokens[key] : [];
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
        async setUserTokens(tokens: Record<string, Coin[]>) {
            this.userTokens = tokens;
            await localCache.set('userTokens', tokens);
        },
        async setCurrentUserTokens(tokens: Coin[]) {
            this.userTokens[this.currentWalletKey] = tokens;
            await localCache.set('userTokens', this.userTokens);
        },
        async setWhitelist(list: WhiteItem[]) {
            this.whitelist = list;
            await localCache.set('whitelist', list);
        },
        async setRecentTransation(recent: Transation) {
            this.recentTransations.push(recent);
            await localCache.set('recentTransations', this.recentTransations);
        },
    },
});
