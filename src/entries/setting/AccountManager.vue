<script setup lang="ts">
import { Account } from '@/store/chain/types';
import _ from 'lodash';

const chainId = ref(useRoute().query.chainId);
const dialogImportVisible = ref(false);

const wallets = computed(() => {
    let ws: any = [];
    store
        .user()
        .wallets.filter((x) => x.chainId == chainId.value)
        .map((x) => {
            const wallet = _.clone(x);
            wallet.symbol = store.chain().findNetwork(x.chainId).token.symbol;
            ws.push(wallet);
        });
    return ws;
});

const router = useRouter();
const accountClicked = (account: Account) => {
    router.push({
        path: '/account/detail',
        query: { account: JSON.stringify(account), chainId: chainId.value },
    });
};
</script>

<template>
    <div class="full-router">
        <div class="full-inner">
            <top-handle
                :back-text="$t('auth.back')"
                :title="$t('setting.manageWallets')"
            ></top-handle>
            <div class="cover-content _effect">
                <n-scrollbar>
                    <div class="container">
                        <div
                            @click="accountClicked(item)"
                            class="wallet-cell"
                            v-bind:key="item.name"
                            v-for="item in wallets"
                        >
                            <div class="cell-name">
                                {{ item.name }}
                            </div>
                            <img class="arrow-img" src="@/assets/images/right_arrow@2x.png" />
                        </div>
                        <div @click="$router.push('/wallet/import')" class="import-wallet">
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
@import '@/assets/css/color.scss';

.container {
    padding: 15px;

    .wallet-cell {
        margin-top: 15px;
        background-color: white;
        color: #4a4a4a;
        border-radius: 10px;
        border: $separate-color 1px solid;
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
