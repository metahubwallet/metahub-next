import {
    AccountPayload,
    ArbitrarySignaturePayload,
    SignatureResult,
    RequiredKeysPayload,
    LoginPayload,
    Message,
    Payload,
    SignaturePayload,
    Identity,
    IdentityAccount,
} from '@/common/lib/messages/message';
import * as MessageTypes from '@/common/lib/messages/types';
import SdkError from '@/common/lib/sdkError';
import { Network, RPC, WhiteItem } from '@/types/settings';
import { signature } from '@/common/lib/keyring';
import { decrypt, md5 } from '@/common/util/crypto';
import { Api, JsonRpc } from 'eosjs';
import { Auth, AuthAccount, AuthorizedData } from '@/types/account';
import { Wallet } from '@/types/wallet';
import { eosChainId } from '@/common/util/network';
import { getContractAbi } from '@/common/util/abi';

console.log('run...');

function setupMessageListener() {
    chrome.windows.onRemoved.addListener((windowId) => {
        closeWindow(windowId);
    });
    chrome.runtime.onMessage.addListener((request: any, sender, sendResponse: Function) => {
        if (sender.id !== chrome.runtime.id) return true;
        if (typeof request == 'string') {
            request = JSON.parse(request);
        }
        const message = Message.fromJson(request);
        if (message.payload && !message.payload.domain) {
            message.payload.domain = 'localhost';
        }
        dispenseMessage(sendResponse, message);
        return true;
    });
}

async function dispenseMessage(sendResponse: Function, message: Message<any>) {
    let response;
    try {
        switch (message.type) {
            case MessageTypes.GET_IDENTITY:
                response = await getIdentity(message.payload);
                break;
            case MessageTypes.GET_IDENTITY_FROM_PERMISSIONS:
                response = await getIdentityFromPermissions(message.payload);
                break;
            case MessageTypes.GET_ACCOUNT_SMOOTH_MODE:
                response = await getAccountSmoothMode(message.payload);
                break;
            case MessageTypes.FORGET_IDENTITY:
                response = await forgetIdentity(message.payload);
                break;
            case MessageTypes.REQUEST_CHAIN_INFO:
                response = await requestChainInfo(message.payload);
                break;
            case MessageTypes.REQUEST_AVAILABLE_KEYS:
                response = await requestAvailableKeys(message.payload);
                break;
            case MessageTypes.REQUEST_SIGNATURE:
                response = await requestSignature(message.payload);
                break;
            case MessageTypes.REQUEST_ARBITRARY_SIGNATURE:
                response = await requestArbitrarySignature(message.payload);
                break;
            case MessageTypes.REQUEST_ADD_NETWORK:
                response = await requestAddNetwork(message.payload);
                break;
            case MessageTypes.REQUEST_GET_VERSION:
                response = await requestGetVersion();
                break;
            case MessageTypes.REQUEST_VERSION_UPDATE:
                response = await requestVersionUpdate(message.payload);
                break;
            case MessageTypes.AUTHENTICATE:
                response = await authenticate(message.payload);
                break;
            case MessageTypes.REQUEST_HAS_ACCOUNT_FOR:
                response = await requestHasAccountFor(message.payload);
                break;
            case MessageTypes.REQUEST_RAW_ABI:
                response = await requestRawAbi(message.payload);
                break;
            case MessageTypes.REQUEST_REQUIRED_KEYS:
                response = await requestRequiredKeys(message.payload);
                break;
        }
    } catch (err) {
        response = err;
    }
    sendResponse(response);
}

async function getIdentity(payload: LoginPayload): Promise<Identity> {
    // fill chainId
    if (!payload.chainId && payload.accounts && payload.accounts.length) {
        const network = payload.accounts[0];
        payload.chainId = network.chainId;
    }
    if (!payload.newLogin) {
        const accounts = await getAuthorizations(payload.domain, payload.chainId);
        if (accounts && accounts.length) {
            return generateIdengity(accounts);
        }
    }

    const selectedAccount: AuthAccount | undefined = await createWindow('login', 450, 600, payload);
    if (!selectedAccount) {
        throw SdkError.signatureError('identity_rejected', 'User rejected the provision of an Identity');
    }

    const account = selectedAccount!;
    account.expire = Date.now() + 86400 * 7 * 1000;

    const authorizations = (await localCache.get('authorizations', [])) as AuthorizedData[];
    let auth = authorizations.find((x) => x.domain == payload.domain) as AuthorizedData;
    if (!auth) {
        auth = { domain: payload.domain, accounts: [], actor: '', permission: '' };
        authorizations.push(auth);
    }
    const index = auth.accounts.findIndex((x) => x.chainId == account.chainId && x.name == account.name && x.authority == account.authority);
    if (index >= 0) {
        auth.accounts.splice(index, 1);
    }
    auth.accounts.unshift(account);

    await localCache.set('authorizations', authorizations, 86400 * 30);
    const accounts = await getAuthorizations(payload.domain, payload.chainId);
    return generateIdengity(accounts);
}

async function getAuthorizations(domain: string, chainId = '*'): Promise<IdentityAccount[]> {
    const wallets = (await localCache.get('wallets', [])) as Wallet[];
    const authorizations = (await localCache.get('authorizations', [])) as AuthorizedData[];
    const auth = authorizations.find(x => x.domain == domain);
    if (!auth) {
        return [];
    }

    let now = Date.now();
    let filterAccounts = auth.accounts.filter((x) => {
        if (x.expire && x.expire < now) {
            return false;
        }
        const index = wallets.findIndex(
            (y) => x.chainId == y.chainId && x.name == y.name && y.keys.findIndex((z) => z.permissions.indexOf(x.authority) >= 0) >= 0
        );
        return index >= 0;
    });
    if (auth.accounts.length != filterAccounts.length) {
        auth.accounts = filterAccounts;
        await localCache.set('authorizations', authorizations, 86400 * 30);
    }

    const chainAccounts = chainId == '*' ? filterAccounts : filterAccounts.filter((x) => x.chainId == chainId);
    const returnAccounts = [];
    for (const chainAccount of chainAccounts) {
        const { expire, ...account } = Object.assign({ blockchain: 'eos', isHardware: false }, chainAccount);
        returnAccounts.push(account);
    }
    return returnAccounts;
        
   
}

function generateIdengity(accounts: AuthAccount[]): Identity {
    return {
        accounts: accounts.map((x) => {
            const id = {
                blockchain: 'eos',
                name: x.name,
                publicKey: x.publicKey,
                authority: x.authority,
                chainId: x.chainId,
                isHardware: false,
            };
            return id;
        }),
        kyc: false,
        name: 'default',
        publicKey: 'EOS8KAnYVnhZQ4HG8W9N8iTDpy6NDG3Y2ob48BGQbre8J1HBWt51c',
        hash: 'a7d14118a71c163f2bd0c7e6bc52ced2',
    };
}

async function getIdentityFromPermissions(payload: Payload) {
    const accounts = await getAuthorizations(payload.domain, '*');
    if (!accounts || !accounts.length) {
        throw SdkError.noAccount();
    }
    return generateIdengity(accounts);
}

async function getAccountSmoothMode(payload: AccountPayload) {
    const wallets = (await localCache.get('wallets', [])) as Wallet[];
    const wallet = wallets.find((x) => x.name === payload.account && x.chainId === payload.chainId);
    if (wallet) return wallet.smoothMode;

    return false;
}

async function forgetIdentity(payload: AccountPayload) {
    //可以指定域名，指定链，指定账号
    const authorizations = (await localCache.get('authorizations', [])) as AuthorizedData[];
    let authorization = authorizations.find((x) => x.domain == payload.domain);
    if (!authorization) return generateIdengity([]);

    let deletes = authorization.accounts;
    if (payload.chainId) deletes = deletes.filter((x) => x.chainId == payload.chainId);
    if (payload.account) deletes = deletes.filter((x) => x.name == payload.account);

    if (deletes.length < authorization.accounts.length) {
        deletes.map((x) => {
            const idx = authorization?.accounts.indexOf(x) || 0;
            authorization?.accounts.splice(idx, 1);
        });
        await localCache.set('authorizations', authorizations, 86400 * 30);
    } else if (deletes.length == authorization.accounts.length) {
        const idx = authorizations.indexOf(authorization);
        authorizations.splice(idx, 1);
        await localCache.set('authorizations', authorizations, 86400 * 30);
    }
    return generateIdengity(authorization.accounts);
}

async function requestChainInfo(payload: Payload) {
    const info = await getEosInfo(payload.chainId);
    return info;
}

async function getEndPoint(chainId: string) {
    const selectedRpcs = (await localCache.get('selectedRpcs', {}));
    let endpoint = selectedRpcs[chainId];

    if (!endpoint) {
        const networks = (await localCache.get('networks', [])) as Network[];
        const network = networks.find((x) => x.chainId == chainId);
        endpoint = network ? network.endpoint : '';
    }
    return endpoint;
}

async function requestAvailableKeys(payload: Payload) {
    if (!payload.chainId) {
        throw SdkError.noNetwork();
    }

    const authorizations = await getAuthorizations(payload.domain, payload.chainId);
    return Array.from(new Set(authorizations.map((x) => x.publicKey)));
}

async function requestSignature(payload: SignaturePayload | ArbitrarySignaturePayload): Promise<SignatureResult> {
    console.log('requestSignature');
    if (!payload.chainId) {
        throw SdkError.noNetwork();
    }

    const newPayload = {
        chainId: payload.chainId,
        domain: payload.domain,
        actions: [] as any[],
        dataKeys: [] as any[],
        authorization: { actor: '', permission: ''} as Auth,
        encryptText: '',
        buffer: Buffer.from([]),
    };
    let account: any; // old
    const authAccounts: string[] = []; // new
    const authorizations = await getAuthorizations(payload.domain, payload.chainId);
    if ('serializedTransaction' in payload) {
        // payload.transaction
        const result = await parseEosjsRequest(payload);
        newPayload.actions = result.actions;
        newPayload.buffer = result.buffer;

        // -- old start --
        const authIdx = newPayload.actions[0].authorization.length - 1;
        newPayload.authorization = newPayload.actions[0].authorization[authIdx]; //todo: 是否正确 ???
        account = authorizations.find((x) => x.name == newPayload.authorization.actor && x.authority == newPayload.authorization.permission);
        // -- new start ---
        const allAuths = newPayload.actions.flatMap((a) => a.authorization).map((auth) => auth.actor + '@' + auth.permission);
        const requestAuths = Array.from(new Set(allAuths));
        for (const requestAuth of requestAuths) {
            const [actor, perm] = requestAuth.split('@');
            const account = authorizations.find((x) => x.name == actor && x.authority == perm);
            if (account) {
                authAccounts.push(account.name + '@' + account.authority);
            }
        }
        // 说明： 正常来讲，有一个验证过就可以了。如果有多个，也要一起签名掉
        // requestAuths.map();
        // -- new end --
    } else if ('data' in payload) {
        const tooLongWord = payload.data.split(/\s+/).findIndex((x) => x.length > 12);
        if (tooLongWord >= 0) {
            throw SdkError.signatureError('signature_rejected', 'Each word cannot exceed 12 characters in length.');
        }
        if (payload.data.length == 0) {
            throw SdkError.signatureError('signature_rejected', 'String cannot be empty.');
        }
        if (payload.data.length >= 1024) {
            throw SdkError.signatureError('signature_rejected', 'String length cannot greater than 1024.');
        }
        account = authorizations.find((x) => x.publicKey == payload.publicKey);
        if (account) {
            newPayload.authorization = {
                actor: account.name,
                permission: account.authority,
            };
            // new
            authAccounts.push(account.actor + '@' + account.permission);
        }
        newPayload.encryptText = payload.data;
    } else {
        throw SdkError.signatureError('signature_rejected', 'unknow your operation');
    }

    if (!account) {
        throw SdkError.signatureError('signature_rejected', 'you have no permission for this operation');
    }

    // check whitelist
    if (newPayload.actions.length > 0) {
        //只检查单个的action
        const whitelist = (await localCache.get('whitelist', [])) as WhiteItem[];
        let allMatch = true;
        for (const action of newPayload.actions) {
            const hash = md5([payload.domain, payload.chainId, account.name, account.authority, action.account, action.name].join('-'));
            // console.log('hash', hash);
            const wli = whitelist.find((x) => x.hash == hash);
            if (wli) {
                for (const key in action.data) {
                    const value = action.data[key];
                    if (wli.properties[key] !== '*' && wli.properties[key] !== value) {
                        allMatch = false;
                        break;
                    }
                }
                if (!allMatch) {
                    break;
                }
            } else {
                allMatch = false;
            }
        }
        // console.log('allMatch', allMatch);
        if (allMatch) {
            const locked = (await getPassword()) == '';
            if (locked) {
                // to unlock
                const result = await createWindow('unlock', 500, 450, null);
                if (!result || !result.unlock) {
                    throw SdkError.signatureError('signature_rejected', 'User rejected the signature request');
                }
            }
            // todo: through permission
            const privateKey = await getPrivateKey(payload.chainId, account.publicKey);
            const sig = signature(newPayload.buffer, privateKey);
            return { signatures: [sig] };
        }
    }

    let windowHeight = 400;
    if (newPayload.actions.length > 0) windowHeight = 518;
    if (newPayload.actions.length > 1) windowHeight = 542;

    for (const action of newPayload.actions) {
        const keys: string[] = [];
        for (const key in action.data) {
            keys.push(key);
        }
        newPayload.dataKeys.push(keys);
    }
    // dataKeys
    const result = await createWindow('transcation', 600, windowHeight, newPayload);
    if (!result || !result.approve) {
        throw SdkError.signatureError('signature_rejected', 'User rejected the signature request');
    }
    //save whitelist...
    if (result.whitelist && result.whitelist.length > 0) {
        const whitelist = (await localCache.get('whitelist', [])) as WhiteItem[];
        for (const whitelistRow of result.whitelist) {
            let index = whitelist.findIndex((x) => x.hash === whitelistRow.hash);
            if (index == -1) {
                whitelist.push(whitelistRow);
            } else {
                whitelist.splice(index, 1, whitelistRow);
            }
        }
        await localCache.set('whitelist', JSON.stringify(whitelist), 86400 * 365);

    }
    const privateKey = await getPrivateKey(payload.chainId, account.publicKey);
    const arbitrary = newPayload.encryptText != '';
    const sig = signature(arbitrary ? newPayload.encryptText : newPayload.buffer, privateKey, arbitrary);
    return { signatures: [ sig ] };
            
}

async function getPrivateKey(chainId: string, publicKey: string) {
    const wallets = (await localCache.get('wallets', [])) as Wallet[];
    let encryptPrivateKey = '';
    let seed = '';
    for (const wallet of wallets) {
        if (wallet.chainId == chainId) {
            const key = wallet.keys.find((x) => x.publicKey == publicKey);
            if (key) {
                encryptPrivateKey = key.privateKey;
                seed = wallet.seed;
                break;
            }
        }
    }
    let privateKey = '';
    if (encryptPrivateKey) {
        const password = await getPassword();
        privateKey = decrypt(encryptPrivateKey, md5(seed + password));
    }
    if (!privateKey) {
        throw SdkError.signatureError('signature_rejected', 'The private key was not found through the account provided');
    }
    return privateKey;
}

async function requestArbitrarySignature(payload: ArbitrarySignaturePayload) {
    const authorizations = await getAuthorizations(payload.domain, '*');
    for (const authorization of authorizations) {
        if (authorization.publicKey == payload.publicKey) {
            payload.chainId = authorization.chainId;
            break;
        }
    }
    return await requestSignature(payload);
}

async function requestAddNetwork(payload: Payload) {}

async function requestGetVersion() {
    let manifestData = chrome.runtime.getManifest();
    let clientVersion = manifestData.version;
    return 'Metahub ' + clientVersion;
}

async function requestVersionUpdate(payload: Payload) {}

async function authenticate(payload: Payload) {}

async function requestHasAccountFor(payload: LoginPayload) {
    const wallets = (await localCache.get('wallets', [])) as Wallet[];
    const idx = wallets.findIndex((x) => payload.chainId == x.chainId);
    return idx >= 0;
}

async function requestRawAbi(payload: AccountPayload) {
    console.log('requestRawAbi', payload.account);
    const api = await tempApi(payload.chainId);
    const abi = await getContractAbi(api, payload.chainId, payload.account);
    return { account: payload.account, abi: abi.raw };
}

async function requestRequiredKeys(payload: RequiredKeysPayload) {
    console.log('requestRequiredKeys');
    if (payload.availableKeys.length == 1) {
        return payload.availableKeys;
    }
    // todo: this is wrong method, to find required keys
    return [ payload.availableKeys[0] ];
}

async function parseEosjsRequest(payload: SignaturePayload) {
    const trxBuf = Buffer.from(Uint8Array.from(payload.serializedTransaction));
    const parsed = await deserializeTransactionWithActions(payload.chainId, trxBuf);
    // const actions = parsed.actions.map((account: string, name: string, ...x: any[]) => ({
    //     ...x,
    //     code: account,
    //     type: name,
    // }));

    const buffer = Buffer.concat([
        Buffer.from(payload.chainId, 'hex'), // Chain ID
        trxBuf, // Transaction
        Buffer.from(new Uint8Array(32)), // Context free actions
    ]);
    return { actions: parsed.actions, buffer };
}

async function deserializeTransactionWithActions(chainId: string, buffer: Buffer): Promise<any> {
    console.log('deserializeTransactionWithActions');
    const api = await tempApi(chainId);
    return api.deserializeTransactionWithActions(buffer);
}

async function tempApi(chainId: string = eosChainId) : Promise<Api> {
    // create empty api
    const endpoint = await getEndPoint(chainId);
    const api = new Api({
        rpc: new JsonRpc(endpoint),
        chainId,
        signatureProvider: {
            getAvailableKeys: async () => [],
            sign: async (args: any) => ({ signatures: [], serializedTransaction: args.serializedTransaction }),
        },
    });
    return api;
}

async function getEosInfo(chainId: string) {
    console.log('getEosInfo', chainId);
    const endpoint = await getEndPoint(chainId);
    const response = await fetch(endpoint + '/v1/chain/get_info');
    return await response.json();
}

async function getPassword() {
    const result: any = (await chrome.storage.session.get(['password'])) ?? {};
    return (result.password as string) || '';
}

// todo: 这个变量可能会被置空
const closeCallbacks: { [key: number]: Function } = {};

// Initialize the demo on install
setupMessageListener();
// chrome.runtime.onInstalled.addListener(({ reason }) => {
//     setupMessageListener();
// });

async function closeWindow(windowId: number, forceClose = false) {
    // console.log('close window', windowId);
    const callback = closeCallbacks[windowId];
    if (typeof callback == 'function') {
        delete closeCallbacks[windowId];
        if (forceClose) {
            chrome.windows.remove(windowId);
        }
        const result: any = await chrome.storage.session.get(['windowResult']);
        await chrome.storage.session.remove(['windowResult']);
        setTimeout(() => callback(result.windowResult || null), 1);
    }
}

async function createWindow(type: string, width: number, height: number, params: any) {
    return new Promise(async (resolve: (value: any) => void) => {
        const cw = await chrome.windows.getCurrent();
        const left = parseInt(cw.left! + (cw.width! - width) / 2 + '');
        const top = parseInt(cw.top! + (cw.height! - height) / 2 + '');
        const win = await chrome.windows.create({
            url: 'src/entries/windows/index.html#/' + type,
            focused: true,
            width,
            height,
            left,
            top,
            type: 'popup',
        });
        if (params != null) {
            await chrome.storage.session.set({ windowParams: params });
        }
        // console.log('create window', win.id);
        closeCallbacks[win.id!] = resolve;
    });
}

// // 监听退出了浏览器,下次需要输入密码
// chrome.windows.onRemoved.addListener((windowId) => {
//     chrome.windows.getAll((windows) => {
//         if (windows.length == 0) {
//              lock
//         }
//     });
// });

// upgrade from v1
localCache.upgrade();
