<script lang="ts" setup>
import _ from 'lodash';
import { Wallet } from '@/store/wallet/type';

interface ShownWallet extends Wallet {
    index: number,
    chainName: string,
    isSelected: boolean,
}

interface Props {
    isShow: boolean;
    accountList: Wallet[];
}
const props = withDefaults(defineProps<Props>(), {});

// 初始化wallets(用onMount取不到值)
const wallets = computed(() => {
    return props.accountList.map((item, index) => {
        const network = store.chain().findNetwork(item.chainId);
        return Object.assign(item, {
            index,
            chainName: network ? network.name : 'Unknown',
            isSelected: true,
        }) as ShownWallet;
    });
});


// 导入wallet
const emit = defineEmits(['import', 'close']);
const handleImportWallet = () => {
    let selectedWallets = [];
    for (const wallet of wallets.value) {
        if (wallet.isSelected) {
            selectedWallets.push(props.accountList[wallet.index]);
        }
    }
    emit('import', selectedWallets);
};

// 全选wallet
const isSelectAll = ref(false);
const handleAllSelect = () => {
    for (const wallet of wallets.value) {
        wallet.isSelected = isSelectAll.value;
    }
};

// 选择wallet
const handleSelectWallet = (wallet: any) => {
    wallet.isSelected = !wallet.isSelected;
    const flag = wallets.value.findIndex((item) => {
        return item.isSelected === false;
    });
    isSelectAll.value = flag === -1;
};
</script>

<template>
    <popup-bottom :isCustom="true" :isShow="props.isShow" @close="$emit('close')">
        <div class="box-container">
            <!-- header -->
            <div class="title-cell">
                <div class="title">{{ $t('auth.chooseAccount') }}</div>
                <div class="action">
                    <div @click="handleImportWallet" class="import-button">
                        {{ $t('wallet.importSelectedWallets') }}
                    </div>
                    <n-checkbox v-model:checked="isSelectAll" @change="handleAllSelect">
                        {{ $t('public.selectAll') }}
                    </n-checkbox>
                </div>
            </div>

            <!-- list -->
            <div class="list-container">
                <div :key="'wallet-' + item.index" @click="handleSelectWallet(item)" class="account-cell" v-for="item in wallets">
                    <div class="account-left">
                        <div class="account-left-name">
                            {{ item.chainName }}：
                            <span style="color: #666666">{{ item.name }}</span>
                        </div>
                        <div class="account-left-key">
                            <div class="span-left">{{ item.keys[0].publicKey }}</div>
                            <div class="span-right">{{ item.keys[0].publicKey }}</div>
                        </div>
                    </div>
                    <img v-if="item.isSelected === true" class="close" src="@/asset/img/account_select@2x.png" />
                </div>
            </div>
        </div>
    </popup-bottom>
</template>

<style lang="scss" scoped>
.bg-img {
    width: 7.5px;
    height: auto;
    margin-right: 15px;
}
.import-button {
    border-radius: 4px;
    padding: 0 8px;
    font-size: 12px;
    line-height: 28px;
    background-color: $color-primary;
    color: #fff;
    margin-right: 10px;
    cursor: pointer;
}

.close {
    width: 25px;
    height: auto;
    margin-right: 15px;
}
.box-container {
    background-color: white;
    font-size: 16px;

    .title-cell,
    .import-wallet {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .import-wallet {
        height: 65px;
        margin-left: 15px;
    }

    .list-container {
        max-height: 400px;
        overflow-x: hidden;
        overflow-y: auto;
    }

    .title-cell {
        font-size: 16px;
        color: #333333;
        height: 40px;
        border-bottom: 1px solid $color-separate;
        .title {
            margin-left: 10px;
        }
        .action {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-right: 15px;
        }
    }

    .account-cell {
        margin-left: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 65px;
        border-bottom: 1px solid $color-separate;

        .account-left {
            display: flex;
            flex-direction: column;
            justify-content: center;

            .account-left-name {
                font-size: 15px;
                color: #333333;
                font-weight: 600;
            }
            .account-left-key {
                color: #666666;
                display: flex;
                flex-direction: row;
                font-size: 13px;
                width: 280px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                .span-left {
                    width: 50%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    background-color: white;
                }
                .span-right {
                    width: 50%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    direction: rtl;
                    background-color: white;
                    margin-left: -20px;
                }
            }
        }
    }
}
</style>
