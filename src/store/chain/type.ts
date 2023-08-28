import { Network, RPC } from "@/types/settings";

export interface ChainState {
    networks: Network[]; // 默认节点列表
    currentNetwork: Network; // 当前节点
    rpcs: {
        [key: string]: RPC;
    }; // 所有节点
    selectedRpcs: {
        [key: string]: string;
    };
    customRpcs: {
        [key: string]: RPC[];
    }; // 用户自定义节点相关信息
}


