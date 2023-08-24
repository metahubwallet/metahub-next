export interface Key {
    publicKey: string;
    privateKey: string;
    permissions: string[];
}

export interface Wallet {
    name: string;
    chainId: string;
    keys: Key[];
    seed: string;
    // address: string; // to delete ?
    smoothMode: boolean;
}