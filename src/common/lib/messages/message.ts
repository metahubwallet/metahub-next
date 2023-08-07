import { Network } from '@/store/chain/type';
import MessageCenter from './messageCenter';

const strippedHost = () => {
    let host = location.hostname;

    // Replacing www. only if the domain starts with it.
    if (host.indexOf('www.') === 0) host = host.replace('www.', '');

    return host;
};

export class Payload {
    domain: string;
    chainId: string;
    data: string;
    newLogin: string;
    accounts: Network[];
    account: string;
    buf: Buffer;
    transaction: {
        delay_sec: string;
        actions: any[];
        serializedTransaction: number[];
        chainId: string;
    };
    publicKey: string;
    availableKeys: string[];

    constructor() {
        this.domain = '';
        this.chainId = '';
        this.data = '';
        this.newLogin = '';
        this.accounts = [];
        this.account = '';
        this.buf = {} as Buffer;
        this.transaction = {
            delay_sec: '',
            actions: [],
            serializedTransaction: [],
            chainId: '',
        };
        this.publicKey = '';
        this.availableKeys = [];
    }
}

export class Message {
    type: string;
    payload: Payload;

    constructor() {
        this.type = '';
        this.payload = new Payload();
    }

    static placeholder() {
        return new Message();
    }
    static fromJson(json: Object) {
        return Object.assign(this.placeholder(), json);
    }

    static payload(type: string, payload: Payload) {
        let p = this.placeholder();
        p.type = type;
        p.payload = payload;
        return p;
    }

    static signal(type: string) {
        let p = this.placeholder();
        p.type = type;
        return p;
    }

    request() {
        const msg = this;
        if (!msg.payload.domain) {
            msg.payload.domain = strippedHost();
        }
        return new Promise((resolve, reject) => {
            MessageCenter.send(msg, (response: any) => {
                resolve(response);
            });
        });
    }
}
