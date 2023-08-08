import { eosChainId } from '@/common/util/network';
import { ChainState, Network, RPC } from './type';

export default defineStore('chain', {
    state: (): ChainState => ({
        networks: [],
        currentNetwork: {} as Network,
        rpcs: {},
        selectedRpc: {} as RPC,
        customRpcs: {},
    }),

    getters: {
        currentChain: (state) => {
            return state.currentNetwork.chain || 'eos';
        },
        currentChainId: (state) => {
            return state.currentNetwork.chainId || eosChainId;
        },
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
            const network = state.networks.find((x: Network) => x.chainId == state.currentNetwork.chainId);
            return network ? network.token.symbol : 'EOS';
        },
    },
    actions: {
        async setNetworks(networks: Network[]) {
            this.networks = networks;
            await localCache.set('networks', networks);
        },
        async setCurrentNetwork(network: Network) {
            this.currentNetwork = network;
            await localCache.set('currentNetwork', network);
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
