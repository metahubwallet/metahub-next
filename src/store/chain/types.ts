export interface ChainState {
    currentChain: string;
    allTokens: Record<string, Token[]>;
}

export interface Account {
    name: string;
    chainId: string;
}

export interface Token {
    chain: string;
    symbol: string;
    contract: string;
    precision: string;
    logo: string;
    isShow: boolean;
}
