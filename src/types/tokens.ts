export interface Token {
    symbol: string;
    contract: string;
    precision: number;
}

export interface Coin extends Token {
    chain: string;
}

export interface Coin extends Token {
    chain: string;
    logo?: string;
}

export interface Balance extends Coin {
    chain: string;
    logo?: string;
    amount: number;
    [key: string]: any; // 自定义属性
}


