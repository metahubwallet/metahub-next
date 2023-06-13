<script setup lang="ts">
import { Wallet } from '@/store/wallet/type';
import { eosChainId } from '@/common/util/network';

const { t } = useI18n();
const router = useRouter();

const isShowImportChoose = ref(false);
const accountList = ref([]);

// 导入wallets
const privateKey = ref('');
const emit = defineEmits(['refreshTokens']);
const importWallets = async (selectWallets: Wallet[]) => {
    if (selectWallets.length < 1) return window.msg.warning(t('wallet.selectOneAtLeast'));
    for (const wallet of selectWallets) {
        store.wallet().wallets.push(wallet);
        // await chain.fetchPermissions(wallet.name, wallet.chainId);
    }
    store.wallet().wallets.sort(sortAccounts);

    const firstWallet = selectWallets[0];
    let index = store.wallet().wallets.indexOf(firstWallet);
    store.wallet().selectedIndex = index >= 0 ? index : 0;

    setTimeout(() => {
        emit('refreshTokens', true);
    }, 100);

    window.msg.success(t('wallet.importSuccess'));
    privateKey.value = '';
    router.go(-1);
};

// 账号排序
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

            <popup-bottom
                :isCustom="true"
                :isShow="isShowImportChoose"
                @close="isShowImportChoose = false"
            >
                <import-choose @import="importWallets" :accountList="accountList"></import-choose>
            </popup-bottom>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
