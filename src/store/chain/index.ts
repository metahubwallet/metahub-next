import { ChainState, Network, Token, WhiteItem } from './types';
import _ from 'lodash';

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
    actions: {
        delWhiteObjs(deleteArray: WhiteItem[]) {
            this.whitelist = this.whitelist.filter((oldItem: WhiteItem) => {
                let isNeed = true;
                deleteArray.forEach((delItem: WhiteItem) => {
                    if (_.isEqual(oldItem, delItem)) isNeed = false;
                });
                return isNeed;
            });
            localCache.set('whitelist', this.whitelist);
        },
    },
});
