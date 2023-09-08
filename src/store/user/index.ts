import { UserState } from './type';

export const useUserStore =  defineStore('user', {
    state: (): UserState => ({
        password: '',
        passhash: '',
    }),

    getters: {
        isLock: (state) => {
            console.log('call isLock');
            return state.password == '';
        },
        isInited: (state) => {
            console.log('call isInited');
            return state.passhash != '';
        }
    },

    actions: {
        async init() {
            console.log('call init');
            const result: any = (await chrome.storage.session.get(['password'])) ?? {};
            this.password = result.password as string || '';
            this.passhash = (await localCache.get('passhash', '')) as string;
        },
        async setLocked() {
            this.setPassword('');
        },
        async setPassword(password: string) {
            this.password = password;
            await chrome.storage.session.set({password: this.password});
        },
        async setPasshash(hash: string) {
            this.passhash = hash;
            await localCache.set('passhash', hash);
        },
    },
});
