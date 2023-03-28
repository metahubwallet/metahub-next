export interface UserState {
    password: string;
    passwordHash: string;
    wallets: Array<any>; // 存储 eos 账号信息
    selectedIndex: number;
    userTokens: string;
    networks: any;
    selectedRpc: any;
    customRpcs: any;
}
