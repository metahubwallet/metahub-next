import { Api, JsonRpc } from 'eosjs';
import ecc from 'eosjs-ecc';
import * as ricardianParser from 'eos-rc-parser';
import { Payload } from './messages/message';
import { ErrorCode } from '../util/type';
import { base64ToBinary } from 'eosjs/dist/eosjs-numeric';
import _ from 'lodash';

export default class EOS {
    public rpc;
    public api;

    constructor(private chainId: string, public endpoint: string, private chain?: any) {
        this.endpoint = endpoint;
        this.rpc = new JsonRpc(this.endpoint);
        this.api = this.getAPI();
    }

    // 查询私钥是否正确
    isValidPrivate(privateKey: string) {
        return ecc.isValidPrivate(privateKey);
    }

    // 私钥获取公钥
    privateToPublic(privateKey: string) {
        if (ecc.isValidPrivate(privateKey) == false) return '';
        return ecc.privateToPublic(privateKey);
    }

    // 查询账户的EOS余额
    async getCurrencyBalance(contract: string, account: string, symbol: string) {
        try {
            let res = await this.rpc.get_currency_balance(contract, account, symbol);
            return res[0];
        } catch (e) {
            return '';
        }
    }

    // 获取REX信息
    async getREXInfo(account = '') {
        try {
            let res = await this.rpc.get_table_rows({
                json: true,
                code: 'eosio',
                scope: 'eosio',
                table: 'rexbal',
                lower_bound: account,
                limit: '1',
            });
            return res;
        } catch (e) {
            return null;
        }
    }

    // 获取EOS价格
    async getEosPrice() {
        try {
            let res = await this.rpc.get_table_rows({
                json: true,
                code: 'swap.defi',
                scope: 'swap.defi',
                table: 'pairs',
                lower_bound: 12,
                upper_bound: 12,
                limit: '1',
            });
            return parseFloat(res.rows[0].price0_last);
        } catch (e) {
            return 0;
        }
    }

    // 通过公钥查询账号
    async getKeyAccounts(publicKey: string) {
        try {
            let result = await this.rpc.get_accounts_by_authorizers([], [publicKey]);
            let accounts = [];
            for (const account of result.accounts) {
                accounts.push(account.account_name);
            }
            let filterAccounts = [...new Set(accounts)];
            // todo: 原来的bug会导致刚注册的账号获取不到
            return filterAccounts;
        } catch (e: any) {
            console.log(e.json);
            return [];
        }
    }

    // 测试节点
    async testHttpEndpoint(endpoint = '') {
        let rpc = new JsonRpc(endpoint);
        return await rpc.get_info();
    }

    getAPI() {
        const payload = { chainId: this.chainId };
        const options = {
            rpc: this.rpc,
            abiProvider: {
                getRawAbi: async (accountName: string) => {
                    return await this.getRawAbi(accountName);
                },
            },
            authorityProvider: null,
            signatureProvider: null,
        };
        if (this.chain) {
            options.authorityProvider = this.chain.authorityProvider(payload);
            options.signatureProvider = this.chain.signatureProvider(payload);
        }
        return new Api(options as any);
    }

    async getRawAbi(accountName: string) {
        const abi = await this.getAbiJson(accountName);
        const rawAbi: any = this.api.jsonToRawAbi(abi);
        return { accountName, abi: rawAbi };
    }

    async getAbiJson(contract: string, version = 2) {
        if (contract == 'eosio') {
            if (version == 1) return require('@/asset/abi/eosio1.abi.json');
            else return require('@/asset/abi/eosio.abi.json');
        } else if (contract == 'eosio.token') {
            if (version == 1) return require('@/asset/abi/eosio.token1.abi.json');
            else return require('@/asset/abi/eosio.token.abi.json');
        }
        const cachedABI = await tool.getCachedABI(this.chainId, contract);
        const nowTime = new Date().getTime();

        if (cachedABI && cachedABI.expire && cachedABI.expire > nowTime) {
            const codeUpdateTime = new Date(
                ((await this.getAccount(contract)) as any).last_code_update + 'Z'
            ).getTime();
            if (cachedABI.timestamp > codeUpdateTime) {
                return cachedABI.abi;
            }
        }

        const rawAbi = await this.rpc.get_raw_abi(contract);
        const abi = this.api.rawAbiToJson(base64ToBinary(rawAbi.abi));

        const savableAbi = {
            chainId: this.chainId,
            contract,
            abi,
            hash: rawAbi.abi_hash,
            timestamp: nowTime,
            expire: nowTime + 86400000 * 7,
        };
        await tool.setCacheABI(savableAbi);
        return abi;
    }

    async getAccount(account = '') {
        if (account == '') return { code: ErrorCode.NAME_EMPTY };

        try {
            let res = await this.rpc.get_account(account);
            return res;
        } catch (e) {
            return null;
        }
    }

    async requestParser(payload: Payload, endpoint: string) {
        if (payload.transaction.hasOwnProperty('serializedTransaction'))
            return this.parseEosjs2Request(payload, endpoint);
        else return this.parseEosjsRequest(payload);
    }

    async parseEosjs2Request(payload: Payload, endpoint: string) {
        const { transaction } = payload;
        const buffer = Buffer.from(
            Uint8Array.from(transaction.serializedTransaction).toString(),
            'hex'
        );
        const parsed = await this.api.deserializeTransactionWithActions(buffer);
        const actions = parsed.actions.map((account, name, ...x) => ({
            ...x,
            code: account,
            type: name,
        }));

        payload.buf = Buffer.concat([
            new Buffer(transaction.chainId, 'hex'), // Chain ID
            buffer, // Transaction
            new Buffer(new Uint8Array(32)), // Context free actions
        ]);
        return actions;
    }

    async parseEosjsRequest(payload: Payload) {
        const { transaction } = payload;

        const contracts = _.uniq(transaction.actions.map((action) => action.account));
        const abis = await this.getAbis(contracts);

        return await Promise.all(
            transaction.actions.map(async (action, index) => {
                const contractAccountName = action.account;

                let abi = abis[contractAccountName];
                const typeName = abi.abi.actions.find((x: any) => x.name === action.name).type;
                const data = abi.fromBuffer(typeName, action.data);
                const actionAbi = abi.abi.actions.find(
                    (fcAction: any) => fcAction.name === action.name
                );
                let ricardian = actionAbi ? actionAbi.ricardian_contract : null;

                if (ricardian) {
                    const htmlFormatting = {
                        h1: 'div class="ricardian-action"',
                        h2: 'div class="ricardian-description"',
                    };
                    const signer =
                        action.authorizations.length === 1 ? action.authorizations[0].actor : null;
                    ricardian = ricardianParser.parse(
                        action.name,
                        data,
                        ricardian,
                        signer,
                        htmlFormatting
                    );
                }

                if (transaction.hasOwnProperty('delay_sec') && parseInt(transaction.delay_sec) > 0)
                    data.delay_sec = transaction.delay_sec;

                return {
                    data,
                    code: action.account,
                    type: action.name,
                    authorization: action.authorizations,
                    ricardian,
                };
            })
        );
    }

    async getAbis(contracts: string[]) {
        const abis = {} as any;
        const options = {
            chainId: this.chainId,
            httpEndpoint: this.endpoint,
        };
        await Promise.all(
            contracts.map(async (contract) => {
                abis[contract] = (await this.getRawAbi(contract)).abi;
            })
        );
        return abis;
    }

    signature(payload: Payload, privateKey: string, arbitrary = false, isHash = false) {
        if (!privateKey) return null;

        let sig;
        if (arbitrary && isHash) sig = ecc.Signature.signHash(payload.data, privateKey).toString();
        else
            sig = ecc.sign(
                Buffer.from((arbitrary ? payload.data : payload.buf).toString(), 'utf8'),
                privateKey
            );
        return sig;
    }
}
