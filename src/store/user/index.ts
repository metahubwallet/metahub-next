import { UserState } from './type';

export default defineStore('user', {
    state: (): UserState => ({
        password: '',
        passwordHash: '',
    }),

    actions: {
        async init() {
            const result: any = (await chrome.storage.session.get(['isLock'])) ?? {};
            this.password = result.password as string || '';
            this.passwordHash = (await localCache.get('passwordHash', '')) as string;
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
