import { Message, Payload } from '@/common/lib/messages/message';
import * as MessageTypes from '@/common/lib/messages/types';
import { Authorization, Wallet, WhiteItem } from '@/store/wallet/type';
import SdkError from '@/common/lib/sdkError';
import Windows from '@/common/lib/windows';
import Eos from '@/common/lib/eos';
import { Network, RPC } from '@/store/chain/type';
import { decrypt, md5 } from '@/common/util/crypto';

class Background {
    static cachedInfo: any;
    constructor() {
        this.setupMessageListener();
    }

    setupMessageListener() {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (sender.id !== chrome.runtime.id) return true;
            if (typeof request == 'string') request = JSON.parse(request);

            const message = Message.fromJson(request);
            if (message.payload && !message.payload.domain) {
                message.payload.domain = 'localhost';
            }
            this.dispenseMessage(sendResponse, message);
            return true;
        });
    }

    async dispenseMessage(sendResponse: Function, message: Message) {
        let response;
        switch (message.type) {
            case MessageTypes.GET_IDENTITY:
                response = await Background.getIdentity(message.payload);
                break;
            case MessageTypes.GET_IDENTITY_FROM_PERMISSIONS:
                response = await Background.getIdentityFromPermissions(message.payload);
                break;
            case MessageTypes.GET_ACCOUNT_SMOOTH_MODE:
                response = await Background.getAccountSmoothMode(message.payload);
                break;
            case MessageTypes.FORGET_IDENTITY:
                response = await Background.forgetIdentity(message.payload);
                break;
            case MessageTypes.REQUEST_CHAIN_INFO:
                response = await Background.requestChainInfo(message.payload);
                break;
            case MessageTypes.REQUEST_AVAILABLE_KEYS:
                response = await Background.requestAvailableKeys(message.payload);
                break;
            case MessageTypes.REQUEST_SIGNATURE:
                response = await Background.requestSignature(message.payload);
                break;
            case MessageTypes.REQUEST_ARBITRARY_SIGNATURE:
                response = await Background.requestArbitrarySignature(message.payload);
                break;
            case MessageTypes.REQUEST_ADD_NETWORK:
                response = await Background.requestAddNetwork(message.payload);
                break;
            case MessageTypes.REQUEST_GET_VERSION:
                response = await Background.requestGetVersion();
                break;
            case MessageTypes.REQUEST_VERSION_UPDATE:
                response = await Background.requestVersionUpdate(message.payload);
                break;
            case MessageTypes.AUTHENTICATE:
                response = await Background.authenticate(message.payload);
                break;
            case MessageTypes.REQUEST_HAS_ACCOUNT_FOR:
                response = await Background.requestHasAccountFor(message.payload);
                break;
            case MessageTypes.REQUEST_RAW_ABI:
                response = await Background.requestRawAbi(message.payload);
                break;
            case MessageTypes.REQUEST_REQUIRED_KEYS:
                response = await Background.requestRequiredKeys(message.payload.availableKeys);
                break;
        }
        sendResponse(response);
    }

    static getIdentity(payload: Payload) {
        return new Promise(async (resolve) => {
            this.fillChainId(payload);
            if (!payload.newLogin) {
                const accounts = await this.getAuthorizations(payload.domain, payload.chainId);
                if (accounts && accounts.length) {
                    resolve(this.generateIdengity(accounts));
                    return;
                }
            }
            Windows.createWindow('login', 450, 600, payload, async (result: { code: number; data: any }) => {
                if (result.code < 0) {
                    resolve(SdkError.signatureError('identity_rejected', 'User rejected the provision of an Identity'));
                    return;
                }
                //save...
                const authorizations = (await localCache.get('authorizations', [])) as Authorization[];
                const account = Object.assign({}, result.data);
                account.expire = Date.now() + 86400 * 7 * 1000;
                let auth = authorizations.find((x) => x.domain == payload.domain) as Authorization;
                if (!auth) {
                    auth = { domain: payload.domain, accounts: [], actor: '', permission: '' };
                    authorizations.push(auth);
                }
                const index = auth.accounts.findIndex(
                    (x) => x.chainId == account.chainId && x.name == account.name && x.authority == account.authority
                );
                if (index >= 0) {
                    auth.accounts.splice(index, 1);
                }
                auth.accounts.unshift(account);
                chrome.storage.local.set({ authorizations });
                const accounts = await this.getAuthorizations(payload.domain, payload.chainId);
                resolve(this.generateIdengity(accounts));
            });
        });
    }

    static fillChainId(payload: Payload) {
        if (payload.chainId) {
            return;
        }
        if (payload.accounts && payload.accounts.length) {
            const network = payload.accounts[0];
            payload.chainId = network.chainId;
        }
    }

    static async getAuthorizations(domain: string, chainId = '*') {
        const wallets = (await localCache.get('wallets', [])) as Wallet[];
        const authorizations = (await localCache.get('authorizations', [])) as Authorization[];
        for (let auth of authorizations) {
            if (auth.domain == domain) {
                let now = Date.now();

                let filterAccounts = auth.accounts.filter((x) => {
                    if (x.expire && x.expire < now) return false;

                    return (
                        wallets.findIndex(
                            (y) =>
                                x.chainId == y.chainId &&
                                x.name == y.name &&
                                y.keys.findIndex((z) => {
                                    return z.permissions.findIndex((item) => {
                                        return item === x.authority;
                                    });
                                }) >= 0
                        ) >= 0
                    );
                });
                if (auth.accounts.length != filterAccounts.length) {
                    auth.accounts = filterAccounts;
                    chrome.storage.local.set({ authorizations });
                }

                const chainAccounts =
                    chainId == '*' ? filterAccounts : filterAccounts.filter((x) => x.chainId == chainId);
                const returnAccounts = [];
                for (const chainAccount of chainAccounts) {
                    const { expire, ...account } = Object.assign({ blockchain: 'eos' }, chainAccount);
                    returnAccounts.push(account);
                }
                return returnAccounts;
            }
        }
        return [];
    }

    static generateIdengity(accounts: any[]) {
        return {
            accounts: accounts.map((x) => {
                const id = {
                    blockchain: 'eos',
                    name: x.name,
                    publicKey: x.publicKey,
                    authority: x.authority,
                    chainId: x.chainId,
                    isHardware: false,
                    address: '',
                };
                if (x.address) id.address = x.address;
                return id;
            }),
            kyc: false,
            name: 'default',
            publicKey: 'EOS8KAnYVnhZQ4HG8W9N8iTDpy6NDG3Y2ob48BGQbre8J1HBWt51c',
            hash: 'a7d14118a71c163f2bd0c7e6bc52ced2',
        };
    }

    static async getIdentityFromPermissions(payload: Payload) {
        const accounts = await this.getAuthorizations(payload.domain, '*');
        if (!accounts || !accounts.length) return null;
        return this.generateIdengity(accounts);
    }

    static async getAccountSmoothMode(payload: Payload) {
        const wallets = (await localCache.get('wallets', [])) as Wallet[];
        const wallet = wallets.find((x) => x.name === payload.account && x.chainId === payload.chainId);
        if (wallet) return wallet.smoothMode;

        return false;
    }

    static async forgetIdentity(payload: Payload) {
        //可以指定域名，指定链，指定账号
        const authorizations = (await localCache.get('authorizations', [])) as Authorization[];
        let authorization = authorizations.find((x) => x.domain == payload.domain);
        if (!authorization) return this.generateIdengity([]);

        let deletes = authorization.accounts;
        if (payload.chainId) deletes = deletes.filter((x) => x.chainId == payload.chainId);
        if (payload.account) deletes = deletes.filter((x) => x.name == payload.account);

        if (deletes.length < authorization.accounts.length) {
            deletes.map((x) => {
                const idx = authorization?.accounts.indexOf(x) || 0;
                authorization?.accounts.splice(idx, 1);
            });
            chrome.storage.local.set({ authorizations });
        } else if (deletes.length == authorization.accounts.length) {
            const idx = authorizations.indexOf(authorization);
            authorizations.splice(idx, 1);
            chrome.storage.local.set({ authorizations });
        }
        return this.generateIdengity(authorization.accounts);
    }

    static async requestChainInfo(payload: Payload) {
        if (this.cachedInfo && this.cachedInfo[payload.chainId]) {
            return this.cachedInfo[payload.chainId];
        }
        return await this.cacheChainInfo(payload.chainId);
    }

    static async cacheChainInfo(chainId: string) {
        if (!this.cachedInfo) this.cachedInfo = {};

        const eos = await this.getEOSApi(chainId);
        const info = await eos.rpc.get_info();
        const cachedInfo = {
            info,
            time: new Date(info.head_block_time + 'Z').getTime(),
        };
        this.cachedInfo[chainId] = cachedInfo;
        return cachedInfo;
    }

    static async getEOSApi(chainId: string) {
        const endpoint = await this.getEndPoint(chainId);
        return new Eos(chainId, endpoint);
    }

    static async getEndPoint(chainId: string) {
        const selectedRpc = (await localCache.get('selectedRpc', {})) as RPC;
        let endpoint = selectedRpc[chainId];

        if (!endpoint) {
            const networks = (await localCache.get('networks', [])) as Network[];
            const network = networks.find((x) => x.chainId == chainId);
            endpoint = network ? network.endpoint : '';
        }
        return endpoint;
    }

    static async requestAvailableKeys(payload: Payload) {
        // scatter好像直接返回了没有登录的账号，头疼。todo:针对同key也自动登录吗？
        if (!payload.chainId) return SdkError.noNetwork();

        const authorizations = await this.getAuthorizations(payload.domain, payload.chainId);
        return Array.from(new Set(authorizations.map((x) => x.publicKey)));
    }

    static async requestSignature(payload: Payload) {
        if (!payload.chainId) return SdkError.noNetwork();

        const eos = await this.getEOSApi(payload.chainId);

        const newPayload = {
            chainId: payload.chainId,
            domain: payload.domain,
            actions: [] as any[],
            authorization: {} as Authorization,
            encryptText: '',
        };
        let account: any; // old
        const authAccounts = []; // new
        const authorizations = await this.getAuthorizations(payload.domain, payload.chainId);
        if (payload.transaction) {
            newPayload.actions = await eos.requestParser(payload, eos.endpoint);

            // -- old start --
            const authIdx = newPayload.actions[0].authorization.length - 1;
            newPayload.authorization = newPayload.actions[0].authorization[authIdx]; //todo: 是否正确 ???
            account = authorizations.find(
                (x) => x.name == newPayload.authorization.actor && x.authority == newPayload.authorization.permission
            );
            // -- new start ---
            const allAuths = newPayload.actions
                .flatMap((a) => a.authorization)
                .map((auth) => auth.actor + '@' + auth.permission);
            const requestAuths = Array.from(new Set(allAuths));
            for (const requestAuth of requestAuths) {
                const [actor, perm] = requestAuth.split('@');
                const account = authorizations.find((x) => x.name == actor && x.authority == perm);
                if (account) {
                    authAccounts.push(account);
                }
            }
            // 说明： 正常来讲，有一个验证过就可以了。如果有多个，也要一起签名掉
            // requestAuths.map();
            // -- new end --
        } else if (payload.data) {
            const tooLongWord = payload.data.split(/\s+/).findIndex((x) => x.length > 12);
            if (tooLongWord >= 0) {
                return SdkError.signatureError(
                    'signature_rejected',
                    'Each word cannot exceed 12 characters in length.'
                );
            }
            if (payload.data.length >= 1024) {
                return SdkError.signatureError('signature_rejected', 'String length cannot greater than 1024.');
            }
            account = authorizations.find((x) => x.publicKey == payload.publicKey);
            if (account) {
                newPayload.authorization = {
                    actor: account.name,
                    permission: account.authority,
                    accounts: [],
                    domain: '',
                };
                // new
                authAccounts.push(account.actor + '@' + account.permission);
            }
            newPayload.encryptText = payload.data;
        } else {
            return SdkError.signatureError('signature_rejected', 'unknow your operation');
        }

        if (!account) {
            return SdkError.signatureError('signature_rejected', 'you have no permission for this operation');
        }

        //check whitelist
        if (newPayload.actions.length > 0) {
            //只检查单个的action
            const whitelist = (await localCache.get('whitelist', [])) as WhiteItem[];
            let allMatch = true;
            for (const action of newPayload.actions) {
                const hash = md5(
                    [payload.domain, payload.chainId, account.name, account.authority, action.code, action.type].join(
                        '-'
                    )
                );
                const wli = whitelist.find((x) => x.hash == hash);
                if (wli) {
                    for (const key in action.data) {
                        const value = action.data[key];
                        if (wli.properties[key] !== '*' && wli.properties[key] !== value) {
                            allMatch = false;
                            break;
                        }
                    }
                    if (!allMatch) break;
                } else allMatch = false;
            }
            if (allMatch) {
                if (vars.isLock) {
                    //to unlock
                    const result = (await new Promise((resolve) => {
                        Windows.createWindow('unlock', 500, 450, newPayload, async (result: any) => {
                            if (result.code < 0) {
                                resolve({ unlock: false });
                                return;
                            }
                            resolve({ unlock: true });
                        });
                    })) as any;
                    if (!result.unlock) {
                        return SdkError.signatureError('signature_rejected', 'User rejected the signature request');
                    }
                }
                // todo, through permission
                const privateKey = await this.getPrivateKey(payload.chainId, account.publicKey);
                const signature = eos.signature(payload, privateKey);
                return { signature };
            } else {
                window.msg.error('not match');
            }
        }
        return new Promise((resolve) => {
            let windowHeight = 400;
            if (newPayload.actions.length > 0) windowHeight = 518;
            if (newPayload.actions.length > 1) windowHeight = 542;

            Windows.createWindow(
                'transcation',
                600,
                windowHeight,
                newPayload,
                async (result: { code: number; data: any }) => {
                    if (result.code < 0) {
                        resolve(SdkError.signatureError('signature_rejected', 'User rejected the signature request'));
                        return;
                    }
                    //save whitelist...
                    if (result.data.whitelists.length > 0) {
                        const whitelist = (await localCache.get('whitelist', [])) as WhiteItem[];
                        for (const whitelistRow of result.data.whitelists) {
                            let index = whitelist.findIndex((x) => x.hash === whitelistRow.hash);
                            if (index == -1) {
                                whitelist.push(whitelistRow);
                            } else {
                                whitelist.splice(index, 1, whitelistRow);
                            }
                        }
                        chrome.storage.local.set({ whitelist: JSON.stringify(whitelist) });
                    }

                    const privateKey = await this.getPrivateKey(payload.chainId, account.publicKey);
                    let arbitrary = false;
                    if (newPayload.actions.length == 0) arbitrary = true;

                    const signature = eos.signature(payload, privateKey, arbitrary, false);
                    resolve({ signature });
                }
            );
        });
    }

    static async getPrivateKey(chainId: string, publicKey: string) {
        const wallets = (await localCache.get('wallets', [])) as Wallet[];
        let privateKey = '';
        let seed = '';
        for (const wallet of wallets) {
            if (wallet.chainId == chainId) {
                const key = wallet.keys.find((x) => x.publicKey == publicKey);
                if (key) {
                    privateKey = key.privateKey;
                    seed = wallet.seed;
                    break;
                }
            }
        }
        if (!privateKey) {
            return '';
        }
        return decrypt(privateKey, md5(seed + vars.password));
    }

    static async requestArbitrarySignature(payload: Payload) {
        const authorizations = await this.getAuthorizations(payload.domain, '*');
        for (const authorization of authorizations) {
            if (authorization.publicKey == payload.publicKey) {
                payload.chainId = authorization.chainId;
                break;
            }
        }
        return await this.requestSignature(payload);
    }

    static async requestAddNetwork(payload: Payload) {}

    static async requestGetVersion() {
        let manifestData = chrome.runtime.getManifest();
        let clientVersion = manifestData.version;
        return 'Metahub ' + clientVersion;
    }

    static async requestVersionUpdate(payload: Payload) {}

    static authenticate(payload: Payload) {}

    static async requestHasAccountFor(payload: Payload) {
        const wallets = (await localCache.get('wallets', [])) as Wallet[];
        const idx = wallets.findIndex((x) => payload.chainId == x.chainId);
        return idx >= 0;
    }

    static async requestRawAbi(payload: Payload) {
        const eos = await this.getEOSApi(payload.chainId);
        return eos.getRawAbi(payload.account);
    }

    static async requestRequiredKeys(availableKeys: string[]) {
        if (availableKeys.length == 1) return availableKeys;

        return [availableKeys[0]];
    }

    static async cacheChainInfoInterval() {
        const wallets = (await localCache.get('wallets', [])) as Wallet[];
        const selectedIndex = (await localCache.get('selectedIndex', -1)) as number;
        if (wallets.length > 0 && selectedIndex >= 0) {
            const currentWallet = wallets[selectedIndex];
            const currentChainId = currentWallet.chainId;
            this.cacheChainInfo(currentChainId);
        }

        setTimeout(() => {
            this.cacheChainInfoInterval();
        }, 1000 * 60); // 1 min
    }
}

new Background();
Background.cacheChainInfoInterval();

export const vars = {
    isLock: true,
    password: '', // todo,改成异部方式获取？
};

// 监听退出了浏览器,下次需要输入密码
chrome.windows.onRemoved.addListener((windowId) => {
    chrome.windows.getAll((windows) => {
        if (windows.length == 0) {
            vars.isLock = true;
            vars.password = '';
        }
    });
});
