import { Token } from "./tokens";

export interface WhiteItem {
    chainId: string;
    domain: string;
    contract: string;
    action: string;
    actor: string;
    permission: string;
    properties: {
        [key: string]: string;
    };
    hash: string;
}

export interface CacheABI {
    chainId: string;
    contract: string;
    updated: number;
    expire: number;
    abi: any;
    raw: any;
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
    delay?: string;
}
