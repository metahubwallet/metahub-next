<script setup lang="ts">
import _ from 'lodash';
import { eosChainId } from '@/common/utils/network';
import { Network } from '@/store/chain/types';

const { t } = useI18n();

const handleDeleteClick = (item: Network) => {
    window.dialog.warning({
        title: t('setting.sureDeletePrefix') + item.name + t('setting.sureDeleteSuffix'),
        content: t('public.tip'),
        positiveText: t('password.submit'),
        negativeText: t('password.cancel'),
        onPositiveClick: () => {
            removeNetwork(item);
        },
        onNegativeClick: () => {},
    });
};

const { networks } = store.chain();
const removeNetwork = (network: Network) => {
    const widx = store.user().wallets.findIndex((x) => x.chainId == network.chainId);
    if (widx >= 0) return alert(t('setting.alreadyExistAccount'));

    const idx = networks.findIndex((x) => x.chainId == network.chainId);
    console.log('idx:' + idx);
    if (idx >= 0) {
        networks.splice(idx, 1);
        store.chain().networks = networks;
        if (store.user().customRpcs[network.chainId])
            delete store.user().customRpcs[network.chainId];
    }
};
</script>

<template>
    <div class="full-router">
        <div class="full-inner">
            <top-handle
                :back-text="$t('auth.back')"
                :title="$t('setting.manageNetworks')"
            ></top-handle>
            <div class="cover-content _effect">
                <n-scrollbar>
                    <!-- 默认节点选择 -->
                    <div class="title">{{ $t('setting.enableNetwork') }}</div>
                    <div class="setting-group">
                        <div :key="item.name" class="setting-item" v-for="item in networks">
                            <div class="item-titles">
                                <div class="item-title">{{ item.name }}</div>
                                <div class="item-remark">
                                    {{
                                        item.chainId.substr(0, 24) +
                                        '...' +
                                        item.chainId.substr(-12)
                                    }}
                                </div>
                            </div>
                            <div class="item-btn">
                                <n-button
                                    icon="el-icon-delete"
                                    circle
                                    v-show="item.chainId != eosChainId"
                                    @click="handleDeleteClick(item)"
                                ></n-button>
                            </div>
                        </div>
                    </div>
                </n-scrollbar>
                <div class="bottom-btns">
                    <div
                        class="btn"
                        @click="
                            $router.push({
                                path: '/network/addNetwork',
                            })
                        "
                    >
                        {{ $t('setting.addExistingNetwork') }}
                    </div>
                    <div
                        class="btn"
                        @click="
                            $router.push({
                                path: '/network/addCustomNetwork',
                            })
                        "
                    >
                        {{ $t('setting.addCustomNetwork') }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/css/color.scss';
.full {
    background-color: $background-color;
    position: relative;
    height: calc(100% - 60px);
}

.bottom-btns {
    position: fixed;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    height: 60px;
    left: 0;
    right: 0;
    bottom: 0;
    color: #fff;
    line-height: 40px;
    .btn {
        width: 42%;
        height: 40px;
        border-radius: 10px;
        text-align: center;
        font-size: 18px;
        font-weight: 500;
        background-color: $primary-color;
        cursor: pointer;
    }
}

.title {
    width: 100%;
    font-size: 16px;
    line-height: 20px;
    font-weight: 500;
    padding: 15px 0 10px 15px;
}

.setting-group {
    border-top: 1px solid $separate-color;
    border-width: 1px 0 1px 0;
    background-color: #fff;
}

.setting-item {
    padding: 10px 0;
    border-bottom: 1px solid $separate-color;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    cursor: pointer;
    padding-left: 15px;
    padding-right: 15px;
    // &:last-child {
    //   border-bottom-width: 0;
    // }
    .item-titles {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        line-height: 20px;
        flex: 1;
    }
    .item-title {
        font-size: 16px;
        color: #333;
        line-height: 26px;
    }
    .item-remark {
        line-height: 24px;
        font-size: 12px;
        color: #999;
        overflow: hidden;
        text-overflow: ellipsis;
        font-family: Consolas, Mono, Menlo, Helvetica, Arial;
    }
}
</style>
