import _ from 'lodash';
import axios from 'axios';
import chain from './chain.js';
import { Balance, Coin } from '@/store/wallet/type';

let manifestData = chrome.runtime.getManifest();

//https://wax.greymass.com/v1
const lightApis = {
    eos: 'https://eos.light-api.net',
    wax: 'https://wax.light-api.net',
    telos: 'https://telos.light-api.net',
    proton: 'https://proton.light-api.net',
    kylin: 'https://testnet-lightapi.eosams.xeos.me',
    'telos-test': 'https://testnet-lightapi.eosams.xeos.me',
    'wax-test': 'https://testnet-lightapi.eosams.xeos.me',
    'proton-test': 'https://testnet-lightapi.eosams.xeos.me',
};

const hyperionApis = {
    eos: 'https://eos.hyperion.eosrio.io', //https://api.eossweden.org/v2
    bos: 'https://api.bossweden.org',
    wax: 'https://wax.eosrio.io',
    telos: 'https://telos.eosrio.io', // https://mainnet.telos.net/v2
    proton: 'https://proton.cryptolions.io',
    kylin: 'https://kylin.eossweden.org',
    jungle: 'https://jungle.eossweden.org',
    jungle3: 'https://jungle3.eosrio.io',
    'bos-test': 'https://tst.bossweden.org',
    'telos-test': 'https://testnet.telos.net',
    'wax-test': 'https://testnet.wax.pink.gg',
    'proton-test': 'https://testnet.protonchain.com',
};

export type lightKey =
    | 'eos'
    | 'wax'
    | 'telos'
    | 'proton'
    | 'kylin'
    | 'telos-test'
    | 'wax-test'
    | 'proton-test';

type hyperionKey =
    | 'eos'
    | 'bos'
    | 'wax'
    | 'telos'
    | 'proton'
    | 'kylin'
    | 'jungle'
    | 'jungle3'
    | 'bos-test'
    | 'telos-test'
    | 'wax-test'
    | 'proton-test';

export const isSupportChain = (chain: string) => {
    return hyperionApis[chain as hyperionKey] ? true : false;
};

export const getEndpoints = async (chainId = store.chain().currentChainId) => {
    try {
        const chain = store.chain().findNetwork(chainId)?.chain;
        let res = await axios.get(
            `https://cdn.jsdelivr.net/gh/metahubwallet/chain-rpcs@master/${chain}-rpcs.json`
        );
        return res ? res.data : [];
    } catch (e) {
        return [];
    }
};

export const getKeyAccounts = async (chain: lightKey, publicKey: string) => {
    try {
        if (!lightApis[chain]) return [];

        let res = await axios.get(lightApis[chain] + '/api/key/' + publicKey);
        if (res.status == 200 && res.data) {
            const ckey = chain.replace('-', '');
            if (res.data[ckey]) {
                const accounts = res.data[ckey].accounts;
                return Object.keys(accounts);
            }
        }
    } catch (e) {
        console.error(e);
    }
    return [];
};

export const getBalanceList = async (
    account: string,
    tokens: Coin[],
    onBlanceInquired: Function
) => {
    try {
        // to use: http://light-api/api/account/CHAIN/ACCOUNT
        const balances = [] as Balance[];
        for (const t of tokens) {
            const balance = await chain.get().getCurrencyBalance(t.contract, account, t.symbol);
            const amount = balance ? parseFloat(balance.split(' ')[0]) : 0;
            const item: Balance = { ...t, amount };
            balances.push(item);
            if (typeof onBlanceInquired == 'function') {
                onBlanceInquired(item);
            }
        }
        return balances;
    } catch (e) {
        console.error(e);
        return [];
    }
};

export const getBpInfo = async () => {
    return { data: [], code: 1, msg: '' };
};

export const getTransactionList = async (chain: string, data: any) => {
    try {
        if (!hyperionApis[chain as hyperionKey]) return [];

        let url =
            hyperionApis[chain as hyperionKey] +
            '/v2/history/get_actions?' +
            new URLSearchParams(data).toString();
        let res = await axios.get(url);
        const actions = res.data && res.data.actions ? res.data.actions : [];
        actions.map((i: any) => {
            let action = {} as any;
            action.receiver = i.act.data.to;
            action.sender = i.act.data.from;
            action.quantity = i.act.data.quantity;
            action.memo = i.act.data.memo;
            return action;
        });
        return actions;
    } catch (e) {
        console.error(e);
        return [];
    }
};
