import { WalletState } from './type';
import localTokens from '@/assets/json/tokens.json';
import axios from 'axios';
import chain from '../chain';
import { Balance, Coin } from '@/types/tokens';
import { Wallet } from '@/types/wallet';
import { TransferRecord } from '@/types/transcation';

type AllTokens = { [key: string]: Coin[] };

const store = defineStore('wallet', {
    state: (): WalletState => ({
        wallets: [],
        selectedIndex: 0,
        walletCaches: {},
        recentTransfers: [],
        allTokens: {},
        userTokens: {},
    }),

    getters: {
        getToken: (state) => (token: Coin) : Coin => {
            const _chain = token.chain ?? chain().currentChain;
            const chainTokens = state.allTokens[_chain] ?? [];
            const result = chainTokens.find(t => t.contract == token.contract && t.symbol == token.symbol);
            return result ? result : {} as Coin;
        },
        currentWallet: (state) => {
            return state.wallets[state.selectedIndex];
        },
        chainTokens(state): Coin[] {
            const currentChain = chain().currentChain;
            return state.allTokens[currentChain] ? state.allTokens[currentChain] : [];
        },
        currentWalletKey(): string {
            const account = this.currentWallet;
            return account.name + '@' + account.chainId.substring(0, 16);
        },
        currentUserTokens(state): Balance[] {
            const key = this.currentWalletKey;
            return state.userTokens[key] ? state.userTokens[key] : [];
        },
    },

    actions: {
        async init() {
            this.wallets = (await localCache.get('wallets', [])) as Wallet[];
            this.selectedIndex = (await localCache.get('selectedIndex', 0)) as number;
            this.recentTransfers = (await localCache.get('recentTransfers', [])) as TransferRecord[];
            this.allTokens = await initTokens();
        },
        async setWallets(wallets: Wallet[]) {
            this.wallets = wallets;
            await localCache.set('wallets', wallets);
        },
        async setSelectedIndex(index: number) {
            this.selectedIndex = index;
            await localCache.set('selectedIndex', index);
        },
        async setAllTokens(tokens: AllTokens) {
            this.allTokens = tokens;
            await localCache.set('allTokens', tokens);
        },
        async setUserTokens(tokens: { [key: string]: Balance[] }) {
            this.userTokens = tokens;
            await localCache.set('userTokens', tokens);
        },
        async setCurrentUserTokens(coins: Balance[]) {
            this.userTokens[this.currentWalletKey] = coins;
            await localCache.set('userTokens', this.userTokens);
        },
        async addRecentTransfer(recent: TransferRecord) {
            const recentTransfers = this.recentTransfers.filter(oldItem => {
                return oldItem.account !== recent.account &&  oldItem.memo !== recent.memo;
            });
            // max 100
            if (recentTransfers.length > 99) {
                recentTransfers.splice(99, recentTransfers.length - 99);
            }
            // add
            recentTransfers.unshift(recent);
            this.recentTransfers = recentTransfers;
            // save
            await localCache.set('recentTransfers', recentTransfers);
        },
    },
});

export default store;


const getLocalTokens = () => {
    const tokens: Coin[] = [];
    localTokens.forEach(t => {
        tokens.push({...t, logo: ''});
    });
    return tokens;
}

// 更新token
const initTokens = async (): Promise<AllTokens> => {
    // get tokens form local
    const tokenData = await localCache.get('allTokens', {}) as { tokens: AllTokens; updateAt: number };
    let tokensUpdateAt = 0;
    let allTokens: AllTokens;
    if (!tokenData || !tokenData.tokens) {
      console.log('--- get tokens form local ---');
      allTokens = getTokensFromJson(getLocalTokens());
      tokensUpdateAt = Date.now();
      localCache.set('allTokens', { tokens: allTokens, updateAt: Date.now() });
    } else {
      console.log('--- get tokens form storage ---');
      allTokens = tokenData.tokens;
      tokensUpdateAt = tokenData.updateAt;
    }
    if (Date.now() - tokensUpdateAt > 86400000) {
      console.log('--- update tokens ---');
      // update tokens
      setTimeout(updateTokens, 1);
    }
    return allTokens;
};

const getTokensFromJson = (tokenArray: Coin[]) : AllTokens => {
    let tokenMap = {} as AllTokens;
    for (const token of tokenArray) {
        if (typeof tokenMap[token.chain] == 'undefined') {
            tokenMap[token.chain] = [];
        }
        const name = `${token.chain}/${token.contract}-${token.symbol}.png`.toLowerCase();
        token.logo = 'https://cdn.jsdelivr.net/gh/metahubwallet/eos-tokens@master/logos/' + name;
        tokenMap[token.chain].push(token);
    }
    return tokenMap;
};

const updateTokens = () => {
    const url = 'https://cdn.jsdelivr.net/gh/metahubwallet/eos-tokens@master/tokens.json';
    axios
        .get(url)
        .then(function(response) {
        const tokenArray = typeof response.data == 'string' ? JSON.parse(response.data) : response.data;
        // console.log(tokenArray);
        const tokenMap = getTokensFromJson(tokenArray);

        //store.dispatch('setAllTokens', tokenMap);
        store().setAllTokens(tokenMap);

        console.log('--- tokens updated');
        })
        .catch(function(error) {
        // handle error  update time?
        console.log(error);
    });
}