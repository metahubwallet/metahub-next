export interface ChainState {
    currentChain: hyperionKey;
    currentChainId: string;
    currentNetwork: Network;
    networks: Array<any>;
    allTokens: Record<string | number, Token[]>;
    rpc: any;
    whitelist: WhiteItem[];
}

export interface Account {
    name: string;
    chainId: string;
}

export interface Token {
    id?: number;
    chain: string;
    symbol: string;
    contract: string;
    precision: string;
    logo: string;
    isShow: boolean;
    amount: number;
}

export interface Action {
    receiver: string;
    sender: string;
    quantity: string;
    memo: string;
}

export interface Authorization {
    actor: string;
    permission: string;
}

export interface Network {
    chain: string;
    chainId: string;
    name: string;
    token: any;
    endpoint?: any;
}

export type hyperionKey =
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

export interface WhiteItem {
    domain: any;
    actor: any;
    contract: string;
}
