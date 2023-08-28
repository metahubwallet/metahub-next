import { base64ToBinary } from 'eosjs/dist/eosjs-numeric';
import { CacheABI } from "@/types/settings";
import { Api } from "eosjs";
import { Abi } from 'eosjs/dist/eosjs-rpc-interfaces';
import eosioAbi from '@/assets/abi/eosio.abi.json';
import eosioTokenAbi from '@/assets/abi/eosio.token.abi.json';

 // 读写CacheABI
 const getCachedABI =  async (chainId: string, contract: string) : Promise<CacheABI | null> => {
    const cachedAbis = (await localCache.get('cachedAbis', [])) as CacheABI[];
    const cachedAbi = cachedAbis.find((x) => x.chainId == chainId && x.contract == contract);
    return cachedAbi ? cachedAbi : null;
};

const setCacheABI = async (abi: CacheABI) => {
    const cachedAbis = (await localCache.get('cachedAbis', [])) as CacheABI[];
    const index = cachedAbis.findIndex(
        (x) => x.chainId == abi.chainId && x.contract == abi.contract
    );
    if (index >= 0) {
        cachedAbis[index] = abi;
    } else {
        cachedAbis.push(abi);
    }
    await localCache.set('cachedAbis', cachedAbis);
};

export const getContractAbi = async (api: Api, chainId: string, contract: string) => {
    let abi: Abi;
    if (contract == 'eosio' || contract == 'eosio.token') {
        abi = contract == 'eosio' ? eosioAbi : eosioTokenAbi;
        const rawAbi = api.jsonToRawAbi(abi);
        return { abi, raw: rawAbi };
    }
    
    const cachedABI = await getCachedABI(chainId, contract);
    const nowTime = new Date().getTime();
    
    if (cachedABI && cachedABI.expire && cachedABI.expire > nowTime) {
        const codeUpdateTime = new Date(
            ((await api.rpc.get_account(contract)) as any).last_code_update + 'Z'
        ).getTime();
        if (cachedABI.updated > codeUpdateTime) {
            return { abi: cachedABI.abi, raw: cachedABI.raw };
        }
    }

    console.log('fetch abi', contract);
    const rawAbi = await api.rpc.get_raw_abi(contract);
    const raw = base64ToBinary(rawAbi.abi);
    
    abi = api.rawAbiToJson(raw);

    

    const savableAbi: CacheABI = {
        chainId: chainId,
        contract,
        abi,
        raw,
        // hash: rawAbi.abi_hash,
        updated: nowTime,
        expire: nowTime + 86400000 * 7,
    };
    await setCacheABI(savableAbi);

    return { abi, raw };
}