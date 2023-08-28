import EosApi from '@/common/lib/eosApi';
import { decrypt, md5 } from '@/common/util/crypto';
import { ErrorCode } from '@/common/util/type';
import { i18n } from '../plugin/lang';
import { Transaction } from 'eosjs/dist/eosjs-api-interfaces';
import { Permission } from 'eosjs/dist/eosjs-rpc-interfaces';
import { signature } from './keyring';

export default class Chain {
    static apis: { [key: string]: EosApi } = {};

    static getPrivateKeyByPublicKey(publicKey: string) {
        for (const wallet of store.wallet().wallets) {
            for (const key of wallet.keys) {
                if (key.publicKey === publicKey) {
                    return decrypt(key.privateKey, md5(wallet.seed + store.user().password));
                }
            }
        }
        return '';
    }

    static getPrivateKeyByAuthorization(chainId: string, auth: string) {
        let authorization: any = {};
        if (typeof auth == 'string') {
            const as = auth.split('@');
            authorization = {
                actor: as[0],
                permission: as[1] ? as[1] : 'active',
            };
        }

        const wallet = store.wallet().wallets.find((x) => x.chainId === chainId && x.name === authorization.actor);

        if (wallet) {
            for (const key of wallet.keys) {
                if (key.permissions.indexOf(authorization.permission) >= 0) {
                    return decrypt(key.privateKey, md5(wallet.seed + store.user().password));
                }
            }
        }
        return false;
    }

    static getPublicKeyByPermission(chainId: string, actor: string, permission: string) {
        const wallet = store.wallet().wallets.find((x) => x.chainId === chainId && x.name === actor);

        if (wallet) {
            for (const key of wallet.keys) {
                if (key.permissions.indexOf(permission) >= 0) {
                    return key.publicKey;
                }
            }
        }
        return null;
    }

    static currentAccount() {
        return store.wallet().currentWallet;
    }

    static getApi(chainId: string = '') {
        if (chainId == '') chainId = store.chain().currentChainId;
        if (typeof this.apis[chainId] == 'undefined') {
            this.apis[chainId] = new EosApi(chainId, store.chain().selectedRpc(chainId) as string, this);
        }
        return this.apis[chainId];
    }

    static getAuth() {
        let permission = 'active';
        for (let key of this.currentAccount().keys) {
            if (key.permissions.indexOf('owner') > -1) {
                permission = 'owner';
                break;
            }
        }

        return {
            actor: this.currentAccount().name,
            permission,
        };
    }

    static getAuthByAccount(actor: string, permission: string) {
        return { actor, permission };
    }

    static getErrorMsg(e: any) {
        if (e) {
            if (e.json && e.json.error) {
                e = e.json.error;
            }
            if (e.name) {
                if (e.name == 'tx_cpu_usage_exceeded' || e.name == 'leeway_deadline_exception') {
                    return i18n.global.t('public.resourceCPULimit');
                }
                if (e.name == 'tx_net_usage_exceeded') {
                    return i18n.global.t('public.resourceNetLimit');
                }
                if (e.name == 'ram_usage_exceeded') {
                    return i18n.global.t('public.resourceLimitRam');
                }
            }
            if (e.details) {
                const msg = e.details[0].message;
                if (msg.indexOf('first transfer must be EOS') > -1) {
                    return i18n.global.t('error.firstNeedEOS');
                }
                return msg;
            }
            let msg = e.message;
            if (msg && msg.length < 100) {
                if (msg.indexOf('reach free cpu') != -1) return i18n.global.t('error.cpuTimeLimit');
                return msg;
            }
        }
        return i18n.global.t('public.requestHttpEndpointTimeout');
    }

    // todo: 分离出来
    static authorityProvider(chainId: string) {
        return {
            getRequiredKeys: async ({
                transaction,
                availableKeys,
            }: {
                transaction: Transaction;
                availableKeys: string[];
            }) => {
                const permissions = new Set();
                for (let action of transaction.actions) {
                    for (let auth of action.authorization) permissions.add(auth.actor + '-' + auth.permission);
                }

                let keys: string[] = [];
                permissions.forEach((p: any) => {
                    const [actor, perm] = p.split('-');
                    const key = this.getPublicKeyByPermission(chainId, actor, perm);
                    if (key) keys.push(key);
                });

                const requiredKeys = keys.filter((x) => availableKeys.includes(x));
                // console.log('requiredKeys', requiredKeys);
                return requiredKeys;
            },
        };
    }

    static signatureProvider(chainId: string) {
        return {
            async getAvailableKeys() {
                const keys = Chain.currentAccount().keys.map((x: any) => x.publicKey);
                // console.log('availableKeys', keys);
                return keys;
            },

            // { chainId, requiredKeys, serializedTransaction, serializedContextFreeData, abis }
            async sign(transaction: any) {
                // console.log(transaction.serializedContextFreeData);
                const trxBuf =
                    typeof transaction.serializedTransaction == 'string'
                        ? Buffer.from(transaction.serializedTransaction, 'hex')
                        : Buffer.from(transaction.serializedTransaction);
                const buffer = Buffer.concat([
                        Buffer.from(transaction.chainId, 'hex'),
                        trxBuf,
                        Buffer.from(new Uint8Array(32)), // todo: serializedContextFreeData
                    ]);

                // console.log(payload.buf.toString('hex'));
                // console.log('requiredKeys');


                const signatures = transaction.requiredKeys.map((pub: string) => {
                    const privateKey = Chain.getPrivateKeyByPublicKey(pub);
                    return signature(buffer, privateKey);
                });

                // console.log('');
                //
                // 30dacc64e4a9da5ead8400000000010000000000ea305500003f2a1ba6a24a010000000098669a690000000080ab26a7310000000098669a690000000098669a69000000000000000004454f5300000000e80300000000000004454f53000000000000
                // SIG_K1_KjbR2tYkYEgxJoxWsjBaNwTy5K4zCWRK5EbCWZn3iU6Z2R8mZ5K74C1NmoG98m7wtwT3vUH58ym192QFwU7Joqpgek5KvU

                // const api = new Api({chainId, rpc: new JsonRpc('http://office.gogo8899.com:8888')});
                // const trx = api.deserializeTransaction(transaction.serializedTransaction);
                return {
                    signatures,
                    serializedTransaction: transaction.serializedTransaction,
                };
            },
        };
    }

    /**
     * 查询账号
     * @param {string} account 账户名称
     *
     */
    static findLocalAccount(account: string, chainId: string) {
        let wallets = store.wallet().wallets;
        for (let index = 0; index < wallets.length; index++) {
            let wallet = wallets[index];
            if (wallet.name === account && wallet.chainId === chainId) {
                return wallets[index];
            }
        }
    }

    /**
     * 查询公钥对应的帐户
     * @param {string} account 账户名称
     *
     */
    static async fetchPermissions(account: string, chainId: string) {
        let result = { code: ErrorCode.OK, permissions: [] as Permission[], msg: '' };

        const index = store.wallet().wallets.findIndex((item) => {
            return item.name === account && item.chainId === chainId;
        });
        let wallet = store.wallet().wallets[index];

        try {
            const accinfo = await Chain.getApi(chainId).getAccount(account);
            if (!accinfo) throw new Error('fetch account eror');
            result.permissions = accinfo.permissions;

            for (const key of wallet.keys) {
                let permissions = new Set();
                for (const perm of accinfo.permissions) {
                    if (perm.required_auth.keys.findIndex((x: any) => x.key == key.publicKey) >= 0)
                        permissions.add(perm.perm_name);
                }
                key.permissions = Array.from(permissions) as any;
            }

            store.wallet().wallets[index] = wallet;
            store.wallet().setWallets(store.wallet().wallets);
        } catch (e) {
            result.code = ErrorCode.HTTP_END_POINT_ERROR;
            result.msg = i18n.global.t('public.requestHttpEndpointTimeout');
            return result;
        }
        return result;
    }
}
