import { eosChainId } from '@/common/util/network';
import { ChainState } from './type';
import { supportNetworks } from '@/common/util/network';
import { Network, RPC } from '@/types/settings';


export default defineStore('chain', {
    state: (): ChainState => {
        return {
            networks: [],
            currentNetwork: {} as Network,
            selectedRpcs: {},
            customRpcs: {},
        }
    },

    getters: {
        currentChain: (state) : string => {
            return state.currentNetwork.chain || 'eos';
        },
        currentChainId: (state) : string => {
            return state.currentNetwork.chainId || eosChainId;
        },
        findNetwork: (state) => (chainId: string) : Network => {
            const network = state.networks.find((x) => x.chainId == chainId);
            return network ?? state.networks[0];
        },
        selectedRpc: (state) => (chainId: string) : string => {
            let _selectedRpc = state.selectedRpcs[chainId];
            if (!_selectedRpc) {
                const network = state.networks.find((x) => x.chainId == chainId);
                return network ? network.endpoint : '';
            }
            return _selectedRpc;
        },
        currentSymbol: (state) => {
            const network = state.networks.find((x: Network) => x.chainId == state.currentNetwork.chainId);
            return network ? network.token.symbol : 'EOS';
        },
    },
    actions: {
        async init() {
            this.networks = (await localCache.get('networks', supportNetworks.slice(0, 3))) as Network[];
            let currentNetwork = await localCache.get('currentNetwork', null);
            if (!currentNetwork) {
                // compatible with old data
                const chainId = await localCache.get('currentChainId', '');
                if (chainId) {
                    currentNetwork = this.networks.find((x) => x.chainId == chainId);
                }
            } 
            this.currentNetwork = currentNetwork || this.networks[0];
            this.selectedRpcs = (await localCache.get('selectedRpcs', {}));
            this.customRpcs = (await localCache.get('customRpcs', {}));
        },
        async setNetworks(networks: Network[]) {
            this.networks = networks;
            await localCache.set('networks', networks);
        },
        async setCurrentNetwork(network: Network) {
            this.currentNetwork = network;
            await localCache.set('currentNetwork', network);
        },
        async setSelectedRpc(chainId: string, endpoint: string) {
            this.selectedRpcs[chainId] = endpoint;
            await localCache.set('selectedRpcs', this.selectedRpcs);
        },
        async setSelectedRpcs(endpoints: string[]) {
            await localCache.set('selectedRpcs', endpoints);
        },
        async setCustomRpcs(rpcs: Record<string, RPC[]>) {
            this.customRpcs = rpcs;
            await localCache.set('customRpcs', rpcs);
        },
    },
});

  
