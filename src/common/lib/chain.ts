import EosApi from '@/common/lib/eosApi';
import { decrypt, md5 } from '@/common/util/crypto';
import { ErrorCode } from '@/common/util/type';
import { i18n } from '../plugin/lang';
import { Transaction } from 'eosjs/dist/eosjs-api-interfaces';
import { Permission, PermissionLevel } from 'eosjs/dist/eosjs-rpc-interfaces';
import { signature } from './keyring';

export class Chain {
    private apis: { [key: string]: EosApi } = {};

    getPrivateKeyByPublicKey(publicKey: string) {
        for (const wallet of useWalletStore().wallets) {
            for (const key of wallet.keys) {
                if (key.publicKey === publicKey) {
                    return decrypt(key.privateKey, md5(wallet.seed + useUserStore().password));
                }
            }
        }
        return '';
    }

    getPrivateKeyByAuthorization(chainId: string, auth: string) {
        let authorization: any = {};
        if (typeof auth == 'string') {
            const as = auth.split('@');
            authorization = {
                actor: as[0],
                permission: as[1] ? as[1] : 'active',
            };
        }

        const wallet = useWalletStore().wallets.find((x) => x.chainId === chainId && x.name === authorization.actor);

        if (wallet) {
            for (const key of wallet.keys) {
                if (key.permissions.indexOf(authorization.permission) >= 0) {
                    return decrypt(key.privateKey, md5(wallet.seed + useUserStore().password));
                }
            }
        }
        return false;
    }

    getPublicKeyByPermission(chainId: string, actor: string, permission: string) {
        const wallet = useWalletStore().wallets.find((x) => x.chainId === chainId && x.name === actor);

        if (wallet) {
            for (const key of wallet.keys) {
                if (key.permissions.indexOf(permission) >= 0) {
                    return key.publicKey;
                }
            }
        }
        return null;
    }

    currentAccount() {
        return useWalletStore().currentWallet;
    }

    getApi(chainId: string = '') {
        if (chainId == '') chainId = useChainStore().currentChainId;
        if (typeof this.apis[chainId] == 'undefined') {
            this.apis[chainId] = new EosApi(chainId, useChainStore().selectedRpc(chainId) as string, this);
        }
        return this.apis[chainId];
    }

    getAuth() {
        const currentAccount = this.currentAccount();
        return this.getMaxPermission(currentAccount.name, currentAccount.chainId);
    }

    getMaxPermission(name: string, chainId: string, parent?: string) : PermissionLevel {
        const wallet = useWalletStore().wallets.find(x => x.chainId == chainId && x.name == name);
        if (!wallet) {
            return {
                actor: name,
                permission: 'unkonwn',
            };
        }
        const permissions = wallet.keys.flatMap(x => x.permissions)
        let perm = '';
        if (permissions.includes('owner')) {
            perm = 'owner';
        } else if (parent && permissions.includes(parent)) {
            perm = parent;
        } else if (permissions.includes('active')) {
            perm = 'active';
        } else {
            perm = permissions[0];
        }
        return {
            actor: name,
            permission: perm,
        };
    }


    getErrorMsg(e: any) {
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
    authorityProvider(chainId: string) {
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

    signatureProvider(chainId: string) {

        return {
            getAvailableKeys: async() => {
                const keys = this.currentAccount().keys.map((x: any) => x.publicKey);
                // console.log('availableKeys', keys);
                return keys;
            },

            // { chainId, requiredKeys, serializedTransaction, serializedContextFreeData, abis }
            sign: async (transaction: any) => {
                const trxBuf =
                    typeof transaction.serializedTransaction == 'string'
                        ? Buffer.from(transaction.serializedTransaction, 'hex')
                        : Buffer.from(transaction.serializedTransaction);
                const buffer = Buffer.concat([
                        Buffer.from(transaction.chainId, 'hex'),
                        trxBuf,
                        Buffer.from(new Uint8Array(32)), // todo: serializedContextFreeData
                    ]);


                const signatures = transaction.requiredKeys.map((pub: string) => {
                    const privateKey = this.getPrivateKeyByPublicKey(pub);
                    return signature(buffer, privateKey);
                });

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
    findLocalAccount(account: string, chainId: string) {
        let wallets = useWalletStore().wallets;
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
    async fetchPermissions(account: string, chainId: string) {
        let result = { code: ErrorCode.OK, permissions: [] as Permission[], msg: '' };

        const index = useWalletStore().wallets.findIndex((item) => {
            return item.name === account && item.chainId === chainId;
        });
        const wallet = useWalletStore().wallets[index];

        try {
            const accinfo = await this.getApi(chainId).getAccount(account);
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

            useWalletStore().setWallet(wallet);
        } catch (e) {
            result.code = ErrorCode.HTTP_END_POINT_ERROR;
            result.msg = i18n.global.t('public.requestHttpEndpointTimeout');
            return result;
        }
        return result;
    }
}

export default new Chain();