import { WalletState } from './type';

export default defineStore('wallet', {
    state: (): WalletState => ({
        wallets: [],
        whitelist: [],
        recentTransfers: [],
        allTokens: [],
        userTokens: [],
    }),
});
