import { UserState } from './type';

export default defineStore('user', {
    state: (): UserState => ({
        password: '',
        passwordHash: '',
    }),
});
