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
            },
        ],
        selectedIndex: -1,
        currentWallet: null,
        walletCaches: {},
        whitelist: [],
        recentTransfers: [],
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
});
