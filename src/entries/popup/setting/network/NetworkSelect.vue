<script setup lang="ts">
const { networks, getSelectedRpc } = store.chain();
const router = useRouter();

// 选择网络
const type = ref(useRoute().query.type);
const handleNodeSelect = (chainId: string) => {
    if (type.value === 'node') {
        router.push({
            name: 'setting-node',
            query: { chainId },
        });
    } else {
        router.push({
            name: 'account-manager',
            query: { chainId },
        });
    }
};
</script>

<template>
    <div class="full-router">
        <div class="full-inner">
            <page-header :title="$t('setting.blockchainFoundation')"></page-header>

            <div class="cover-content _effect">
                <n-scrollbar>
                    <div class="setting-group">
                        <!-- network item -->
                        <div
                            :key="item.chainId"
                            @click="handleNodeSelect(item.chainId)"
                            class="setting-item"
                            v-for="item in networks"
                        >
                            <div class="setting-item-left">
                                <div class="item-title">{{ item.name }}</div>
                            </div>
                            <div class="setting-item-right">
                                <div class="item-subtitle">{{ getSelectedRpc(item.chainId) }}</div>
                                <img class="bg-img" src="@/assets/images/right_arrow@2x.png" />
                            </div>
                        </div>
                    </div>
                </n-scrollbar>
            </div>
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
        padding-right: 22px;

        .setting-item-left {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            img {
                width: 30px;
                height: auto;
                margin-right: 15px;
            }
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
