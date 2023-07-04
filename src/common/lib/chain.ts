import EOS from '@/common/lib/eos';
import { decrypt, md5 } from '@/common/util/crypto';
import { ErrorCode } from '@/common/util/type';
import { Perm, Wallet } from '@/store/wallet/type';
import { i18n } from '../plugin/lang';

export default class Chain {
    static chains: any = {};

    static getCurrentPrivateKey() {
        if (store.wallet().wallets.length == 0) return '';
        const account = this.currentAccount();
        return decrypt(account.privateKey, md5(account.seed + store.user().password));
    }

    static getPrivateKeyByPublicKey(publicKey: string) {
        for (let index = 0; index < store.wallet().wallets.length; index++) {
            const wallet = store.wallet().wallets[index];
            for (const key of wallet.keys) {
                if (key.publicKey === publicKey) {
                    return decrypt(key.privateKey, md5(wallet.seed + store.user().password));
                }
            }
        }
        return false;
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
        const wallet = store
            .wallet()
            .wallets.find((x) => x.chainId === chainId && x.name === authorization.actor);
        if (wallet) {
            for (const key of wallet.keys) {
                if (key.permissions.indexOf(authorization.permission) >= 0)
                    return decrypt(key.privateKey, md5(wallet.seed + store.user().password));
            }
        }
        return false;
    }

    static getPublicKeyByPermission(chainId: string, actor: string, permission: string) {
        const wallet = store
            .wallet()
            .wallets.find((x) => x.chainId === chainId && x.name === actor);
        if (wallet) {
            for (const key of wallet.keys) {
                const flag = key.permissions.findIndex((item) => {
                    return item.perm_name === permission;
                });
                if (flag != -1) return key.publicKey;
            }
        }
        return null;
    }

    static currentAccount() {
        return store.wallet().wallets[store.wallet().selectedIndex];
    }

    static get(chainId: string = '') {
        if (chainId == '') chainId = store.chain().currentChainId;
        if (typeof this.chains[chainId] == 'undefined') {
            this.chains[chainId] = new EOS(
                chainId,
                store.chain().getSelectedRpc(chainId) as string,
                this
            );
        }
        return this.chains[chainId];
    }

    static getAuth() {
        let permission = 'active';
        for (let key of this.currentAccount().keys) {
            const flag = key.permissions.findIndex((item) => {
                return item.perm_name === 'owner';
            });
            if (flag != -1) {
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
                if (msg.indexOf('reach free cpu') != -1) {
                    return i18n.global.t('error.cpuTimeLimit');
                }
                return msg;
            }
        }
        return i18n.global.t('public.requestHttpEndpointTimeout');
    }

    static authorityProvider(chainId: string) {
        return {
            getRequiredKeys: async (transaction: any, availableKeys: Array<string>) => {
                const permissions = new Set();
                for (let action of transaction.actions) {
                    for (let auth of action.authorization)
                        permissions.add(auth.actor + '-' + auth.permission);
                }

                let keys: string[] = [];
                permissions.forEach((p: any) => {
                    const [actor, perm] = p.split('-');
                    const key = this.getPublicKeyByPermission(chainId, actor, perm);
                    if (key) keys.push(key);
                });

                return keys;
            },
        };
    }

    static signatureProvider(chainId: string) {
        return {
            async getAvailableKeys() {
                const keys = Chain.currentAccount().keys.map((x: any) => x.publicKey);
                return keys;
            },

            async sign(transaction: any) {
                const buffer = Buffer.from(
                    Uint8Array.from(transaction.serializedTransaction) as any,
                    'hex'
                );

                const payload = {
                    buf: Buffer.concat([
                        Buffer.from(chainId, 'hex'),
                        buffer,
                        Buffer.from(new Uint8Array(32)),
                    ]),
                };
                const signatures = transaction.requiredKeys.map((pub: string) => {
                    const privateKey = Chain.getPrivateKeyByPublicKey(pub);
                    const signature = Chain.get(chainId).signature(
                        payload,
                        privateKey,
                        false,
                        false
                    );
                    return signature;
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
    static findLocalAccount(account: string, chainId: string): Wallet {
        let wallets = store.wallet().wallets;
        let i: number = 0;
        for (let index = 0; index < wallets.length; index++) {
            let wallet = wallets[index];
            if (wallet.name === account && wallet.chainId === chainId) {
                i = index;
                break;
            }
        }
        return wallets[i];
    }

    /**
     * 查询公钥对应的帐户
     * @param {string} account 账户名称
     *
     */
    static async fetchPermissions(account: string, chainId: string) {
        let result = { code: ErrorCode.OK, permissions: [] as Perm[], msg: '' };

        let wallet = this.findLocalAccount(account, chainId) as Wallet;
        try {
            const accinfo = await this.get(chainId).getAccount(account);
            if (!accinfo) throw new Error('fetch account eror');

            for (const key of wallet.keys) {
                let permissions = new Set();
                for (const perm of accinfo.permissions) {
                    if (perm.required_auth.keys.findIndex((x: any) => x.key == key.publicKey) >= 0)
                        permissions.add(perm.perm_name);
                }
                key.permissions = Array.from(permissions) as Perm[];
            }
            result.permissions = accinfo.permissions;
        } catch (e) {
            result.code = ErrorCode.HTTP_END_POINT_ERROR;
            result.msg = i18n.global.t('public.requestHttpEndpointTimeout');
            return result;
        }
        return result;
    }
}
