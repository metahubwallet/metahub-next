import { UserState } from './types';

export default defineStore('user', {
    state: (): UserState => ({
        passwordHash: '',
        wallets: [],
        selectedIndex: 0,
    }),
    getters: {
        currentWallet: (state) => {
            return state.wallets.length > 0 ? state.wallets[state.selectedIndex] : null;
        },
    },
});
