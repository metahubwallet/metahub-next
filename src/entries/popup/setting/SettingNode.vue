<script setup lang="ts">
import chain from '@/common/lib/chain';
import { getEndpoints } from '@/common/lib/remote';
import { RPC } from '@/store/chain/type';
import _ from 'lodash';

const route = useRoute();
const chainId = ref(route.query.chainId + '');
const network = ref(store.chain().findNetwork(chainId.value));

// 初始化
const selectedHttpApi = ref('');
onMounted(() => {
    const customRpcs = store.chain().customRpcs[chainId.value];
    customEndpoints.value = Array.isArray(customRpcs) ? customRpcs : [];
    selectedHttpApi.value = store.chain().getSelectedRpc(chainId.value) + '';

    loadRecommendEndpoints();
    pingEndpoints(customEndpoints.value);
});

// 加载默认节点
const loadRecommendEndpoints = async () => {
    const endpoints = await getEndpoints(chainId.value);
    if (endpoints && endpoints.length) {
        for (const endpoint of endpoints) {
            endpoint.delay = '';
        }
        recommendEndpoints.value = endpoints;
        pingEndpoints(recommendEndpoints.value);
    }
};

// ping节点
const pingEndpoints = async (endpoints: RPC[]) => {
    for (let item of endpoints) {
        const startTimestamp = new Date().getTime();
        try {
            await chain.get().testHttpEndpoint(item.endpoint);
            const endTimestamp = new Date().getTime();
            const timeInterval = endTimestamp - startTimestamp;
            item.delay = timeInterval + 'ms';
        } catch (e) {
            item.delay = 'timeout';
        }
    }
};

// 选择节点
const recommendEndpoints = ref<RPC[]>([]);
const selectNodeHandle = (item: RPC) => {
    store.chain().selectedRpc[chainId.value] = item.endpoint;
    store.chain().setSelectedRpc(store.chain().selectedRpc);
    selectedHttpApi.value = item.endpoint;

    try {
        // 更新URL
        chain.get(chainId.value).updateHttpEndpoint(item.endpoint);
        window.msg.success(t('public.executeSuccess'));
    } catch (error) {
        window.msg.error(error);
    }
};

// 移除节点前操作
const { t } = useI18n();
const handleDeleteClick = (item: RPC) => {
    window.dialog.warning({
        title: t('public.tip'),
        content: t('setting.confirmDelete'),
        positiveText: t('public.ok'),
        negativeText: t('public.cancel'),
        onPositiveClick: () => {
            removeCustomEndpoint(item);
        },
        onNegativeClick: () => {},
    });
};

// 移除节点
const customEndpoints = ref<RPC[]>([]);
const removeCustomEndpoint = async (item: RPC) => {
    const index = customEndpoints.value.findIndex((obj) => {
        return item.endpoint === obj.endpoint;
    });
    customEndpoints.value.splice(index, 1);

    saveNode();
};

// 保存节点数据
const saveNode = () => {
    const endpoints = _.cloneDeep(customEndpoints.value);
    for (const api of endpoints) delete api.delay;

    let allCustomRpcs = store.chain().customRpcs;
    if (!allCustomRpcs) allCustomRpcs = {};
    allCustomRpcs[chainId.value] = endpoints;
};

// 新增节点
const showAddNode = ref(false);
const userEnterUrl = ref('');
const addCustomEndpoint = async () => {
    let completeUrl = userEnterUrl.value;
    for (let index in customEndpoints.value) {
        let obj = customEndpoints.value[index];
        if (completeUrl === obj.endpoint) return window.msg.error('Endpoint Exists');
    }
    let isHttp = completeUrl.startsWith('http://');
    let isHttps = completeUrl.startsWith('https://');
    if (!isHttp && !isHttps)
        return window.msg.error('Endpoint must start with http:// or https://');

    const startTimestamp = new Date().getTime();
    try {
        await chain.get().testHttpEndpoint(completeUrl);
    } catch (e) {
        return window.msg.error(chain.getErrorMsg(e));
    }
    let endTimestamp = new Date().getTime();

    userEnterUrl.value = '';
    showAddNode.value = false;
    customEndpoints.value.push({
        name: 'new endpoint',
        endpoint: completeUrl,
        delay: endTimestamp - startTimestamp + 'ms',
    });

    saveNode();
};
</script>

<template>
    <div class="full-router">
        <div class="full-inner">
            <page-header :title="network?.name + ''"></page-header>

            <div class="cover-content _effect">
                <n-scrollbar class="full">
                    <!-- select default node -->
                    <div class="title">{{ $t('setting.defaultNodes') }}</div>
                    <div class="setting-group default-rpcs">
                        <div
                            @click="selectNodeHandle(item)"
                            class="setting-item cursor-pointer"
                            v-for="(item, index) of recommendEndpoints"
                            :key="index"
                        >
                            <div class="setting-title">{{ item.endpoint }}</div>
                            <div class="setting-right flex items-center">
                                <div class="right-text">{{ item.delay }}</div>
                                <img
                                    src="@/asset/img/account_select@2x.png"
                                    class="!w-[20px]"
                                    v-show="selectedHttpApi === item.endpoint"
                                />
                            </div>
                        </div>

                        <n-empty v-show="recommendEndpoints.length == 0" class="m-auto mt-[50%]" />
                    </div>

                    <!-- select custom node -->
                    <div class="title custom" v-if="customEndpoints.length">
                        {{ $t('setting.customNodes') }}
                    </div>
                    <div class="setting-group custom-rpcs" v-if="customEndpoints.length">
                        <div
                            :key="item.endpoint"
                            class="setting-item cursor-pointer flex items-center"
                            v-for="item in customEndpoints"
                        >
                            <div @click="selectNodeHandle(item)" class="setting-title">
                                {{ item.endpoint }}
                            </div>
                            <div class="setting-delete">
                                <icon-delete
                                    theme="outline"
                                    size="16"
                                    fill="#e53e30"
                                    :strokeWidth="3"
                                    class="cursor-pointer"
                                    @click="handleDeleteClick(item)"
                                />
                            </div>
                            <div class="setting-right flex items-center">
                                <div class="right-text">{{ item.delay }}</div>
                                <img
                                    src="@/asset/img/account_select@2x.png"
                                    class="!w-[20px]"
                                    v-show="selectedHttpApi === item.endpoint"
                                />
                            </div>
                        </div>
                    </div>
                    <div @click="showAddNode = true" class="bottom-btn cursor-pointer">
                        {{ $t('setting.addNode') }}
                    </div>
                </n-scrollbar>
            </div>

            <!-- add node -->
            <modal
                :is-show="showAddNode"
                :title="$t('setting.addNode')"
                @close="$emit('close')"
                @submit="addCustomEndpoint"
            >
                <n-input
                    :placeholder="$t('setting.inputNodeAddress')"
                    v-model:value="userEnterUrl"
                ></n-input>
            </modal>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.title {
    width: 100%;
    font-size: 16px;
    line-height: 20px;
    font-weight: 500;
    padding: 15px 0 10px 15px;
}

.title.custom {
    margin-top: 5px;
}

.default-rpcs {
    min-height: 100px;
    .center-text {
        height: 90px;
        color: #666;
    }
}

.setting-group {
    background-color: #fff;
    border-top: 1px solid $color-separate;
}

.setting-item {
    height: 60px;
    border-bottom: 1px solid $color-separate;
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;
    padding-left: 15px;
    padding-right: 15px;

    .setting-title {
        white-space: nowrap;
        word-break: keep-all;
        text-overflow: ellipsis;
        overflow: hidden;
        width: 80%;
    }

    .setting-right {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        width: 20%;
        img {
            width: 7.5px;
            height: auto;
        }
    }

    .right-text {
        font-size: 12px;
        color: #cccccc;
        margin-right: 10px;
    }

    .right-icon {
        color: $color-primary;
        width: 22px;
        height: 44px;
        line-height: 44px;
        text-align: center;
    }
}

.custom-rpcs {
    .setting-title {
        width: calc(80% - 40px);
    }
    .setting-delete {
        width: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}

.bottom-btn {
    position: fixed;
    height: 44px;
    left: 0;
    right: 0;
    bottom: 0;
    color: #fff;
    line-height: 44px;
    text-align: center;
    font-size: 18px;
    font-weight: 500;
    background-color: $color-primary;
}
</style>
