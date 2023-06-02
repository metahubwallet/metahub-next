<script lang="ts" setup>
import _ from 'lodash';
import chain from '@/common/libs/chain';
import { sha256, md5, encrypt } from '@/common/utils/crypto';
import { eosChainId, getNetworkLocalIcon } from '@/common/utils/network';
import { getKeyAccounts } from '@/common/libs/remote';
import bs58 from 'bs58';
import { Address } from 'ethereumjs-util';

const route = useRoute();

const checked = ref(true);
const privateKey = ref('');

const isShowChangeAccount = ref(false);
const importAccountList = ref([]);
const chainId = ref<any>(route.query.chainId ? route.query.chainId : eosChainId);
const options = ref<any>([]);

const { networks } = store.chain();
onBeforeMount(() => {
    for (const network of networks) {
        options.value.push({
            value: network.chainId,
            label: '   ' + network.name,
        });
    }
});

const handleBGClick = () => {
    isShowChangeAccount.value = false;
};

const { t } = useI18n();
const handleImportClick = async () => {
    /** 判断协议勾选 */
    if (!checked.value) return window.msg.warning('请仔细阅读协议,并勾选');

    /** 循环遍历需要取的协议 */
    const importAccounts = [];
    let tipMessage = t('public.noAccountForPrivateKey');
    let isKey = false;
    // let isKey = chain.get().isValidPrivate(privateKey.value);
    let ethAddress = '';
    if (!isKey && privateKey.value.length == 64) {
        const privateKeyHex = Buffer.from(privateKey.value, 'hex');
        // ethAddress = Address.fromPrivateKey(privateKeyHex).toString();

        let versionedKey = '80' + privateKey.value;
        const sha256dKey: any = sha256(Buffer.from(versionedKey, 'hex') as any);
        const checksum = sha256(Buffer.from(sha256dKey, 'hex') as any)
            .toString()
            .substring(0, 8);
        versionedKey += checksum;

        privateKey.value = bs58.encode(new Uint8Array(Buffer.from(versionedKey, 'hex')));
        isKey = true;
    }
    if (isKey) {
        let network = store.chain().networks.find((x) => x.chainId == chainId.value);
        let chainAccount: any = {};
        chainAccount.chainId = network.chainId;
        chainAccount.seed = sha256('metahub' + Math.random(), new Date().toString() as any)
            .toString()
            .substring(0, 16)
            .toUpperCase();
        chainAccount.blockchain = 'eos'; // eth, tron ...
        chainAccount.smoothMode = false; // 默认关闭顺畅模式
        const publicKey = '';
        // const publicKey = chain.get(network.chainId).privateToPublic(privateKey.value);
        privateKey.value = encrypt(
            privateKey.value,
            md5(chainAccount.seed + store.user().password)
        );
        const key = { publicKey, privateKey, permissions: [] };
        chainAccount.keys = [key];
        try {
            let accounts: any = [];
            try {
                // accounts = await getKeyAccounts(network.chain, publicKey);
            } catch (e) {
                accounts = [];
            }
            if (accounts.length == 0) {
                // accounts = await chain.get(network.chainId).getKeyAccounts(publicKey);
            }
            if (accounts.length == 0) {
                tipMessage = t('public.noAccountForPrivateKey');
            }
            for (let account of accounts) {
                const newAccount = Object.assign({}, chainAccount);
                newAccount.name = account; // real eos account
                newAccount.account = ethAddress != '' ? ethAddress : account; // account (display)

                let existed = false;
                for (let i = 0; i < store.user().wallets.length; i++) {
                    const element = store.user().wallets[i];
                    if (
                        element.name === newAccount.name &&
                        element.chainId === newAccount.chainId
                    ) {
                        existed = true;
                        break;
                    }
                }
                if (existed) {
                    tipMessage = t('public.accountExists');
                } else {
                    importAccounts.push(newAccount);
                }
            }
        } catch (e) {
            console.log(e);
        }
    } else {
        tipMessage = t('public.invaildPrivateKey');
    }

    importAccounts.sort(sortAccounts);

    if (importAccounts.length > 1) {
        importAccountList.value = importAccounts as any;
        isShowChangeAccount.value = true;
    } else if (importAccounts.length == 1) {
        await importWallets(importAccounts);
        return;
    } else {
        window.msg.error(tipMessage);
    }
};

const handleSelectedImportClick = async (selectedWallets: any) => {
    if (selectedWallets.length < 1) return window.msg.warning(t('wallet.selectOneAtLeast'));
    await importWallets(selectedWallets);
};

const sortAccounts = (f: any, s: any) => {
    if (f.chainId == s.chainId) {
        return f.name > s.name ? 1 : -1;
    } else {
        if (f.chainId == eosChainId) {
            return -1;
        }
        if (s.chainId == eosChainId) {
            return 1;
        }
        return f.chainId > s.chainId ? 1 : -1;
    }
};

const router = useRouter();
const emit = defineEmits(['refreshTokens']);
const importWallets = async (wallets: any) => {
    for (const wallet of wallets) {
        store.user().wallets.push(wallet);
        // await chain.fetchPermissions(wallet.name, wallet.chainId);
    }
    store.user().wallets.sort(sortAccounts);

    const firstWallet = wallets[0];
    let index = store.user().wallets.indexOf(firstWallet);
    store.user().selectedIndex = index >= 0 ? index : 0;

    setTimeout(() => {
        emit('refreshTokens', true);
    }, 100);

    window.msg.success(t('wallet.importSuccess'));
    privateKey.value = '';
    router.go(-1);
};

const getNetworkIcon = (chainId: string) => {
    const chain = store.chain().findNetwork(chainId).chain;
    return getNetworkLocalIcon(chain);
};
</script>

<template>
    <div class="full-router">
        <div class="full-inner">
            <top-handle :back-text="$t('auth.back')" :title="$t('public.importKey')"></top-handle>
            <div class="cover-content _effect">
                <div class="import-key-container">
                    <div class="import-key-tip">{{ $t('public.importNetTip') }}:</div>
                    <n-select
                        v-model="chainId"
                        size="small"
                        style="width: 80%; margin-top: 10px; padding-right: 15px"
                    >
                        <img slot="prefix" :src="getNetworkIcon(chainId)" class="icon-img" />
                        <!-- <n-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                            <img :src="getNetworkIcon(item.value)" class="icon-img" />
                            <span style="color: #3a3949; font-size: 14px">
                                &nbsp;{{ item.label }}
                            </span>
                        </n-option> -->
                    </n-select>
                    <div class="import-key-tip">{{ $t('public.importKeyTip') }}:</div>
                    <n-input
                        :autosize="{ minRows: 5, maxRows: 5 }"
                        :placeholder="$t('public.importKeyTip')"
                        class="import-key-input"
                        type="textarea"
                        v-model="privateKey"
                    ></n-input>
                    <n-checkbox class="import-key-protocol" v-model="checked"></n-checkbox>
                    <span class="check-tip text-center cursor-pointer">
                        {{ $t('public.readAndAgree') }}
                        <span
                            @click="$router.push({ name: 'import-protocol' })"
                            class="protocol-tip"
                        >
                            {{ $t('public.readAndAgreeProtocols') }}
                        </span>
                    </span>
                    <n-button @click="handleImportClick" class="import-key-btn">
                        {{ $t('public.importKey') }}
                    </n-button>
                </div>
            </div>
            <div
                @click="handleBGClick"
                class="account-selector-container"
                v-if="isShowChangeAccount"
            >
                <import-choose
                    @close-click="handleBGClick"
                    @import-click="handleSelectedImportClick"
                    v-bind:accountList="importAccountList"
                ></import-choose>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/css/color.scss';
.account-selector-container {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    background-color: rgba(0, 0, 0, 0.75);
    display: flex;
    flex-direction: column-reverse;
}

.icon-img {
    width: 24px;
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
            border-color: $primary-color;
        }
    }
    .check-tip {
        color: #999999;
        font-size: 12px;
    }
    .protocol-tip {
        color: $primary-color;
        cursor: pointer;
    }
}
</style>
