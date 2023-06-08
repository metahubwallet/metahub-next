import { ChainState } from './type';

export default defineStore('chain', {
    state: (): ChainState => ({
        networks: [],
        selectedRpc: {},
        customRpcs: {},
        currentChain: 'eos',
        currentChainId: '',
    }),
});
