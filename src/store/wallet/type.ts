export interface WalletState {
    wallets: Wallet[]; // 里面存储 eos 账号相关信息
    whitelist: WhiteItem[];
    recentTransfers: Transfer[]; // 最近转账记录
    allTokens: Token[];
    userTokens: Token[];
}

export interface Wallet {
    keys: string[];
    seed: string;
    chainId: string;
    name: string;
    symbol: string;

    account: {};
    isSelected: boolean;
    index: number;
    chainName: string;
}

export interface Token {
    symbol: string;
    contract: string;
    precision: string;
}

export interface WhiteItem {
    id: string;
    action: string;
    actor: string;
    contract: string;
    properties: string;
    domain: number;
}

export interface Transfer {
    account: Object;
}
