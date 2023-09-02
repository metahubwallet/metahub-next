import { Network } from "@/types/settings";

export const eosChainId = 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906';

export const supportNetworks: Network[] = [
    {
        name: 'EOS',
        chain: 'eos',
        chainId: eosChainId,
        // endpoint: 'https://eospush.tokenpocket.pro',
        endpoint: 'https://eos.greymass.com',
        token: {
            contract: 'eosio.token',
            symbol: 'EOS',
            precision: 4,
        },
    },
    {
        name: 'WAX',
        chain: 'wax',
        chainId: '1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4',
        endpoint: 'https://api.waxsweden.org',
        token: {
            contract: 'eosio.token',
            symbol: 'WAX',
            precision: 8,
        },
    },
    {
        name: 'Telos',
        chain: 'telos',
        chainId: '4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11',
        endpoint: 'https://api.telosfoundation.io',
        token: {
            contract: 'eosio.token',
            symbol: 'TLOS',
            precision: 4,
        },
    },
    {
        name: 'Proton',
        chain: 'proton',
        chainId: '384da888112027f0321850a169f737c33e53b388aad48b5adace4bab97f437e0',
        endpoint: 'https://proton.greymass.com',
        token: {
            contract: 'eosio.token',
            symbol: 'SYS',
            precision: 4,
        },
    },
    {
        name: 'BOS',
        chain: 'bos',
        chainId: 'd5a3d18fbb3c084e3b1f3fa98c21014b5f3db536cc15d08f9f6479517c6a3d86',
        endpoint: 'https://api.boscore.io',
        token: {
            contract: 'eosio.token',
            symbol: 'BOS',
            precision: 4,
        },
    },
    {
        name: 'Kylin',
        chain: 'kylin',
        chainId: '5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191',
        endpoint: 'https://api-kylin.eoslaomao.com',
        token: {
            contract: 'eosio.token',
            symbol: 'EOS',
            precision: 4,
        },
    },
    {
        name: 'Jungle',
        chain: 'jungle',
        chainId: 'e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473',
        endpoint: 'http://jungle.eosamsterdam.net',
        token: {
            contract: 'eosio.token',
            symbol: 'EOS',
            precision: 4,
        },
    },
    {
        name: 'Jungle3',
        chain: 'jungle3',
        chainId: '2a02a0053e5a8cf73a56ba0fda11e4d92e0238a4a2aa74fccf46d5a910746840',
        endpoint: 'https://jungle3.cryptolions.io',
        token: {
            contract: 'eosio.token',
            symbol: 'EOS',
            precision: 4,
        },
    },
    {
        name: 'BOS Testnet',
        chain: 'bos-test',
        chainId: '33cc2426f1b258ef8c798c34c0360b31732ea27a2d7e35a65797850a86d1ba85',
        endpoint: 'https://boscore.eosrio.io',
        token: {
            contract: 'eosio.token',
            symbol: 'EOS',
            precision: 4,
        },
    },
    {
        name: 'Telos Testnet',
        chain: 'telos-test',
        chainId: '1eaa0824707c8c16bd25145493bf062aecddfeb56c736f6ba6397f3195f33c9f',
        endpoint: 'https://testnet.telos.net',
        token: {
            contract: 'eosio.token',
            symbol: 'EOS',
            precision: 4,
        },
    },
    {
        name: 'WAX Testnet',
        chain: 'wax-test',
        chainId: 'f16b1833c747c43682f4386fca9cbb327929334a762755ebec17f6f23c9b8a12',
        endpoint: 'https://testnet.wax.pink.gg',
        token: {
            contract: 'eosio.token',
            symbol: 'EOS',
            precision: 4,
        },
    },
    {
        name: 'Proton Testnet',
        chain: 'proton-test',
        chainId: '71ee83bcf52142d61019d95f9cc5427ba6a0d7ff8accd9e2088ae2abeaf3d3dd',
        endpoint: 'https://testnet.protonchain.com',
        token: {
            contract: 'eosio.token',
            symbol: 'EOS',
            precision: 4,
        },
    },
];

export const getNetworkLocalIcon = (chain: string = 'eos', active = true) => {
    let network = chain.toLowerCase();
    if (network == 'jungle3') network = 'jungle';
    network = network.replace('-test', '');

    // 是否为支持network
    const networks = ['bos', 'jungle', 'telos', 'kylin', 'wax', 'lynx', 'meet', 'proton'];
    let isExist = networks.findIndex((item) => item === network);
    let icon = '';
    if (isExist === -1) icon = 'eos';
    else icon = network;

    // 是否激活
    if (!active) icon += '-ic';

    return new URL(`../../assets/images/network_icon/${icon}.png`, import.meta.url).href;
};
