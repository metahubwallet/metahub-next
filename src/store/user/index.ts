import { UserState } from './type';

export default defineStore('user', {
    state: (): UserState => ({
        password: '',
        passwordHash: '',
    }),

    actions: {
        async init() {
            this.passwordHash = (await localCache.get('passwordHash', '')) as string;
        },
        async setPasswordHash(hash: string) {
            this.passwordHash = hash;
            await localCache.set('passwordHash', hash);
        },
    },
});
