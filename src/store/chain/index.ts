import { eosChainId, supportNetworks } from '@/common/util/network';
import { ChainState, Network } from './type';

export default defineStore('chain', {
    state: (): ChainState => ({
        networks: supportNetworks,
        currentNetwork: {} as Network,
        selectedRpc: {},
        customRpcs: {},
        currentChain: 'eos',
        currentChainId: eosChainId,
    }),

    getters: {
        findNetwork: (state) => (chainId: string) => {
            return state.networks.find((x) => x.chainId == chainId);
        },
    },
});
