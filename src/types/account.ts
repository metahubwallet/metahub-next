

export interface Auth {
    permission: string;
    actor: string;
}

export interface AuthAccount {
    chainId: string;
    name: string;
    authority: string;
    publicKey: string;
    expire?: number;
}

export interface AuthorizedData {
    permission: string;
    actor: string;
    domain: string;
    accounts: AuthAccount[];
}