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
        currentWallet: null,
        walletCaches: {},
        whitelist: [],
        recentTransfers: [],
        allTokens: {},
        userTokens: [
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
