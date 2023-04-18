import { Token } from '../chain/types';

export interface UserState {
    password: string;
    passwordHash: string;
    wallets: Array<any>; // 存储 eos 账号信息
    selectedIndex: number;
    userTokens: Record<string, any>;
    networks: any;
    selectedRpc: any;
    customRpcs: any;
}
