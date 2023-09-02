export interface Key {
    publicKey: string;
    privateKey: string;
    permissions: string[];
}

export interface Wallet {
    name: string;
    // address: string; // to add address for eth
    chainId: string;
    keys: Key[];
    seed: string;
    blockchain: string;
    smoothMode: boolean;
}