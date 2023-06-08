import { supportNetworks } from '@/common/util/network';
import { ChainState } from './type';

export default defineStore('chain', {
    state: (): ChainState => ({
        networks: supportNetworks,
        selectedRpc: {},
        customRpcs: {},
        currentChain: 'eos',
        currentChainId: '',
    }),
});
