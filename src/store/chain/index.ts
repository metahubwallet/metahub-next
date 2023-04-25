import { ChainState, Network, Token } from './types';

export default defineStore('chain', {
    state: (): ChainState => ({
        currentChain: 'eos',
        currentChainId: '',
        currentNetwork: {} as Network,
        networks: [],
        allTokens: {},
        rpc: {},
        whitelist: [],
    }),
    getters: {
        findNetwork: (state) => (chainId: string) => {
            return state.networks.find((x) => x.chainId == chainId);
        },
        selectedRpc: (state) => (chainId: string) => {
            let selectedRpc = state.rpc[chainId];
            if (!selectedRpc) {
                const network = state.networks.find((x) => x.chainId == chainId);
                return network ? network.endpoint : '';
            }
            return selectedRpc;
        },
        getOneToken: (state) => (token: Token) => {
            const chainToken = state.allTokens[token.chain] || {};
            const k: any = `${token.contract}-${token.symbol}`;
            return chainToken[k] || {};
        },
    },
});
