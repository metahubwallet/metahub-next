<script setup lang="ts">
import { eosChainId } from '@/common/util/network';

const showExportWallet = ref(false);
const showDestroyWallet = ref(false);
const showChangePassword = ref(false);

// 账号管理
const router = useRouter();
const accountManageHandle = () => {
    // 直接跳转当前账号公链的账号列表
    let currentChainId = store.chain().currentChainId;
    if (!currentChainId) currentChainId = eosChainId;

    router.push({
        name: 'account-manage',
        query: { chainId: currentChainId },
    });
};

// 清除缓存
const { t } = useI18n();
const clearCacheHandle = async () => {
    await localCache.remove('cachedAbis');
    window.msg.success(t('public.executeSuccess'));
};
</script>

<template>
    <div class="full-router">
        <div class="full-inner">
            <page-header :title="$t('setting.manageWallets')"></page-header>

            <div class="cover-content _effect">
                <n-scrollbar class="full">
                    <div class="setting-group">
                        <!-- account manager -->
                        <div @click="accountManageHandle" class="setting-item">
                            <div class="setting-item-left">
                                <div class="item-title">{{ $t('setting.managePermissions') }}</div>
                            </div>
                            <div class="setting-item-right">
                                <img class="bg-img" src="@/asset/img/right_arrow@2x.png" />
                            </div>
                        </div>

                        <!-- export wallet -->
                        <div @click="showExportWallet = true" class="setting-item">
                            <div class="setting-item-left">
                                <div class="item-title">{{ $t('setting.exportWallet') }}</div>
                            </div>
                            <div class="setting-item-right">
                                <img class="bg-img" src="@/asset/img/right_arrow@2x.png" />
                            </div>
                        </div>

                        <!-- destroy wallet -->
                        <div @click="showDestroyWallet = true" class="setting-item">
                            <div class="setting-item-left">
                                <div class="item-title">{{ $t('setting.destroyWallet') }}</div>
                            </div>
                            <div class="setting-item-right">
                                <img class="bg-img" src="@/asset/img/right_arrow@2x.png" />
                            </div>
                        </div>

                        <!-- change password -->
                        <div @click="showChangePassword = true" class="setting-item">
                            <div class="setting-item-left">
                                <div class="item-title">{{ $t('setting.changePassword') }}</div>
                            </div>
                            <div class="setting-item-right">
                                <img class="bg-img" src="@/asset/img/right_arrow@2x.png" />
                            </div>
                        </div>

                        <!-- clear cache -->
                        <div @click="clearCacheHandle" class="setting-item">
                            <div class="setting-item-left">
                                <div class="item-title">{{ $t('setting.clearAbiCache') }}</div>
                            </div>
                            <div class="setting-item-right">
                                <img class="bg-img" src="@/asset/img/right_arrow@2x.png" />
                            </div>
                        </div>
                    </div>
                </n-scrollbar>
            </div>

            <!-- export wallet -->
            <export-wallet
                :is-show="showExportWallet"
                @close="showExportWallet = false"
            ></export-wallet>

            <!-- destroy wallet -->
            <destroy-wallet
                :is-show="showDestroyWallet"
                @close="showDestroyWallet = false"
            ></destroy-wallet>

            <!-- change password -->
            <change-password
                :is-show="showChangePassword"
                @close="showChangePassword = false"
            ></change-password>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.setting-group {
    padding: 0;
    background-color: #fff;

    .setting-item {
        height: 60px;
        border-bottom: 1px solid $color-separate;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        padding-left: 15px;
        padding-right: 15px;

        .setting-item-left {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
        }
        .setting-item-right {
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            align-items: center;
            img {
                width: 7.5px;
                height: auto;
            }
        }
        .item-title {
            font-size: 16px;
            color: #000;
            padding-left: 10px;
        }
        .item-subtitle {
            font-size: 12px;
            color: #cccccc;
            margin-right: 10px;
        }
    }
}
</style>
