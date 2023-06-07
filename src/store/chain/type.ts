import { Token } from '../wallet/type';

export interface ChainState {
    networks: Network[]; // 默认节点信息
    selectedRpc: {
        [key: string]: string;
    }; // 当前选中节点
    customRpcs: {
        [key: string]: RPC[];
    }; // 用户自定义节点相关信息
    selectedIndex: number;
    currentChain: string; // 当前链
    currentChainId: string;
}

export interface Network {
    chainId: string;
    chain: string;
    name: string;
    endpoint: string;
    token: Token;
}

export interface RPC {
    name: string;
    endpoint: string;
}
