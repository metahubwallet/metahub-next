<script setup lang="ts">
import { Wallet } from '@/types/wallet';

interface ShownWallet extends Wallet {
    symbol: string,
}

const chainId = ref(useRoute().query.chainId);
const wallets = computed(() => {
    return store
        .wallet()
        .wallets.filter((x) => x.chainId === chainId.value)
        .map((x) => {
            const symbol = store.chain().findNetwork(x.chainId)?.token.symbol || '';
            return Object.assign(x, { symbol }) as ShownWallet;
        });
});

// 查看账号详情
const router = useRouter();
const viewAccountDetail = (account: Wallet) => {
    router.push({
        name: 'account-detail',
        query: { account: JSON.stringify(account), chainId: chainId.value },
    });
};
</script>

<template>
    <div class="full-router">
        <div class="full-inner">
            <page-header :title="$t('setting.manageWallets')"></page-header>

            <div class="cover-content _effect">
                <n-scrollbar>
                    <div class="container">
                        <!-- account list -->
                        <div
                            @click="viewAccountDetail(item)"
                            class="wallet-cell"
                            :key="item.name"
                            v-for="item in wallets"
                        >
                            <div class="cell-name">{{ item.name }}</div>
                            <img class="arrow-img" src="@/assets/images/right_arrow@2x.png" />
                        </div>

                        <!-- import wallet -->
                        <div @click="$router.push({ name: 'import-key' })" class="import-wallet">
                            <div class="import-wallet-add">+</div>
                            <div class="import-wallet-tip">{{ $t('public.importKey') }}</div>
                        </div>
                    </div>
                </n-scrollbar>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.container {
    padding: 15px;

    .wallet-cell {
        margin-top: 15px;
        background-color: white;
        color: #4a4a4a;
        border-radius: 10px;
        border: $color-separate 1px solid;
        padding: 15px;
        min-height: 55px;
        font-size: 17px;
        cursor: pointer;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        &:first-child {
            margin-top: 0;
        }

        .cell-name {
            font-size: 18px;
            color: #333333;
            margin-right: 10px;
        }

        .arrow-img {
            max-width: 8px;
            height: auto;
        }
    }
    .import-wallet {
        margin-top: 15px;
        height: 56px;
        border: 1px dashed #999;
        background-color: #ddd;
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        border-radius: 10px;
        cursor: pointer;
        .import-wallet-add {
            color: #666666;
            margin-right: 10px;
            font-size: 22px;
            margin-bottom: 2px;
            font-weight: bold;
        }
        .import-wallet-tip {
            color: #333;
            font-size: 16px;
        }
    }
}
</style>
