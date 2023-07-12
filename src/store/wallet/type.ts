import { Abi } from 'eosjs/dist/eosjs-rpc-interfaces';

export interface WalletState {
    wallets: Wallet[]; // 里面存储 eos 账号相关信息
    selectedIndex: number; // 当前选中钱包的索引
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
    smoothMode: boolean;
}

export interface CacheABI {
    chainId: string;
    contract: string;
    expire: number;
    timestamp: number;
    abi: Abi;
    hash: string;
}

export interface Key {
    publicKey: string;
    privateKey: string;
    permissions: Perm[];
}

export interface Perm {
    perm_name: string;
    required_auth: {
        keys: {
            id: string;
            key: string;
            isCurrent: boolean;
        }[];
    };
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
    properties: {
        [key: string]: string;
    };
    domain: number;
    hash: string;
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

export interface ResourceData {
    core_liquid_balance: string;
    ram_quota: number;
    ram_usage: number;
    ram_percentage: number;
    cpu_limit: {
        percentage: number;
        max: number;
        used: number;
    };
    net_limit: {
        percentage: number;
        max: number;
        used: number;
    };
    stakeCpuMax: number;
    stakeNetMax: number;
    refund_request: RefundRequest;
    total_resources: {
        cpu_weight: string;
        net_weight: string;
    };
    self_delegated_bandwidth: {
        cpu_weight: string;
        net_weight: string;
    };
    stakeForUserCPU: number;
    stakeForUserNET: number;
    stakeForOthersCPU: number;
    stakeForOthersNET: number;
}

export interface RefundRequest {
    cpu_amount: number;
    net_amount: number;
    request_time: number;
    left_time: string;
}

export interface Authorization {
    permission: string;
    actor: string;
    domain: string;
    accounts: Account[];
}

export interface Account {
    authorizations: Authorization[];
    data: any;
    account: any;
    chainId: string;
    name: string;
    expire?: number;
    authority: string;
    publicKey: string;
    address: string;
}
