export interface UserState {
    passwordHash: string;
    wallets: Array<any>; // 存储 eos 账号信息
    selectedIndex: number;
}
