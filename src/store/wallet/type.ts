import { Balance, Coin } from "@/types/tokens";
import { TransferRecord } from "@/types/transcation";
import { Wallet } from "@/types/wallet";

export interface WalletState {
    wallets: Wallet[]; // 里面存储 eos 账号相关信息
    selectedIndex: number; // 当前选中钱包的索引
    walletCaches: {
        [key: string]: {
            [key: string]: number;
        };
    };
    recentTransfers: TransferRecord[]; // 最近转账记录
    allTokens: { [key: string]: Coin[] };
    userTokens: { [key: string]: Balance[]; }; // 链: Coins   
}
