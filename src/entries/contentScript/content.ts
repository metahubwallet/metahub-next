import { SignatureResult, Message, SignaturePayload, Identity, LoginPayload, ChainNetwork, Payload, NetworkPayload, AccountPayload, ArbitrarySignaturePayload, RequiredKeysPayload, SignaturePayloadArgs, ChainInfoResult, Transaction, watchBackgroundMessages } from '../../common/lib/messages/message';
import * as MessageTypes from '../../common/lib/messages/types';
import { API_URL } from '@/common/constants';
import { ErrorCodes } from '@/common/lib/sdkError';


/* eslint-disable */
// todo: getIdentity, arbitrarySignature, transcation 要在页面显示一个加载符号？
// disconnect
// isConnected
// isPaired
// addEventHandler
// removeEventHandler
// listen
// getVersion
// getIdentity
// login
// getIdentity
// getIdentityFromPermissions
// checkLogin
// getIdentityFromPermissions
// forgetIdentity
// logout
// updateIdentity
// authenticate
// getArbitrarySignature
// getPublicKey
// linkAccount
// hasAccountFor
// suggestNetwork
// requestTransfer
// requestSignature
// createTransaction
// addToken
// identity

// start watch message
watchBackgroundMessages();


class Metahub {
    #identity: Identity | null = null;
    #chainId: string = '';
    #appName: string = '';
    public isExtension = true;

    constructor() {
        this.init();
    }

    public get identity(): Identity | null {
        return this.#identity;
    }

    public set identity(_id: any) {
        // do nothing, just compatibility with scatterjs
    }

    public async getVersion() {
        return await this.signal<Payload>(MessageTypes.REQUEST_GET_VERSION).request();
    }

    public isMetahub() {
        return true;
    }

    public async init() {
        try {
            const identity = await this.getIdentityFromPermissions();
            if (identity) {
                this.#identity = identity;
            }
        } catch (e) {
            console.log(e);
        }
        document.dispatchEvent(new CustomEvent("metahubLoaded"));
        document.dispatchEvent(new CustomEvent("scatterLoaded"));
    }

    public async login(payload?: Partial<LoginPayload>): Promise<Identity> {
        if (!payload) {
            payload = {};
        }
        if (typeof payload.appName == 'undefined' && this.#appName) {
            payload.appName = this.#appName;
        }
        if (typeof payload.chainId == 'undefined' && this.#chainId) {
            payload.chainId = this.#chainId;
        }
        console.log('login');
        return await this.getIdentity(payload);
    }

    public async hasAccountFor(network: ChainNetwork) {
        console.log('hasAccountFor');
        return await this.signal<NetworkPayload>(MessageTypes.REQUEST_HAS_ACCOUNT_FOR, { network }).request();
    }

    public async getIdentity(params: Partial<LoginPayload>): Promise<Identity> {
        this.#identity = (await this.signal(MessageTypes.GET_IDENTITY, params).request()) as Identity;
        console.log('getIdentity response');
        return this.#identity;
    }

    public async useIdentity(id: string) {
        console.log('useIdentity');
        // console.log(id);
    }

    public async logout(account?: string) {
        console.log('logout');
        return await this.forgetIdentity(account);
    }

    public async forgetIdentity(account?: string) {
        console.log('forgetIdentity');
        // console.log('payload', payload);
        const result = (await this.signal<AccountPayload>(MessageTypes.FORGET_IDENTITY, { account }).request()) as Identity;
        // console.log(result);
        this.#identity = result;
        return this.identity;
    }

    public async getIdentityFromPermissions() : Promise<Identity | null> {
        console.log('getIdentityFromPermissions');
        try {
            const result = (await this.signal<Payload>(MessageTypes.GET_IDENTITY_FROM_PERMISSIONS).request()) as Identity;
            return result;
        } catch (e: any) {
            if (e.code && e.code == ErrorCodes.EMPTY_DATA) {
                return null;
            }
            throw e;
        }
    }

    public async suggestNetwork() {
        console.log('suggestNetwork');
        throw new Error('suggestNetwork doesn\'t support now');
    }

    public async addToken() {
        console.log('addToken');
        throw new Error('addToken doesn\'t support now');
    }

    public async authenticate(randomString: string) {
        console.log('authenticate');
        console.log(randomString);
    }

    public async getArbitrarySignature(publicKey: string, data: string) : Promise<string> {
        console.log('arbitrarySignature');
        const params = { publicKey, data }
        const result = (await this.signal<ArbitrarySignaturePayload>(MessageTypes.REQUEST_ARBITRARY_SIGNATURE, params).request()) as SignatureResult;
        return result.signatures[0];
    }

    public async requestRawAbi(account: string, chainId: string) {
        const params = { account, chainId }
        const result = await this.signal<AccountPayload>(MessageTypes.REQUEST_RAW_ABI, params).request();
        return result;
    }

    public async requestRequiredKeys(transaction: any, availableKeys: string[]) {
        console.log('requestRequiredKeys');
        const params = { transaction, availableKeys }
        const result = await this.signal<RequiredKeysPayload>(MessageTypes.REQUEST_REQUIRED_KEYS, params).request();
        return result;
    }

    public eosHook(network: ChainNetwork) {
        console.log('call eosHook');
        return this.signatureProvider(network.chainId, this);
    }

    private signatureProvider(chainId: string, dapp: Metahub) {
        return {
            async getAvailableKeys() : Promise<string[]> {
                // console.log('getAvailableKeys');
                //console.log(payload);
                const keys = (await dapp.signal<Payload>(MessageTypes.REQUEST_AVAILABLE_KEYS, { chainId }).request()) as string[];
                // console.log(keys);
                return keys;
            },
    
            async sign(signatureArgs: SignaturePayloadArgs) {
    
                const params: Partial<SignaturePayload> = {
                    chainId: signatureArgs.chainId,
                    requiredKeys: [],
                    serializedTransaction: [],
                    serializedContextFreeData: [],
                    abis: [],
                };
    
                //Uint8Array to array
                params.serializedTransaction = Array.from(signatureArgs.serializedTransaction);
                if (signatureArgs.serializedContextFreeData) {
                    params.serializedContextFreeData = Array.from(signatureArgs.serializedContextFreeData);
                }
                const result = (await dapp.signal<SignaturePayload>(MessageTypes.REQUEST_SIGNATURE, params).request()) as SignatureResult;
                // console.log(result.signatures);
                return {
                    signatures: result.signatures,
                    serializedTransaction: signatureArgs.serializedTransaction
                }
            }
        }
    }

    // support for eos1 is no longer available
    eos(network: ChainNetwork, Api: any, options: any) {
        console.log('call eos hook');
        // const api = chain.getApi(network.chainId);
        const chainId = options.chainId ? options.chainId : network.chainId;
        options.chainId = chainId;
        options.signatureProvider = this.signatureProvider(chainId, this);
        options.abiProvider = {
            getRawAbi: async (accountName: string) => {
                const abi: any = await this.requestRawAbi(accountName, chainId);
                
                // reset abi
                const rawAbi = Uint8Array.from(Object.values(abi.abi));
                // console.log({
                //     accountName: accountName,
                //     abi: rawAbi
                // });
                return {
                    accountName: accountName,
                    abi: rawAbi
                };
            }
        };
        options.authorityProvider = {
            getRequiredKeys: async ({ transaction, availableKeys }: {transaction: any, availableKeys: string[]}) => {
                return await this.requestRequiredKeys(transaction, availableKeys);
            } 
        }
        const api = new Api(options);
        
        // function readUint32( tid, data, offset ){
        //   var hexNum = data.substring(2*offset+6,2*offset+8) + data.substring(2*offset+4,2*offset+6) + data.substring(2*offset+2,2*offset+4) + data.substring(2*offset,2*offset+2);
        //   var ret = parseInt(hexNum,16).toString(10);
        //   return parseInt(ret);
        // }

        function reverseHex(h: string) {
            return h.substring(6, 8) + h.substring(4, 6) + h.substring(2, 4) + h.substring(0, 2);
        };

        const timePointSecToDate = (ms: number) => {
            const s = (new Date(ms)).toISOString();
            return s.substring(0, s.length - 5);
        };

        const generateTapos = async (transaction: any, expireSeconds: number) => {
            // console.log('ref_block_prefix:', readUint32(8, '0de1d540861633fbd37ca0fee64edb6e28b929dabfcbf1a0eb837e6ed107f45b', 8));
            // console.log(timePointSecToDate(Date.now() + expireSeconds));
            if (typeof expireSeconds !== 'number') {
                expireSeconds = 30;
            }

            const chainInfo = (await this.signal<Payload>(MessageTypes.REQUEST_CHAIN_INFO, { chainId }).request()) as ChainInfoResult;
            const ref_block_num = chainInfo.head_block_num;
            const ref_block_prefix = parseInt(reverseHex(chainInfo.head_block_id.substring(16, 16 + 8)), 16);
            return {
                expiration: timePointSecToDate(Date.now() + expireSeconds * 1000),
                ref_block_num: ref_block_num & 0xffff,
                ref_block_prefix: ref_block_prefix,
                ...transaction
            }
        };
        api.oTransact = api.transact;
    
        api.transact = async (transaction: Transaction, options: any) => {
            // fill options
            if (typeof options != 'object') {
                options = {};
            }
            const { blocksBehind, useLastIrreversible, expireSeconds, ref_block_num, ref_block_prefix } = options;
            if ((typeof blocksBehind == 'undefined' && typeof useLastIrreversible == 'undefined' && (!ref_block_num || !ref_block_prefix))) {
                transaction = await generateTapos(transaction, expireSeconds);
            }
            // add authorityProvider
            options.authorityProvider = {
                getRequiredKeys: async ({ transaction, availableKeys } : { transaction: any, availableKeys: string[] }) => {
                    return await this.requestRequiredKeys(transaction, availableKeys);
                }
            };

            const account = transaction.actions[0].authorization[0].actor;
            const smoothMode = await this.signal<AccountPayload>(MessageTypes.GET_ACCOUNT_SMOOTH_MODE, { chainId, account }).request();
            console.log('smoothMode', account, smoothMode); 
            if (!smoothMode || (typeof options.broadcast != 'undefined' && options.broadcast == false)) {
                return await api.oTransact(transaction, options);
            }

            for (const action of transaction.actions) {
                action.authorization.unshift({ 
                    actor: '1stbillpayer',
                    permission: 'active'
                });
            }
            options = options || {};
            options.broadcast = false;
            options.sign = true;

            // console.log('call orgin transact');
            const signedTrx = await api.oTransact(transaction, options);

            const trx = api.deserializeTransaction(signedTrx.serializedTransaction);
            trx.signatures = signedTrx.signatures;

            const data = { signed: JSON.stringify(trx) };
            const url = API_URL + '/cpu/pushtx';
            const response = await fetch(url, {
                method: 'POST',
                mode: 'cors',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
            });

            // console.log(response);
            if (response && response.status == 200) {
                const data = await response.json();
                if (data && data.result) {
                    const serverSignature = data.result.signature;
                    // console.log(serverSignature);
                    const signatures = [ serverSignature, signedTrx.signatures[0] ];
                    // console.log(signatures);
                    return api.rpc.push_transaction({
                        signatures,
                        serializedTransaction: signedTrx.serializedTransaction,
                        serializedContextFreeData: signedTrx.serializedContextFreeData
                    });
                } else {
                    let msg = 'unkonwn error';
                    if (data && data.message) {
                        msg = data.message;
                    }
                    if (msg.indexOf('reach free cpu') != -1) {
                        msg = 'Your available resources have been exhausted.';
                    }
                    console.log('error', msg);
                    throw new Error(msg);
                }
            } else {
                throw new Error('network error');
            }
        }
        return api;
    }

    async requestTransfer() {
        console.log('requestTransfer');
        console.log(arguments);
    }

    async createTransaction() {
        console.log('requestTransfer');
        console.log(arguments);
    }

    signal<T extends Payload>(type: string, data?: Partial<T>) {
        const m = new Message<T>();
        m.type = type; 
        if (typeof data != 'undefined') {
            if (!data.chainId && this.#chainId) {
                data.chainId = this.#chainId;
            }
            Object.assign(m.payload, data);
        }
        return m;
    }

    // Compatible with ScatterJS, reset ScatterJS::Index::connect
    async connect(pluginName: string, options: any) {
        if (pluginName) {
            this.#appName = pluginName;
        }
        if (options && options.network && options.network.chainId) {
            this.#chainId = options.network.chainId;
        } else if (options && options.chainId) {
            this.#chainId = options.chainId;
        }
        return true;
    }
}

const metahub = new Metahub();
window.metahub = metahub;
let tryTimes = 0;
try {
    console.log('try reset ScatterJS...');
    // reset ScatterJS, so those ulgy plugins will not trigger
    let _ScatterJS: any;
    Object.defineProperty(window, 'ScatterJS', {
        get: () => _ScatterJS,
        set: (s) => {
            if (s) {
                s.scatter = metahub;
                _ScatterJS = s;
            }
        },
    });
    console.log('reset ScatterJS success');
} catch(e)  {
    console.log('reset ScatterJS failed, try reset ScatterJS.scatter...');
    // define ScatterJS error, so define ScatterJS.scatter
    const defineScatterJSScatter = () => {
        if (typeof window.ScatterJS != 'undefined') {
            try {
                Object.defineProperty(window.ScatterJS, "scatter", {
                    get: () => metahub,
                    set: (_s) => {
                        // ignore..
                    },
                });
            } catch(e) {
                console.log(e);
                console.log('define ScatterJS.scatter error');
            }
            console.log('define ScatterJS.scatter success');
        } else {
            console.log('define ScatterJS.scatter failed, retry...');
            tryTimes++;
            let time = tryTimes * 1;
            if (tryTimes > 50) {
                console.log('No ScatterJS');
                return;
            }
            setTimeout(() => { defineScatterJSScatter(); }, time);
        }
    }
    defineScatterJSScatter();
}

try {
    Object.defineProperty(window, "scatter", {
        get: () => metahub,
        set: (_s) => {
            // ignore..
        },
    });
} catch {
    console.log('define scatter error');
}