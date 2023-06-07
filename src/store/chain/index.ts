import { ChainState } from './type';

export default defineStore('chain', {
    state: (): ChainState => ({
        networks: [],
        selectedRpc: {},
        customRpcs: {},
        selectedIndex: 0,
        currentChain: 'eos',
        currentChainId: '',
    }),
});
