import { UserState } from './types';

export default defineStore('user', {
    state: (): UserState => ({
        password: '',
        passwordHash: '',
    }),
});
