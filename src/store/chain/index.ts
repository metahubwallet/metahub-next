import { ChainState } from './types';

export default defineStore('chain', {
    state: (): ChainState => ({
        currentChain: '',
        allTokens: {},
    }),
});
