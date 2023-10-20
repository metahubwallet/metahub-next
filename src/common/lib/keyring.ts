import { ecc } from 'eosjs/dist/eosjs-ecc-migration';

// 查询私钥是否正确
export function isValidPrivate(privateKey: string) {
    return ecc.isValidPrivate(privateKey);
}

// 私钥获取公钥
export function privateToPublic(privateKey: string) {
    if (ecc.isValidPrivate(privateKey) == false) return '';
    return ecc.privateToPublic(privateKey);
}

// 获取新私钥公钥
export async function getRandomKeyPair() {
    const privateKey = await ecc.randomKey(void 0, { secureEnv: true });
    const publicKey = ecc.privateToPublic(privateKey);
    return { privateKey, publicKey };
}

// 查询公钥是否正确
export function isValidPublic(publicKey: string) {
    return ecc.isValidPublic(publicKey);
}

export function signature(data: Buffer | string, privateKey: string, arbitrary: boolean = false, isHash: boolean = false) {
    if (!privateKey) {
        return '';
    }
    let sig: string;
    if (isHash) {
        sig = ecc.signHash(data, privateKey, 'utf8');
    } else {
        sig = ecc.sign(data, privateKey, 'utf8');
    }
    return sig;
}