<script lang="ts" setup>
import _ from 'lodash';
import { getNetworkLocalIcon } from '@/common/util/network';
import { Wallet } from '@/store/wallet/type';
import { Network } from '@/store/chain/type';

interface Props {
    isShow: boolean;
}
const props = withDefaults(defineProps<Props>(), {});

// 锁屏
const emit = defineEmits(['close', 'importKey']);
const handleLock = () => {
    emit('close');
    store.user().password = '';
    store.setting().isLock = true;
};

// 获取网络图标
const { networks } = store.chain();
const activeChainId = ref(store.chain().currentChainId);
const getNetworkIcon = (item: Network) => {
    return getNetworkLocalIcon(item.chain, item.chainId == activeChainId.value);
};

// 导入密钥
const importKeyHandle = (chainId: string) => {
    emit('importKey', chainId);
};

// 搜索账号
const searchName = ref('');
const accounts = computed(() => {
    return store
        .wallet()
        .wallets.filter(
            (x) =>
                x.chainId == activeChainId.value &&
                (searchName.value == '' || x.account.includes(searchName.value))
        );
});

// 账号模糊显示
const showAccount = (account: string) => {
    if (account.length <= 12) return account;
    return account.substring(0, 10) + '...' + account.substring(-8, 8);
};

const copy = (value: string) => {
    window.clip(value);
};

// 选择账号
const accountSelectHandle = (account: Wallet) => {
    let index = store.wallet().wallets.indexOf(account);
    store.wallet().selectedIndex = index;
    emit('close');
};

const wallet = store.wallet();
const chain = store.chain();
</script>

<template>
    <popup-bottom :is-show="props.isShow" :title="$t('auth.chooseAccount')" @close="$emit('close')">
        <template #headLeft>
            <img @click="handleLock" class="lock-icon" src="@/asset/img/lock.png" />
        </template>

        <div class="list-container">
            <n-tabs
                placement="left"
                v-model="activeChainId"
                type="line"
                animated
                size="small"
                style="height: 400px"
            >
                <n-tab-pane v-for="item in networks" :key="item.chainId" :name="item.chainId">
                    <template #tab>
                        <div @click="activeChainId = item.chainId">
                            <img :src="getNetworkIcon(item)" class="icon-img m-[7px]" />
                        </div>
                    </template>
                    <n-scrollbar class="full">
                        <div class="accounts">
                            <div class="title-cell" style="border: none">
                                <span>{{ item.name }}</span>

                                <div class="actions">
                                    <div
                                        v-if="searchName != '' || accounts.length >= 8"
                                        class="search-acts"
                                    >
                                        <i class="el-icon-search"></i>
                                        <input
                                            v-model="searchName"
                                            :placeholder="$t('wallet.searchTip')"
                                        />
                                    </div>
                                    <img
                                        v-show="searchName != '' || accounts.length"
                                        @click="importKeyHandle(item.chainId)"
                                        class="add-icon"
                                        src="@/asset/img/account_add.png"
                                    />
                                </div>
                            </div>

                            <div v-show="accounts.length == 0">
                                <n-button
                                    @click="importKeyHandle(item.chainId)"
                                    class="import-key-btn"
                                >
                                    +{{ $t('public.importKey') }}
                                </n-button>
                            </div>

                            <div
                                :key="item.index"
                                @click="accountSelectHandle(item)"
                                class="account-cell"
                                v-for="item in accounts"
                            >
                                <div class="account-left">
                                    <div class="account-left-name">
                                        <span>{{ showAccount(item.account) }}</span>
                                        <img
                                            @click="copy(showAccount(item.account))"
                                            class="account-cell-key-copy"
                                            src="@/asset/img/account_copy.png"
                                        />
                                    </div>
                                    <div class="account-left-key">
                                        {{ item.keys[0].publicKey.substring(0, 8) }}...{{
                                            item.keys[0].publicKey.substring(-16, 16)
                                        }}
                                    </div>
                                </div>
                                <img
                                    class="close"
                                    src="@/asset/img/account_select.png"
                                    v-show="
                                        wallet.selectedIndex == item.index &&
                                        chain.currentChainId === item.chainId
                                    "
                                />
                            </div>
                        </div>
                    </n-scrollbar>
                </n-tab-pane>
            </n-tabs>
        </div>
    </popup-bottom>
</template>

<style lang="scss" scoped>
.account-selector {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: 97;
}

.bg-img {
    width: 7.5px;
    height: auto;
    margin-right: 15px;
}
.lock-icon {
    height: 21px;
    width: auto;
    cursor: pointer;
}
.close {
    cursor: pointer;
    width: 14px;
    height: auto;
}
.add-icon {
    width: auto;
    height: 16px;
    cursor: pointer;
}
.import {
    cursor: pointer;
}

.selector-bg {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 99;
    background-color: rgba(0, 0, 0, 0.75);
}

.selector-container {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 440px;
    z-index: 100;
    border-radius: 8px 8px 0 0;
    background-color: white;
    font-size: 16px;

    .selector-header {
        font-size: 16px;
        color: #222;
        height: 40px;
        border-bottom: 1px solid $color-separate;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .title {
            font-size: 16px;
            color: #222;
            font-weight: bold;
        }
        i {
            margin-right: 17px;
        }
    }

    .import-wallet {
        height: 65px;
        margin-left: 15px;
    }

    .list-container {
        padding: 0;
        overflow: hidden;

        :deep(.n-tabs-tab-pad) {
            display: none !important;
        }

        .icon-img {
            width: 30px;
            height: 30px;
            border-radius: 15px;
        }

        .import-key-btn {
            margin-top: 15px;
            background: $color-primary;
            border-radius: 6px;
            width: 100%;
            height: 40px;
            font-size: 15px;
            font-weight: 400;
            color: #ffffff;
            letter-spacing: 0;
        }
    }

    .accounts {
        padding: 0 15px;
        overflow: visible;
        display: flex;
        flex-direction: column;

        .title-cell {
            font-size: 16px;
            color: #222;
            height: 40px;
            border-bottom: 1px solid $color-separate;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .actions {
            display: flex;
            flex-direction: row;
            align-items: center;
            height: 24px;
            line-height: 1em;
            .search-acts {
                margin-right: 8px;
                display: flex;
                flex-direction: row;
                align-items: center;
                border-bottom: #ddd 1px solid;
                height: 24px;
                i {
                    font-size: 12px;
                    margin-right: 3px;
                }
                input {
                    border: none;
                    width: 70px;
                    color: #666;
                    font-size: 12px;
                    &::placeholder {
                        color: #999;
                    }
                }
            }
        }

        .account-cell {
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 72px;
            background: #030134;
            box-shadow: 0px 2px 4px 0px rgba(3, 1, 52, 0.12);
            border-radius: 12px;
            padding: 15px;
            margin-bottom: 10px;

            .account-left {
                display: flex;
                flex-direction: column;
                justify-content: center;

                .account-left-name {
                    font-size: 14px;
                    color: #ffffff;
                    font-weight: 600;
                    .account-cell-key-copy {
                        height: 10px;
                        width: 11px;
                        cursor: pointer;
                    }
                }
                .account-left-key {
                    color: #ffffff;
                    display: flex;
                    flex-direction: row;
                    font-size: 12px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }
    }
}
</style>