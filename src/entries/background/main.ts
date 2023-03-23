// import browser from "webextension-polyfill";

// import * as MessageTypes from '../../libs/messages/types'
// import { Playload, Message } from '../../libs/messages/message';
// import SdkError from  '../../libs/sdkError';
// import Windows from '../../libs/windows';
// import Eos from '../../libs/eos';
// import { decrypt, md5 } from '../..//utils/crypto';

// browser.runtime.onInstalled.addListener(() => {
//   console.log("Extension installed");
// });

// class Background {
//   constructor() {
//     this.setupMessageListener();
//   }

//   /********************************************/
//   /*               VueInitializer             */
//   /********************************************/

//   // Watches the internal messaging system ( LocalStream )
//   setupMessageListener() {
//     chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//       if (sender.id !== chrome.runtime.id) {
//         return true;
//       }
//       if (typeof request == 'string') {
//         request = JSON.parse(request);
//       }
//       const message = Message.fromJson(request);
//       if (message.payload && !message.payload.domain) {
//         message.payload.domain = 'localhost';
//       }
//       this.dispenseMessage(sendResponse, message);
//       return true;
//     });

//     // if (this.timer) {
//     //   clearInterval(this.timer);
//     // }
//     // this.timer = setInterval(() => {
//     //   Background.updateAbiCaches();
//     // }, 300 * 1000); // 5 minutes
//     // Background.updateAbiCaches();
//   }

//   /***
//        * Delegates message processing to methods by message type
//        * @param sendResponse - Delegating response handler
//        * @param message - The message to be dispensed
//        */
//   async dispenseMessage(sendResponse: (response: any) => void, message: Message) {
//     //this.checkAutoLock();
//     let response: any;
//     // console.log(message);
//     switch (message.type) {
//       case MessageTypes.GET_IDENTITY: response = await Background.getIdentity(message.payload); break;
//       case MessageTypes.GET_IDENTITY_FROM_PERMISSIONS: response = await Background.getIdentityFromPermissions(message.payload); break;
//       case MessageTypes.GET_ACCOUNT_SMOOTH_MODE: response = await Background.getAccountSmoothMode(message.payload); break;
//       case MessageTypes.FORGET_IDENTITY: response = await Background.forgetIdentity(message.payload); break;
//       case MessageTypes.REQUEST_CHAIN_INFO: response = await Background.requestChainInfo(message.payload); break;
//       case MessageTypes.REQUEST_AVAILABLE_KEYS: response = await Background.requestAvailableKeys(message.payload); break;
//       case MessageTypes.REQUEST_SIGNATURE: response = await Background.requestSignature(message.payload); break;
//       case MessageTypes.REQUEST_ARBITRARY_SIGNATURE: response = await Background.requestArbitrarySignature(message.payload); break;
//       case MessageTypes.REQUEST_ADD_NETWORK: response = await Background.requestAddNetwork(message.payload); break;
//       case MessageTypes.REQUEST_GET_VERSION: response = await Background.requestGetVersion(); break;
//       case MessageTypes.REQUEST_VERSION_UPDATE: response = await Background.requestVersionUpdate(message.payload); break;
//       case MessageTypes.AUTHENTICATE: response = await Background.authenticate(message.payload); break;
//       case MessageTypes.REQUEST_HAS_ACCOUNT_FOR: response = await Background.requestHasAccountFor(message.payload); break;
//       case MessageTypes.REQUEST_RAW_ABI: response = await Background.requestRawAbi(message.payload); break;
//       case MessageTypes.REQUEST_REQUIRED_KEYS: response = await Background.requestRequiredKeys(message.payload); break;
//     }
//     sendResponse(response);
//   }

//   static async cacheChainInfoInterval() {
//     const states = {
//       wallets: await this.getStorage('wallets'),
//       selectedIndex: await this.getStorage('selectedIndex'),
//     }
//     const wallets = states.wallets || [];
//     const selectedIndex = parseInt(states.selectedIndex);
//     if (wallets.length > 0  && selectedIndex >= 0) {
//       const currentWallet = wallets[selectedIndex];
//       const currentChainId = currentWallet.chainId;
//       this.cacheChainInfo(currentChainId);
//     }
//     setTimeout(() => { this.cacheChainInfoInterval(); }, 1000 * 60); // 1 min
//   }

//   static async cacheChainInfo(chainId) {
//     if (!this.cachedInfo) {
//       this.cachedInfo = {};
//     }
//     const eos = await this.getEOSApi(chainId);
//     const info = await eos.rpc().get_info();
//     const cachedInfo = {
//       info,
//       time: (new Date(info.head_block_time + 'Z')).getTime()
//     };
//     this.cachedInfo[chainId] = cachedInfo;
//     return cachedInfo;
//   }

//   static async requestChainInfo(payload) {
//     console.log('requestChainInfo');
//     if (this.cachedInfo && this.cachedInfo[payload.chainId]) {
//       return this.cachedInfo[payload.chainId];
//     }
//     return await this.cacheChainInfo(payload.chainId);
//   }

//   // Lock the user due to inactivity
//   static checkAutoLock() {
//     if (inactivityInterval === 0) return false;
//     if (timeoutLocker) clearTimeout(timeoutLocker);
//   }

//   /********************************************/
//   /*              Web Application             */
//   /********************************************/

//   /***
//    * Prompts a request for Identity provision
//    * @param payload
//    */
//   static getIdentity(payload) {
//     return new Promise(async resolve => {
//       this.fillChainId(payload);
//       if (!payload.newLogin) {
//         const accounts = await this.getAuthorizations(payload.domain, payload.chainId);
//         if (accounts && accounts.length) {
//           resolve(this.generateIdengity(accounts));
//           return;
//         }
//       }
//       Windows.createWindow('login', 450, 600, payload, async (result) => {
//         if (result.code < 0) {
//           resolve(SdkError.signatureError("identity_rejected", "User rejected the provision of an Identity"));
//           return;
//         }
//         //save...
//         const authorizations = await this.getStorage('authorizations', []);
//         const account = Object.assign({}, result.data);
//         account.expire = Date.now() + 86400 * 7 * 1000;
//         let auth = authorizations.find(x => x.domain == payload.domain);
//         if (!auth) {
//           auth = { domain: payload.domain, accounts: []};
//           authorizations.push(auth);
//         }
//         const index = auth.accounts.findIndex(x => x.chainId == account.chainId && x.name == account.name && x.authority == account.authority);
//         if (index >= 0) {
//           console.log('found and delete');
//           auth.accounts.splice(index, 1);
//         }
//         auth.accounts.unshift(account);
//         //console.log(authorizations);
//         chrome.storage.local.set({ authorizations });
//         const accounts = await this.getAuthorizations(payload.domain, payload.chainId);
//         resolve(this.generateIdengity(accounts));
//       });
//     });

//   }

//   //todo:根据类型获取
//   static async getIdentityFromPermissions(payload) {
//     // console.log(payload);
//     const accounts = await this.getAuthorizations(payload.domain, '*');
//     if (!accounts || !accounts.length) {
//       return null;
//     }
//     return this.generateIdengity(accounts);
//   }

//   static async getAccountSmoothMode(payload) {
//     // console.log(payload);
//     const wallets = await this.getStorage('wallets', []);
//     // console.log('wallets', wallets);
//     const wallet = wallets.find(x => x.name === payload.account && x.chainId === payload.chainId);
//     if (wallet) {
//       return wallet.smoothMode;
//     }
//     return false;

//   }

//   static async forgetIdentity(payload) {
//     //可以指定域名，指定链，指定账号
//     console.log('forgetIdentity');
//     // console.log(payload);
//     const authorizations = await this.getStorage('authorizations', []);
//     let authorization = authorizations.find(x => x.domain == payload.domain);
//     // console.log(authorizations, payload.domain, authorization);
//     if (!authorization) {
//       console.log('account not found');
//       return this.generateIdengity([]);
//     }
//     // console.log(authorization);
//     let deletes = authorization.accounts;
//     if (payload.chainId) {
//       deletes = deletes.filter(x.chainId == payload.chainId);
//     }
//     // default delete all unless specified account
//     if (payload.account) {

//       deletes = deletes.filter(x => x.name == payload.account);
//     }
//     if (deletes.length < authorization.accounts.length) {
//       deletes.map(x => {
//         console.log('delete account:' + x.name + '@' + authorization.domain);
//         const idx = authorization.accounts.indexOf(x);
//         authorization.accounts.splice(idx, 1);
//       });
//       chrome.storage.local.set({ authorizations });
//     } else if (deletes.length == authorization.accounts.length) {
//       console.log('delete accounts at ' + authorization.domain);
//       const idx = authorizations.indexOf(authorization);
//       authorizations.splice(idx, 1);
//       chrome.storage.local.set({ authorizations });
//     } else {
//       console.log('no auth deleted.');
//       // chrome.storage.local.remove('authorizations');
//     }
//     return this.generateIdengity(authorization.accounts);
//   }

//   /***
//    * Authenticates the Identity by returning a signed passphrase using the
//    * private key associated with the Identity
//    * @param payload
//    */
//   static authenticate(payload) {

//   }

//   static async requestAvailableKeys(payload) {
//     console.log('requestAvailableKeys');
//     //console.log(payload);
//     //scatter好像直接返回了没有登录的账号，头疼。todo:针对同key也自动登录吗？
//     if (!payload.chainId) {
//       return SdkError.noNetwork();
//     }
//     const authorizations = await this.getAuthorizations(payload.domain, payload.chainId);
//     // console.log(authorizations);
//     return Array.from(new Set(authorizations.map(x => x.publicKey)));
//   }

//   /***
//    * Prompts a request for a transaction signature
//    * @param payload
//    */
//   static async requestSignature(payload) {
//     //todo: find this account and get publickey
//     //const executor = payload.actions[0].authorization.actor;
//     //console.log(payload);
//     //const request = eos.requestParser(payload);
//     //requestParser
//     console.log('requestSignature');
//     if (!payload.chainId) {
//       return SdkError.noNetwork();
//     }

//     const eos = await this.getEOSApi(payload.chainId);

//     const newPayload = {
//       chainId: payload.chainId,
//       domain: payload.domain,
//       actions: []
//     }
//     let account = '';  // old
//     const authAccounts = []; // new
//     // console.log('getAuthorizations');
//     const authorizations = await this.getAuthorizations(payload.domain, payload.chainId);
//     if (payload.transaction) {
//       console.log('do transaction');
//       newPayload.actions = await eos.requestParser(payload, eos.endpoint);

//       // -- old start --
//       const authIdx = newPayload.actions[0].authorization.length - 1;
//       newPayload.authorization = newPayload.actions[0].authorization[authIdx]; //todo: 是否正确 ???
//       account = authorizations.find(x => x.name == newPayload.authorization.actor && x.authority == newPayload.authorization.permission);
//       // -- new start ---
//       const allAuths = newPayload.actions.flatMap(a => a.authorization).map(auth => auth.actor + '@' + auth.permission);
//       const requestAuths = Array.from(new Set(allAuths));
//       for (const requestAuth of requestAuths) {
//         const [ actor, perm ] = requestAuth.split('@');
//         const account = authorizations.find(x => x.name == actor && x.authority == perm);
//         if (account) {
//           authAccounts.push(account);
//         }
//       }
//       // 说明： 正常来讲，有一个验证过就可以了。如果有多个，也要一起签名掉
//       console.log('authAccounts');
//       console.log(authAccounts);
//       // requestAuths.map();
//       // -- new end --
//     } else if (payload.data) {
//       const tooLongWord = payload.data.split(/\s+/).findIndex(x => x.length > 12);
//       if (tooLongWord >= 0) {
//         return SdkError.signatureError("signature_rejected", "Each word cannot exceed 12 characters in length.");
//       }
//       if (payload.data.length >= 1024) {
//         return SdkError.signatureError("signature_rejected", "String length cannot greater than 1024.");
//       }
//       // console.log('publicKey:' + payload.publicKey);
//       account = authorizations.find(x => x.publicKey == payload.publicKey);
//       if (account) {
//         newPayload.authorization = [{
//           actor: account.name,
//           permission: account.authority
//         }];
//         // new
//         authAccounts.push(account.actor + '@' + account.permission);
//       }
//       newPayload.encryptText = payload.data;
//     } else {
//       return SdkError.signatureError("signature_rejected", "unknow your operation");
//     }

//     // console.log(authorizations);
//     // console.log(authorization);
//     if (!account) {
//       return SdkError.signatureError("signature_rejected", "you have no permission for this operation");
//     }
//     // if (authAccounts.length) {
//     //   return SdkError.signatureError("signature_rejected", "you have no permission for this operation");
//     // }
//     //console.log(account);
//     //check whitelist
//     if (newPayload.actions.length > 0) {
//       //只检查单个的action
//       const whitelist = await this.getStorage('whitelist', []);
//       // console.log(whitelist);
//       let allMatch = true;
//       for (const action of newPayload.actions) {
//         // const action = newPayload.actions[0];
//         const hash = md5([payload.domain, payload.chainId, account.name, account.authority, action.code, action.type].join('-'));
//         const wli = whitelist.find(x => x.hash == hash);
//         if (wli) {
//           for (const key in action.data) {
//             const value = action.data[key];
//             if (wli.properties[key] !== '*' && wli.properties[key] !== value) {
//               allMatch = false;
//               break;
//             }
//           }
//           if (!allMatch) {
//             break;
//           }
//         } else {
//           allMatch = false;
//         }
//       }
//       if (allMatch) {
//         console.log('all match');
//         if (vars.isLock) {
//           //to unlock
//           const result = await new Promise(resolve => {
//             Windows.createWindow('unlock', 500, 450, newPayload, async result => {
//               if (result.code < 0) {
//                 resolve({unlock: false});
//                 return;
//               }
//               resolve({unlock: true});
//             });
//           });
//           if (!result.unlock) {
//             return SdkError.signatureError("signature_rejected", "User rejected the signature request");
//           }
//         }
//         // todo, through permission
//         const privateKey = await this.getPrivateKey(payload.chainId, account.publicKey);
//         const signature = eos.signature(payload, privateKey);
//         return {signature};

//       } else {
//         console.log('not match');
//       }

//       // const action = newPayload.actions[0];
//       // const hash = md5([payload.domain, payload.chainId, account.name, account.authority, action.code, action.type].join('-'));
//       // const wli = whitelist.find(x => x.hash == hash);
//       // if (wli) {
//       //   let allMatch = true;
//       //   for (const key in action.data) {
//       //     const value = action.data[key];
//       //     if (wli.properties[key] !== '*' && wli.properties[key] !== value) {
//       //       allMatch = false;
//       //       break;
//       //     }
//       //   }
//       //   if (allMatch) {
//       //     console.log('all match');
//       //     if (vars.isLock) {
//       //       //to unlock
//       //       const result = await new Promise(resolve => {
//       //         Windows.createWindow('unlock', 500, 450, newPayload, async result => {
//       //           if (result.code < 0) {
//       //             resolve({unlock: false});
//       //             return;
//       //           }
//       //           resolve({unlock: true});
//       //         });
//       //       });
//       //       if (!result.unlock) {
//       //         return SdkError.signatureError("signature_rejected", "User rejected the signature request");
//       //       }
//       //     }
//       //     // todo, through permission
//       //     const privateKey = await this.getPrivateKey(payload.chainId, account.publicKey);
//       //     const signature = eos.signature(payload, privateKey);
//       //     return {signature};

//       //   } else {
//       //     console.log('not match');
//       //   }
//       // }
//     }
//     return new Promise(resolve => {
//       let windowHeight = 400;
//       if (newPayload.actions.length > 0) {
//         windowHeight = 518;
//       }
//       if (newPayload.actions.length > 1) {
//         windowHeight = 542;
//       }
//       Windows.createWindow('transcation', 600, windowHeight, newPayload, async result => {
//         //console.log(result);
//         if (result.code < 0) {
//           resolve(SdkError.signatureError("signature_rejected", "User rejected the signature request"));
//           return;
//         }
//         //save whitelist...
//         if (result.data.whitelists.length > 0) {
//           const whitelist = await this.getStorage('whitelist', []);
//           for (const whitelistRow of result.data.whitelists) {
//             let index = whitelist.findIndex(x => x.hash === whitelistRow.hash);
//             if (index == -1) {
//               whitelist.push(whitelistRow);
//             } else {
//               whitelist.splice(index, 1, whitelistRow);
//             }
//           }
//           // console.log(whitelist);
//           chrome.storage.local.set({whitelist: JSON.stringify(whitelist)});
//         }

//         //const signature = eos.signature(payload, publicKey, true, true);
//         const privateKey = await this.getPrivateKey(payload.chainId, account.publicKey);
//         // console.log('privateKey: '+ privateKey);
//         let arbitrary = false;
//         if (newPayload.actions.length == 0) {
//           arbitrary = true;
//         }
//         const signature = eos.signature(payload, privateKey, arbitrary, false);
//         // console.log('signature: '+ signature);
//         resolve({signature});
//       });
//     });
//   }

//   /***
//    * Prompts a request for an arbitrary signature
//    * @param payload
//    */
//   static async requestArbitrarySignature(payload) {
//     console.log('requestArbitrarySignature');
//     const authorizations = await this.getAuthorizations(payload.domain, '*');
//     for (const authorization of authorizations) {
//       if (authorization.publicKey == payload.publicKey) {
//         payload.chainId = authorization.chainId;
//         break;
//       }
//     }
//     return await this.requestSignature(payload);
//   }

//   /***
//    *
//    * @param payload
//    */
//   static async requestAddNetwork(payload) {

//   }

//   /***
//    * Gets the current version of the app from the manifest.json
//    */
//   static async requestGetVersion() {
//     let manifestData = chrome.runtime.getManifest();
//     let clientVersion = manifestData.version;
//     return 'Metahub ' + clientVersion;
//   }

//   /***
//    * Notifies the user that the application they are using is
//    * requiring a newer version of Scatter than they have installed
//    * @param payload
//    */
//   static async requestVersionUpdate(payload) {

//   }

//   static async requestHasAccountFor(network) {
//     console.log('requestHasAccountFor');
//     console.log(network);
//     const wallets = await this.getStorage('wallets', []);
//     console.log('chainId:' + network.chainId);
//     const idx = wallets.findIndex(x => network.chainId == x.chainId);
//     console.log('idx:' + idx);
//     if (idx >= 0) {
//       console.log(wallets[idx]);
//     }
//     return idx >= 0
//   }

//   static async requestRawAbi(payload) {
//     const eos = await this.getEOSApi(payload.chainId);
//     return eos.getRawAbi(payload.account, payload.chainId);
//   }

//   static async requestRequiredKeys({ transaction, availableKeys }) {
//     console.log('requestRequiredKeys');
//     if (availableKeys.length == 1) {
//       return availableKeys;
//     }
//     // todo: find auths by transaction
//     return [ availableKeys[0] ];
//   }

//   static async getEndPoint(chainId) {
//     const selectedRpc = await this.getStorage('selectedRpc', {});
//     let endpoint = selectedRpc[chainId];
//     if (!endpoint) {
//       const networks = await this.getStorage('networks');
//       const network = networks.find(x => x.chainId == chainId);
//       console.log(network);
//       endpoint = network ? network.endpoint : '';
//     }
//     return endpoint;
//   }

//   static async getEOSApi(chainId) {
//     const endpoint = await this.getEndPoint(chainId);
//     // console.log('api:' + endpoint);
//     return new Eos(chainId, endpoint);
//   }

//   static getStorage(key, defaultValue='') {
//     return new Promise(resolve => {
//       chrome.storage.local.get(key, items => {
//         let value = typeof items[key] != 'undefined' ? items[key] : defaultValue;
//         if (typeof value == 'string' && (value.startsWith('[') || value.startsWith('{'))) {
//           value = JSON.parse(value);
//         }
//         resolve(value);
//       });
//     });
//   }

//   static async getAuthorizations(domain, chainId='*') {
//     const wallets = await this.getStorage('wallets', []);
//     //console.log(wallets);
//     const authorizations = await this.getStorage('authorizations', []);
//     // console.log(authorizations);
//     for (let auth of authorizations) {
//       if (auth.domain == domain) {
//         let now = Date.now();

//         let filterAccounts = auth.accounts.filter(x => {
//           if (x.expire < now) {
//             return false;
//           }
//           return wallets.findIndex(
//             y => x.chainId == y.chainId
//             && x.name == y.name
//             && y.keys.findIndex(z => z.permissions.indexOf(x.authority) >= 0) >= 0
//           ) >= 0;
//         });
//         //console.log(filterAccounts);
//         if (auth.accounts.length != filterAccounts.length) {
//           //update
//           console.log('delete some auth accounts');
//           auth.accounts = filterAccounts;
//           chrome.storage.local.set({ authorizations });
//         }

//         const chainAccounts = chainId == '*' ? filterAccounts : filterAccounts.filter(x => x.chainId == chainId);
//         const returnAccounts = [];
//         for (const chainAccount of chainAccounts) {
//           //authority
//           const account = Object.assign({ blockchain: 'eos' }, chainAccount);
//           delete account.expire;
//           returnAccounts.push(account);
//         }
//         // console.log(returnAccounts);
//         return returnAccounts;
//       }
//     }
//     return [];

//   }

//   static fillChainId(payload) {
//     if (payload.chainId) {
//       return;
//     }
//     if (payload.accounts && payload.accounts.length) {
//       const network = payload.accounts[0];
//       payload.chainId = network.chainId;
//     }
//   }

//   static async getPrivateKey(chainId, publicKey) {
//     const wallets = await this.getStorage('wallets', []);
//     let privateKey = '';
//     let seed = '';
//     for (const wallet of wallets) {
//       if (wallet.chainId == chainId) {
//         const key = wallet.keys.find(x => x.publicKey == publicKey);
//         if (key) {
//           privateKey = key.privateKey;
//           seed = wallet.seed;
//           break;
//         }
//       }
//     }
//     if (!privateKey) {
//       return '';
//     }
//     return decrypt(privateKey, md5(seed + vars.password));
//   }

//   static generateIdengity(accounts) {
//     return {
//       accounts: accounts.map(x => {
//         const id =  {
//           blockchain: 'eos',
//           name: x.name,
//           publicKey: x.publicKey,
//           authority: x.authority,
//           chainId: x.chainId,
//           isHardware: false
//         }
//         if (x.address) {
//           id.address = x.address;
//         }
//         return id;
//       }),
//       kyc: false,
//       name: 'default',
//       publicKey: 'EOS8KAnYVnhZQ4HG8W9N8iTDpy6NDG3Y2ob48BGQbre8J1HBWt51c',
//       hash: 'a7d14118a71c163f2bd0c7e6bc52ced2'
//     };
//   }

//   static async updateAbiCaches() {
//     // ~~~~ no use
//     const apis = {};
//     const cachedAbis = await this.getStorage('cachedAbis');
//     const now = Date.now();
//     const deleteIndexes = [];
//     for (let i = 0; i < cachedAbis.length; i++) {
//       const cachedAbi = cachedAbis[i];
//       let api = apis[cachedAbi.chainId];
//       if (!api) {
//         api = await this.getEOSApi(cachedAbi.chainId);
//         apis[cachedAbi.chainId] = api;
//       }
//       if (cachedAbi.expire <= now) {
//         //  delete
//         deleteIndexes.push(i);
//       } else {
//         console.log(cachedAbi.contract, 'not expire');
//         // todo: fetch new abi
//       }
//     }
//     while (deleteIndexes.length > 0) {
//       const di = deleteIndexes.pop();
//       cachedAbis.splice(di, 1);
//     }
//   }

// }

// new Background();

// Background.cacheChainInfoInterval();

// export const windows = Windows;

// export const vars = {
//   isLock: true,
//   password: '', // todo,改成异部方式获取？
// }

// // 监听退出了浏览器,下次需要输入密码
// chrome.windows.onRemoved.addListener(function(windowId){
//   chrome.windows.getAll(function(windows){
//     //console.log('windows count:'+windows.length);
//     if (windows.length == 0) {
//       //all close
//       vars.isLock = true;
//       vars.password = '';
//     }
//   });
// });
