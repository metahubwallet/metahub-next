<script setup lang="ts">
import { Wallet } from '@/store/wallet/type';
import { eosChainId, getNetworkLocalIcon } from '@/common/util/network';
import { sha256, md5, encrypt } from '@/common/util/crypto';
import bs58 from 'bs58';
import { Address } from 'ethereumjs-util';
import chain from '@/common/lib/chain';
import { getKeyAccounts, lightKey } from '@/common/lib/remote';

const { t } = useI18n();
const route = useRoute();

// get network
const { networks } = store.chain();
const chainId = ref(route.query.chainId ? (route.query.chainId as string) : eosChainId);
const activeIndex = ref(networks.findIndex((item) => item.chainId === chainId.value));
const getNetworkIcon = (chainId: string) => {
    const chain = store.chain().findNetwork(chainId)?.chain;
    return getNetworkLocalIcon(chain);
};

// select network
watch(
    activeIndex,
    (index) => {
        chainId.value = networks[index].chainId;
        store.chain().setCurrentNetwork(networks[index]);
    },
    { immediate: true }
);

// import wallet
const checked = ref(true);
const accountList = ref([] as Wallet[]);
const importKeyHandle = async () => {
    /** 判断协议勾选 */
    if (!checked.value) return window.msg.warning('请仔细阅读协议,并勾选');

    /** 循环遍历需要取的协议 */
    const importAccounts = [];
    let tipMessage = t('public.noAccountForPrivateKey');
    let isKey = chain.get().isValidPrivate(privateKey.value);

    let ethAddress = '';
    if (!isKey && privateKey.value.length == 64) {
        const privateKeyHex = Buffer.from(privateKey.value, 'hex');
        ethAddress = Address.fromPrivateKey(privateKeyHex).toString();

        let versionedKey = '80' + privateKey.value;
        const sha256dKey: any = sha256(Buffer.from(versionedKey, 'hex'));
        const checksum = sha256(Buffer.from(sha256dKey, 'hex')).toString().substring(0, 8);
        versionedKey += checksum;

        privateKey.value = bs58.encode(new Uint8Array(Buffer.from(versionedKey, 'hex')));
        isKey = true;
    }
    if (isKey) {
        let network = store.chain().networks.find((x) => x.chainId == chainId.value);
        let chainAccount: any = {};
        chainAccount.chainId = network?.chainId;
        chainAccount.seed = sha256('metahub' + Math.random(), new Date().toString() as any)
            .toString()
            .substring(0, 16)
            .toUpperCase();
        chainAccount.blockchain = 'eos'; // eth, tron ...
        chainAccount.smoothMode = false; // 默认关闭顺畅模式
        const publicKey = chain.get(network?.chainId).privateToPublic(privateKey.value);

        const privateValue = encrypt(
            privateKey.value,
            md5(chainAccount.seed + store.user().password)
        );
        const key = { publicKey, privateKey: privateValue, permissions: [] };
        chainAccount.keys = [key];
        try {
            let accounts: any = [];
            accounts = await getKeyAccounts(network?.chain as lightKey, publicKey).catch(() => {
                accounts = [];
            });

            if (accounts.length == 0)
                if (accounts.length == 0)
                    accounts = await chain.get(network?.chainId).getKeyAccounts(publicKey);
            tipMessage = t('public.noAccountForPrivateKey');

            for (let account of accounts) {
                const newAccount = Object.assign({}, chainAccount);
                newAccount.name = account; // real eos account
                newAccount.account = ethAddress != '' ? ethAddress : account;

                let existed = false;
                for (let i = 0; i < store.wallet().wallets.length; i++) {
                    const element = store.wallet().wallets[i];
                    if (
                        element.name === newAccount.name &&
                        element.chainId === newAccount.chainId
                    ) {
                        existed = true;
                        break;
                    }
                }
                if (existed) tipMessage = t('public.accountExists');
                else importAccounts.push(newAccount);
            }
        } catch (e) {
            console.log(e);
        }
    } else tipMessage = t('public.invaildPrivateKey');

    importAccounts.sort(sortAccounts);

    if (importAccounts.length > 1) {
        accountList.value = importAccounts;
        isShowChoose.value = true;
    } else if (importAccounts.length == 1) {
        await importWallet(importAccounts);
    } else window.msg.error(tipMessage);
};

// import wallet
const router = useRouter();
const privateKey = ref('');
const emit = defineEmits(['refreshTokens']);
const importWallet = async (wallets: Wallet[]) => {
    for (const wallet of wallets) {
        await chain.fetchPermissions(wallet.name, wallet.chainId);
    }
    store.wallet().setWallets([...store.wallet().wallets, ...wallets.sort(sortAccounts)]);

    const firstWallet = wallets[0];
    let index = store.wallet().wallets.indexOf(firstWallet);
    store.wallet().setSelectedIndex(index >= 0 ? index : 0);

    setTimeout(() => {
        emit('refreshTokens', true);
    }, 100);

    window.msg.success(t('wallet.importSuccess'));
    privateKey.value = '';
    router.go(-1);
};

// select wallet
const isShowChoose = ref(false);
const selectWalletHandle = async (selectWallets: Wallet[]) => {
    if (selectWallets.length < 1) return window.msg.warning(t('wallet.selectOneAtLeast'));

    await importWallet(selectWallets);
};

// sort account
const sortAccounts = (first: any, second: any) => {
    if (first.chainId == second.chainId) {
        return first.name > second.name ? 1 : -1;
    } else {
        if (first.chainId == eosChainId) return -1;
        if (second.chainId == eosChainId) return 1;
        return first.chainId > second.chainId ? 1 : -1;
    }
};
</script>

<template>
    <div class="full-router">
        <div class="full-inner">
            <page-header :title="$t('public.importKey')"></page-header>

            <div class="cover-content _effect pr-[15px]">
                <div class="import-key-container">
                    <div class="import-key-tip mb-[10px]">{{ $t('public.importNetTip') }}:</div>
                    <n-popover
                        style="max-height: 250px"
                        trigger="click"
                        scrollable
                        placement="bottom"
                    >
                        <template #trigger>
                            <div
                                class="border border-[#DBDBDB] shadow-sm h-[71px] w-full rounded-[12px] flex items-center justify-between px-[20px]"
                            >
                                <div class="flex items-center">
                                    <img :src="getNetworkIcon(chainId)" class="icon-img mr-[6px]" />
                                    <span style="color: #3a3949; font-size: 14px">
                                        {{ networks[activeIndex].name }}
                                    </span>
                                </div>

                                <icon-down-one theme="filled" size="18" fill="#4a4a4a" />
                            </div>
                        </template>
                        <div
                            v-for="(item, index) of networks"
                            :key="index"
                            class="flex items-center !w-full py-[10px] pr-[90px] pl-[10px] duration-200"
                            :class="activeIndex === index ? 'bg-slate-200' : ''"
                            @click="activeIndex = index"
                        >
                            <img :src="getNetworkIcon(item.chainId)" class="icon-img mr-[6px]" />
                            <span style="color: #3a3949; font-size: 14px">
                                {{ item.name }}
                            </span>
                        </div>
                    </n-popover>

                    <div class="import-key-tip">{{ $t('public.importKeyTip') }}:</div>
                    <n-input
                        :autosize="{ minRows: 5, maxRows: 5 }"
                        :placeholder="$t('public.importKeyTip')"
                        class="import-key-input"
                        type="textarea"
                        v-model:value="privateKey"
                    ></n-input>
                    <n-checkbox class="import-key-protocol" v-model:checked="checked"></n-checkbox>
                    <span
                        class="check-tip text-center cursor-pointer ml-[4px]"
                        @click="checked = !checked"
                    >
                        {{ $t('public.readAndAgree') }}
                        <span
                            @click="$router.push({ name: 'import-protocol' })"
                            class="protocol-tip"
                        >
                            {{ $t('public.readAndAgreeProtocols') }}
                        </span>
                    </span>
                    <n-button @click="importKeyHandle" class="import-key-btn">
                        {{ $t('public.importKey') }}
                    </n-button>
                </div>
            </div>

            <import-choose
                :is-show="isShowChoose"
                :accountList="accountList"
                @close="isShowChoose = false"
                @import="selectWalletHandle"
            ></import-choose>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.icon-img {
    width: 24px;
    height: 24px;
}
.import-key-container {
    padding-left: 15px;

    .import-key-tip {
        font-size: 12px;
        color: #222;
        margin-top: 20px;
    }
    .import-key-input {
        margin-top: 10px;
        font-size: 14px;
        color: #999999;
        width: 345px;
    }
    .import-key-protocol {
        margin-top: 8px;
        font-size: 14px;
        color: #999999;
        margin-right: 0px;
    }
    .import-key-btn {
        background: linear-gradient(140deg, #da00f2 0%, #bf01fa 100%, #bf01fa 100%);
        box-shadow: 0px 2px 6px 0px rgba(210, 0, 244, 0.09);
        border-radius: 50px;
        width: 178px;
        height: 44px;
        margin: auto;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #ffffff;
        line-height: 20px;
        text-shadow: 0px 2px 6px rgba(210, 0, 244, 0.09);
        margin-top: 58px;
        &:active {
            border-color: $color-primary;
        }
    }
    .check-tip {
        color: #999999;
        font-size: 12px;
    }
    .protocol-tip {
        color: $color-primary;
        cursor: pointer;
    }
}
</style>
