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
        currentSymbol: (state) => {
            const network = state.networks.find((x: Network) => x.chainId == state.currentChainId);
            return network ? network.token.symbol : 'EOS';
        },
    },
    actions: {
        async setNetworks(networks: Network[]) {
            this.networks = networks;
            await localCache.set('networks', networks);
        },
        async setSelectedRpc(rpc: RPC) {
            this.selectedRpc = rpc;
            await localCache.set('selectedRpc', rpc);
        },
        async setCustomRpcs(rpcs: Record<string, RPC[]>) {
            this.customRpcs = rpcs;
            await localCache.set('customRpcs', rpcs);
        },
    },
});
