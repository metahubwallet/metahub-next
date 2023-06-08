import CryptoJS from 'crypto-js'; //引用AES源码js

const key = '1E24L27O12ATTDEF'; //十六位十六进制数作为密钥
const iv = CryptoJS.enc.Utf8.parse('A3CE6FKE34SG3LD2'); //十六位十六进制数作为密钥偏移量

export const metahubKey = 'YM4BqViCkPs2qt3tTdTuP3ABUimU7sBU';

//解密方法
export const decrypt = (word: string, seed = key) => {
    const parseSeed = CryptoJS.enc.Utf8.parse(seed);
    let encryptedHexStr = CryptoJS.enc.Hex.parse(word);
    let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    let decrypt = CryptoJS.AES.decrypt(srcs, parseSeed, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });
    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
};

//加密方法
export const encrypt = (word: string, seed = key) => {
    const parseSeed = CryptoJS.enc.Utf8.parse(seed);
    let srcs = CryptoJS.enc.Utf8.parse(word);
    let encrypted = CryptoJS.AES.encrypt(srcs, parseSeed, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.ciphertext.toString().toUpperCase();
};

export const md5 = (word: string) => {
    return CryptoJS.MD5(word).toString();
};

export const password1 = (word: string) => {
    return CryptoJS.SHA1(CryptoJS.SHA1('metahub-' + word) + '#c22Dc1B6').toString();
};

export const password2 = (word: string) => {
    return CryptoJS.SHA1(CryptoJS.SHA1('metahub-' + word) + '#B33c4A15').toString();
};
