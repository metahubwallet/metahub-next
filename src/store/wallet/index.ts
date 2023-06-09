import { WalletState } from './type';

export default defineStore('wallet', {
    state: (): WalletState => ({
        wallets: [],
        selectedIndex: -1,
        currentWallet: null,
        whitelist: [],
        recentTransfers: [],
        allTokens: {},
        userTokens: [],
    }),
});
