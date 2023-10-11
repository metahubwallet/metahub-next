import { Token } from "./tokens";

export interface Transfer {
    receiver: string;
    sender: string;
    amount?: number;
    memo: string;
    token: Token;
}

export interface TransferRecord {
    account: string;
    memo: string;
    token: Token;
    time: number;
}
