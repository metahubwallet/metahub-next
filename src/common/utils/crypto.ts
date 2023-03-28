import crypto from 'crypto';
import CryptoJS from 'crypto-js';

const key = '1E24L27O12ATTDEF'; //十六位十六进制数作为密钥
const iv = CryptoJS.enc.Utf8.parse('A3CE6FKE34SG3LD2'); //十六位十六进制数作为密钥偏移量

export const metahubKey = 'YM4BqViCkPs2qt3tTdTuP3ABUimU7sBU';

//加密方法
export function encrypt(word: string, seed = key) {
    let parseSeed = CryptoJS.enc.Utf8.parse(seed);
    let srcs = CryptoJS.enc.Utf8.parse(word);
    let encrypted = CryptoJS.AES.encrypt(srcs, parseSeed, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.ciphertext.toString().toUpperCase();
}

export function sha256(word: string, secret = null) {
    const hash =
        secret === null ? crypto.createHash('sha256') : crypto.createHmac('sha256', secret);
    return hash.update(word).digest('hex');
}

export function sha1(word: string) {
    return crypto.createHash('sha1').update(word).digest('hex');
}

export const md5 = (word: string) => {
    return crypto.createHash('md5').update(word).digest('hex');
};

export function password1(word: string) {
    return sha1(sha1('metahub-' + word) + '#c22Dc1B6');
}

export function password2(word: string) {
    return sha1(sha1('metahub-' + word) + '#B33c4A15');
}

//解密方法
export function decrypt(word: string, seed: string = key) {
    let parseSeed = CryptoJS.enc.Utf8.parse(seed);
    let encryptedHexStr = CryptoJS.enc.Hex.parse(word);
    let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    let decrypt = CryptoJS.AES.decrypt(srcs, parseSeed, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });
    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
}
