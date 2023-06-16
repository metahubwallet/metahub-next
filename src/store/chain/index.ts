import { eosChainId, supportNetworks } from '@/common/util/network';
import { ChainState, Network, RPC } from './type';

export default defineStore('chain', {
    state: (): ChainState => ({
        networks: supportNetworks,
        currentNetwork: {} as Network,
        rpcs: {},
        selectedRpc: {} as RPC,
        customRpcs: {},
        currentChain: 'eos',
        currentChainId: eosChainId,
    }),

    getters: {
        findNetwork: (state) => (chainId: string) => {
            return state.networks.find((x) => x.chainId == chainId);
        },
        getSelectedRpc: (state) => (chainId: string) => {
            let selectedRpc = state.rpcs[chainId];
            if (!selectedRpc) {
                const network = state.networks.find((x) => x.chainId == chainId);
                return network ? network.endpoint : '';
            }
            return selectedRpc;
        },
    },
});
