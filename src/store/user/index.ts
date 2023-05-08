import { Account } from '../chain/types';
import { UserState } from './types';

export default defineStore('user', {
    state: (): UserState => ({
        password: '',
        passwordHash: '',
        wallets: [],
        walletCaches: {},
        selectedIndex: 0,
        userTokens: {},
        networks: null,
        selectedRpc: null,
        customRpcs: null,
        currentSymbol: '',
    }),
    getters: {
        currentWallet(state) {
            return state.wallets.length > 0 ? state.wallets[state.selectedIndex] : null;
        },
        currentUserTokens(state) {
            const account: Account = this.currentWallet;
            const key = account.name + '@' + account.chainId.substring(0, 16);
            return state.userTokens[key] ? state.userTokens[key] : [];
        },
    },
});
