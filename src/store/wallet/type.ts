
export interface WalletState {
    wallets: Wallet[]; // 里面存储 eos 账号相关信息
    selectedIndex: number; // 当前选中钱包的索引
    walletCaches: {
        [key: string]: {
            [key: string]: number;
        };
    };
    whitelist: WhiteItem[];
    recentTransfers: TransferRecord[]; // 最近转账记录
    allTokens: { [key: string]: Coin[] };
    userTokens: { [key: string]: Balance[]; }; // 链: Coins   
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
    smoothMode: boolean;
}

export interface CacheABI {
    chainId: string;
    contract: string;
    expire: number;
    timestamp: number;
    abi: any;
    hash: string;
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
}

export interface Coin extends Token {
    chain: string;
    logo?: string;
}

export interface Balance extends Coin {
    chain: string;
    logo?: string;
    amount: number;
    [key: string]: any; // 自定义属性
}

export interface WhiteItem {
    id: string;
    action: string;
    actor: string;
    contract: string;
    properties: {
        [key: string]: string;
    };
    domain: number;
    hash: string;
}

export interface Transfer {
    receiver: string;
    sender: string;
    amount: number;
    memo: string;
    token: Token;
}

export interface TransferRecord {
    account: string;
    memo: string;
    token: Token;
    time: number;
}

export interface ResourceBase {
    use_percentage: number;
    use_limit: {
        max: number;
        used: number;
    };
    core_liquid_balance: string;
}

export interface ResourceData extends ResourceBase {
    stake_max: number;
    refund_request: {
        amount: number;
        request_time: number;
        left_time: string;
    };
    total_resources_weight: string;
    self_delegated_bandwidth_weight: string;
    staked_for_user: number;
    staked_for_others: number;
}

export interface Auth {
    permission: string;
    actor: string;
}


export interface AuthStore {
    permission: string;
    actor: string;
    domain: string;
    accounts: {
        authorizations: Auth[];
        data: any;
        account: string;
        chainId: string;
        name: string;
        expire?: number;
        authority: string;
        publicKey: string;
    }[];
}