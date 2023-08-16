import MessageCenter from './messageCenter';
import SdkError from '../sdkError';

const strippedHost = () => {
    let host = location.hostname;
    // Replacing www. only if the domain starts with it.
    if (host.indexOf('www.') === 0) host = host.replace('www.', '');
    return host;
};

export interface Network {
    blockchain: string;
    chainId: string;
    host: string;
    port: number;
    protocol: string;
}

export interface IdentityAccount {
    blockchain: string;
    name: string;
    publicKey: string;
    authority: string;
    chainId: string;
    isHardware: boolean;
};

export interface Identity {
    accounts: IdentityAccount[],
    kyc: boolean;
    name: string;
    publicKey: string;
    hash: string;
};

export interface Transaction {
    expiration?: string;
    ref_block_num?: number;
    ref_block_prefix?: number;
    max_net_usage_words?: number;
    max_cpu_usage_ms?: number;
    delay_sec?: number;
    context_free_actions?: any[];
    context_free_data?: Uint8Array;
    actions: any[];
    transaction_extensions?: [number, string][];
    resource_payer?: any;
}

export interface SignaturePayloadArgs {
    chainId: string;
    requiredKeys: string[];
    serializedTransaction: Uint8Array;
    serializedContextFreeData?: Uint8Array;
    abis: any[];
}

export interface Payload {
    domain: string;
    chainId: string;
}

export interface NetworkPayload extends Payload {
    network: Network;
}

export interface LoginPayload extends Payload {
    newLogin?: boolean;
    accounts?: Network[];
}

export interface AccountPayload extends Payload {
    account: string;
}

export interface RequiredKeysPayload extends Payload {
    transaction: any;
    availableKeys: string[];
}

export interface SignaturePayload extends Payload {
    chainId: string;
    requiredKeys: string[];
    serializedTransaction: number[];
    serializedContextFreeData?: number[];
    abis: any[];
}

export interface ArbitrarySignaturePayload extends Payload {
    publicKey: string;
    data: string;
}

export interface BufferSignaturePayload extends Payload {
    buffer: Buffer;
}

export interface SignatureResult {
    signatures: string[];
}

export interface ChainInfoResult {
    info: any;
}

export type Result = SignatureResult | Identity | ChainInfoResult;
export class Message<T extends Payload> {
    public type: string;
    public payload: T;

    constructor() {
        this.type = '';
        this.payload = {
            domain: '',
            chainId: '',
        } as T;
    }

    static placeholder<T extends Payload>() {
        return new Message<T>();
    }

    static fromJson(json: Object) {
        const m = new Message<Payload>();
        return Object.assign(m, json);
    }

    static signal<T extends Payload>(type: string, data?: Partial<T>) {
        const m = new Message<T>();
        m.type = type;
        if (typeof data != 'undefined') {
            Object.assign(m.payload, data);
        }
        return m;
    }

    request(): Promise<Result> {
        // reset domain
        this.payload.domain = strippedHost();
        return new Promise<any>((resolve, reject) => {
            MessageCenter.send(this, (response: any) => {
                if (response && response.isError) {
                    reject(response);
                } else {
                    if (typeof response == 'undefined') {
                        reject(SdkError.maliciousEvent());
                    } else {
                        resolve(response);
                    }
                }
            });
        });
    }
}
