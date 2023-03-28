import { UserState } from './types';

export default defineStore('user', {
    state: (): UserState => ({
        password: '',
        passwordHash: '',
        wallets: [],
        selectedIndex: 0,
        userTokens: '',
        networks: null,
        selectedRpc: null,
        customRpcs: null,
    }),
    getters: {
        currentWallet: (state) => {
            return state.wallets.length > 0 ? state.wallets[state.selectedIndex] : null;
        },
    },
});
