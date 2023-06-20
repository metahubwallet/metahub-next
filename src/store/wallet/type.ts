export interface WalletState {
    wallets: Wallet[]; // 里面存储 eos 账号相关信息
    selectedIndex: number; // 当前选中钱包的索引
    currentWallet: Wallet | null; // 当前选中钱包
    walletCaches: {
        [key: string]: {
            [key: string]: number;
        };
    };
    whitelist: WhiteItem[];
    recentTransations: Transation[]; // 最近转账记录
    allTokens: {
        [key: string]: Coin[]; // 链: Coins
    };
    userTokens: Coin[];
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
    publicKey: string;
    privateKey: string;
}

export interface Key {
    publicKey: string;
    privateKey: string;
    permissions: string[];
}

export interface Token {
    symbol: string;
    contract: string;
    precision: number;
}

export interface Coin extends Token {
    chain: string;
    amount: number;

    [key: string]: any; // 自定义属性
}

export interface WhiteItem {
    id: string;
    action: string;
    actor: string;
    contract: string;
    properties: string;
    domain: number;
}

export interface Action {
    receiver: string;
    sender: string;
    quantity: number;
    memo: string;
}

export interface Transfer extends Action {
    symbol: string;
    contract: string;
}

export interface Transation extends Transfer {
    time: number;
}
