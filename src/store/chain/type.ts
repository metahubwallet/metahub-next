import { Token } from '../wallet/type';

export interface ChainState {
    networks: Network[]; // 默认节点列表
    currentNetwork: Network; // 当前节点
    rpcs: {
        [key: string]: RPC;
    }; // 所有节点
    selectedRpc: RPC; // 当前选中节点
    customRpcs: {
        [key: string]: RPC[];
    }; // 用户自定义节点相关信息
    currentChain: string; // 当前链
    currentChainId: string;
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
}
