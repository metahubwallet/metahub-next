import { eosChainId } from '@/common/util/network';
import { ChainState, Network, RPC } from './type';
import { supportNetworks } from '@/common/util/network';


export default defineStore('chain', {
    state: (): ChainState => {
        return {
            networks: [],
            currentNetwork: {} as Network,
            rpcs: {},
            selectedRpc: {} as RPC,
            customRpcs: {},
        }
    },

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
        async init() {
            this.networks = (await localCache.get('networks', supportNetworks.slice(0, 3))) as Network[];
            this.currentNetwork = (await localCache.get('currentNetwork', this.networks[0])) as Network;
            this.selectedRpc = (await localCache.get('selectedRpc', null)) as RPC;
            this.customRpcs = (await localCache.get('customRpcs', null)) as any;
        },
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

  
