import { Token } from "./tokens";

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

export interface CacheABI {
    chainId: string;
    contract: string;
    expire: number;
    timestamp: number;
    abi: any;
    hash: string;
}

export interface Network {
    name: string;
    chain: string;
    chainId: string;
    endpoint: string;
    token: Token;
}

export interface RPC {
    name: string;
    endpoint: string;
    [key: string]: any;
}
