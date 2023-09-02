<script setup lang="ts">
import { eosChainId } from '@/common/util/network';
import { Network } from '@/types/settings';
import _ from 'lodash';

// 确定移除
const { t } = useI18n();
const handleRemove = (item: Network) => {
    window.dialog.warning({
        title: t('public.tip'),
        content: t('setting.sureDeletePrefix') + item.name + t('setting.sureDeleteSuffix'),
        positiveText: t('password.submit'),
        negativeText: t('password.cancel'),
        onPositiveClick: () => {
            removeNetwork(item);
        },
        onNegativeClick: () => {},
    });
};

// 移除网络
const { networks } = store.chain();
const removeNetwork = async (network: Network) => {
    const widx = store.wallet().wallets.findIndex((x) => x.chainId == network.chainId);
    if (widx >= 0) return alert(t('setting.alreadyExistAccount'));

    const idx = networks.findIndex((x) => x.chainId == network.chainId);
    if (idx >= 0) {
        networks.splice(idx, 1);
        store.chain().networks = [...networks];
        await localCache.set('networks', [...networks]);
        if (store.chain().customRpcs[network.chainId]) {
            delete store.chain().customRpcs[network.chainId];
            store.chain().setCustomRpcs(store.chain().customRpcs);
        }
    }
};
</script>

<template>
    <div class="full-router">
        <div class="full-inner">
            <page-header :title="$t('setting.manageNetworks')"></page-header>

            <div class="cover-content _effect pb-[60px]">
                <n-scrollbar class="pr-[14px]">
                    <!-- network item -->
                    <div class="title">{{ $t('setting.enableNetwork') }}</div>
                    <div class="setting-group">
                        <div :key="item.name" class="setting-item" v-for="item in networks">
                            <!-- title -->
                            <div class="item-titles">
                                <div class="item-title">{{ item.name }}</div>
                                <div class="item-remark">
                                    {{
                                        item.chainId.substring(0, 24) +
                                        '...' +
                                        item.chainId.substring(item.chainId.length - 12)
                                    }}
                                </div>
                            </div>
                            <!-- remove button -->
                            <icon-delete
                                theme="outline"
                                size="20"
                                fill="#e53e30"
                                :strokeWidth="3"
                                v-show="item.chainId != eosChainId"
                                @click="handleRemove(item)"
                            />
                        </div>
                    </div>
                </n-scrollbar>

                <!-- add button -->
                <div class="bottom-btns">
                    <div class="btn" @click="$router.push({ name: 'network-add' })">
                        {{ $t('setting.addExistingNetwork') }}
                    </div>
                    <div class="btn" @click="$router.push({ name: 'network-add-custom' })">
                        {{ $t('setting.addCustomNetwork') }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.full {
    background-color: #fff;
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
        background-color: $color-primary;
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
    border-top: 1px solid $color-separate;
    border-width: 1px 0 1px 0;
    background-color: #fff;
}

.setting-item {
    padding: 10px 0;
    border-bottom: 1px solid $color-separate;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    cursor: pointer;
    padding-left: 15px;
    padding-right: 15px;

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
