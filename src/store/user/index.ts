import { UserState } from './type';

export const useUserStore =  defineStore('user', {
    state: (): UserState => ({
        password: '',
        passwordHash: '',
    }),

    getters: {
        isLock: (state) => {
            console.log('call isLock');
            return state.password == '';
        },
        isInited: (state) => {
            console.log('call isInited');
            return state.passwordHash != '';
        }
    },

    actions: {
        async init() {
            console.log('call init');
            const result: any = (await chrome.storage.session.get(['password'])) ?? {};
            this.password = result.password as string || '';
            this.passwordHash = (await localCache.get('passwordHash', '')) as string;
        },
        async setLocked() {
            this.setPassword('');
        },
        async setPassword(password: string) {
            this.password = password;
            await chrome.storage.session.set({password: this.password});
        },
        async setPasswordHash(hash: string) {
            this.passwordHash = hash;
            await localCache.set('passwordHash', hash);
        },
    },
});
