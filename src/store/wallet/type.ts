export interface WalletState {
    wallets: Wallet[]; // 里面存储 eos 账号相关信息
    selectedIndex: number; // 当前选中钱包的索引
    currentWallet: Wallet | null; // 当前选中钱包
    whitelist: WhiteItem[];
    recentTransfers: Transfer[]; // 最近转账记录
    allTokens: Token[];
    userTokens: Token[];
}

export interface Wallet {
    keys: Key[];
    seed: string;
    chainId: string;
    name: string;
    symbol: string;

    account: string;
    isSelected: boolean;
    index: number;
    chainName: string;
}

export interface Key {
    publicKey: string;
}

export interface Token {
    symbol: string;
    contract: string;
    precision: number;
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