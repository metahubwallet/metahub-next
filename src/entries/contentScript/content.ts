import { SignatureResult, Message, SignaturePayload, Identity, LoginPayload, Network, Payload, NetworkPayload, AccountPayload, ArbitrarySignaturePayload, RequiredKeysPayload, SignaturePayloadArgs, ChainInfoResult, Transaction } from '../../common/lib/messages/message';
import * as MessageTypes from '../../common/lib/messages/types';
import { API_URL } from '@/common/constants';

/* eslint-disable */
//todo: getIdentity, arbitrarySignature, transcation 要在页面显示一个加载符号？
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

const signatureProvider = (chainId: string) => {
    return {
        async getAvailableKeys() {
            console.log('getAvailableKeys');
            //console.log(payload);
            const keys = await Message.signal<Payload>(MessageTypes.REQUEST_AVAILABLE_KEYS, { chainId }).request();
            //console.log(keys);
            return keys;
        },

        async sign(signatureArgs: SignaturePayloadArgs) {
            // args
            // abis
            // chainId
            // requiredKeys
            // serializedTransaction

            //signargs.network = network;
            const params = Object.assign({}, signatureArgs);
            //Uint8Array to array
            params.serializedTransaction = Array.from(params.serializedTransaction);
            if (params.serializedContextFreeData) {
                params.serializedContextFreeData = Array.from(params.serializedContextFreeData);
            }
            const result = (await Message.signal<SignaturePayload>(MessageTypes.REQUEST_SIGNATURE, params).request()) as SignatureResult;

            // console.log(result);
            
            // const signBuf = Buffer.concat([
            //   new Buffer(chainId, "hex"), new Buffer(serializedTransaction), new Buffer(new Uint8Array(32)),
            // ]);
            
            // const signatures = requiredKeys.map(
            //   (pub) => ecc.Signature.sign(signBuf, ecc.PublicKey.fromString(pub).toString()).toString(),
            // );
            return {
                signatures: result.signatures,
                serializedTransaction: signatureArgs.serializedTransaction
            }
        }
    }
}

class Dapp {
    identity?: Identity;

    constructor() {
        this.init();
    }

    async getVersion() {
        return await Message.signal<Payload>(MessageTypes.REQUEST_GET_VERSION).request();
    }

    async init() {
        this.identity = await this.getIdentityFromPermissions();

        document.dispatchEvent(new CustomEvent("metahubLoaded"));
        document.dispatchEvent(new CustomEvent("scatterLoaded"));
    }

    async login(payload: LoginPayload): Promise<Identity> {
        console.log('login');
        return await this.getIdentity(payload);
    }

    async hasAccountFor(network: Network) {
        console.log('hasAccountFor');
        return await Message.signal<NetworkPayload>(MessageTypes.REQUEST_HAS_ACCOUNT_FOR, { network }).request();
    }

    async getIdentity(params: Partial<LoginPayload>) {
        const result = (await Message.signal(MessageTypes.GET_IDENTITY, params).request()) as Identity;
        this.identity = result;
        return this.identity;
    }

    useIdentity(id: string) {
        console.log('useIdentity');
        // console.log(id);
    }

    async logout(account?: string) {
        console.log('logout');
        return await this.forgetIdentity(account);
    }

    async forgetIdentity(account?: string) {
        console.log('forgetIdentity');
        // console.log('payload', payload);
        const result = (await Message.signal<AccountPayload>(MessageTypes.FORGET_IDENTITY, { account }).request()) as Identity;
        // console.log(result);
        this.identity = result;
        return this.identity;
    }

    async getIdentityFromPermissions() : Promise<Identity> {
        // console.log('getIdentityFromPermissions');
        const result = (await Message.signal<Payload>(MessageTypes.GET_IDENTITY_FROM_PERMISSIONS).request()) as Identity;
        return result;
    }

    async suggestNetwork() {
        console.log('suggestNetwork');
        console.log(arguments);
    }

    async authenticate(randomString: string) {
        console.log('authenticate');
        console.log(randomString);
    }

    async getArbitrarySignature(publicKey: string, data: string) : Promise<string> {
        console.log('arbitrarySignature');
        const params = { publicKey, data }
        const result = (await Message.signal<ArbitrarySignaturePayload>(MessageTypes.REQUEST_ARBITRARY_SIGNATURE, params).request()) as SignatureResult;
        return result.signatures[0];
    }

    async requestRawAbi(account: string, chainId: string) {
        const params = { account, chainId }
        const result = await Message.signal<AccountPayload>(MessageTypes.REQUEST_RAW_ABI, params).request();
        return result;
    }

    async requestRequiredKeys(transaction: any, availableKeys: string[]) {
        const params = { transaction, availableKeys }
        const result = await Message.signal<RequiredKeysPayload>(MessageTypes.REQUEST_REQUIRED_KEYS, params).request();
        return result;
    }

    eosHook(network: Network) {
        console.log('call eosHook');
        return signatureProvider(network.chainId);
    }

    // support for eos1 is no longer available
    eos(network: Network, Api: any, options: any) {
        console.log('call eos2');
        // const api = chain.get(network.chainId);
        const chainId = options.chainId ? options.chainId : network.chainId;
        options.chainId = chainId;
        options.signatureProvider = signatureProvider(chainId);
        options.abiProvider = {
            getRawAbi: async (accountName: string) => {
                const rawAbi: any = await this.requestRawAbi(accountName, chainId);
                // reset abi
                rawAbi.abi = Uint8Array.from(Object.values(rawAbi.abi));
                return rawAbi;
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

            const { info } = (await Message.signal<Payload>(MessageTypes.REQUEST_CHAIN_INFO, { chainId }).request()) as ChainInfoResult;

            // console.log(info);
            const ref_block_num = info.head_block_num;
            const ref_block_prefix = parseInt(reverseHex(info.head_block_id.substr(16, 8)), 16);
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

            const account = transaction.actions[0].authorization[0].actor;
            const smoothMode = await Message.signal<AccountPayload>(MessageTypes.GET_ACCOUNT_SMOOTH_MODE, { chainId, account }).request();
            // console.log('smoothMode', account, smoothMode); 
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
            options.authorityProvider = {
                getRequiredKeys: async ({ transaction, availableKeys } : { transaction: any, availableKeys: string[] }) => {
                    return await this.requestRequiredKeys(transaction, availableKeys);
                }
            };
            const signedTrx = await api.oTransact(transaction, options);
            const trx = api.deserializeTransaction(signedTrx.serializedTransaction);
            trx.signatures = [ signedTrx.signatures[0] ];

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
            if (response && response.status == 200) {
                const data = await response.json();
                if (data && data.result) {
                    const serverSignature = data.result.signature;
                    // console.log(serverSignature);
                    const signatures = [ serverSignature, signedTrx.signatures[0] ];
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
    }

    const dapp = new Dapp();
    window.metahub = dapp;
    window.scatter = dapp;

    let checkTime = 200;
    function resetScatter() {
    if (typeof window.scatter == 'object' && window.scatter != dapp && typeof window.scatter.getIdentity == 'function') {
        window.scatter = dapp;
    }
    if (checkTime < 10000) {
        checkTime += 200;
    } else {
        checkTime += 1000;
    }
    setTimeout(resetScatter, checkTime);
}
setTimeout(resetScatter, 200);

// const dapp = new Dapp();
// window.scatter = new Proxy(dapp, {
//   get: function get(target, name) {
//     console.log('call:' + target, name);
//     return dapp[name];
//   }
// });
