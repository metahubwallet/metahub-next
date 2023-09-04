<script setup lang="ts">
import chain from '@/common/lib/chain';
import { getEndpoints } from '@/common/lib/remote';
import { theme } from '@/common/util/theme';
import { RPC } from '@/types/settings';
import _ from 'lodash';

const route = useRoute();
const chainStore = useChainStore();
const chainId = ref(route.query.chainId + '');
const network = ref(chainStore.findNetwork(chainId.value));


// 选择节点
const recommendEndpoints = ref<RPC[]>([]);

const selectedRpc = computed(() => chainStore.selectedRpc(chainId.value));

onMounted(async () => {
    const customRpcs = chainStore.customRpcs[chainId.value];

    customEndpoints.value = Array.isArray(customRpcs) ? customRpcs : [];

    await loadRecommendEndpoints();
    pingEndpoints(customEndpoints.value);
});

// 加载默认节点
const isLoading = ref(false);
const loadRecommendEndpoints = async () => {
    isLoading.value = true;
    const endpoints = await getEndpoints(chainId.value);
    if (endpoints && endpoints.length) {
        for (const endpoint of endpoints) {
            endpoint.delay = '';
        }
        recommendEndpoints.value = endpoints;
        pingEndpoints(recommendEndpoints.value);
    }
    isLoading.value = false;
};

// ping节点
const pingEndpoints = async (endpoints: RPC[]) => {
    for (let item of endpoints) {
        const startTimestamp = new Date().getTime();
        try {
            await chain.getApi().testHttpEndpoint(item.endpoint);
            const endTimestamp = new Date().getTime();
            const timeInterval = endTimestamp - startTimestamp;
            item.delay = timeInterval + 'ms';
        } catch (e) {
            item.delay = 'timeout';
        }
    }
};


const handleSelectNode = (item: RPC) => {
    // useChainStore().selectedRpc[chainId.value] = item.endpoint;
    chainStore.setSelectedRpc(chainId.value, item.endpoint);

    // 更新URL
    try {
        chain.getApi(chainId.value).updateHttpEndpoint(item.endpoint);
    } catch (error) {
        console.log(error);
        window.msg.error(error);
    }
};

// 移除节点
const { t } = useI18n();
const customEndpoints = ref<RPC[]>([]);
const handleDeleteClick = (item: RPC) => {
    if (item.endpoint == chainStore.selectedRpc(chainId.value)) {
        window.msg.warning('can not delete default rpc');
    }
    window.dialog.warning({
        title: t('public.tip'),
        content: t('setting.confirmDelete'),
        positiveText: t('public.ok'),
        negativeText: t('public.cancel'),
        onPositiveClick: () => {
           
            const index = customEndpoints.value.findIndex((obj) => {
                return item.endpoint === obj.endpoint;
            });
            customEndpoints.value.splice(index, 1);
            saveNode();
        },
        onNegativeClick: () => {},
    });
};

// 保存节点数据
const saveNode = () => {
    const endpoints = _.cloneDeep(customEndpoints.value);
    for (const api of endpoints) delete api.delay;

    let allCustomRpcs = useChainStore().customRpcs;
    if (!allCustomRpcs) {
        allCustomRpcs = {};
    }
    allCustomRpcs[chainId.value] = endpoints;
    useChainStore().setCustomRpcs(allCustomRpcs);
};

// 新增节点
const showAddNode = ref(false);
const userEnterUrl = ref('');
const addCustomEndpoint = async () => {
    let completeUrl = userEnterUrl.value;
    for (let index in customEndpoints.value) {
        let obj = customEndpoints.value[index];
        if (completeUrl === obj.endpoint) {
            return window.msg.error('Endpoint Exists');
        }
    }
    let isHttp = completeUrl.startsWith('http://');
    let isHttps = completeUrl.startsWith('https://');
    if (!isHttp && !isHttps) {
        return window.msg.error('Endpoint must start with http:// or https://');
    }

    const startTimestamp = new Date().getTime();
    try {
        await chain.getApi().testHttpEndpoint(completeUrl);
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

            <div class="cover-content _effect pb-[47px]">
                <n-scrollbar class="full">
                    <!-- select default node -->
                    <div class="title"  v-if="recommendEndpoints.length">{{ $t('setting.defaultNodes') }}</div>
                    <div class="setting-group default-rpcs"  v-if="recommendEndpoints.length">
                        <div
                            @click="handleSelectNode(item)"
                            class="setting-item cursor-pointer"
                            v-for="(item, index) of recommendEndpoints"
                            :key="index"
                        >
                            <div class="setting-title">{{ item.endpoint }}</div>
                            <div class="setting-right flex items-center">
                                <div class="right-text">{{ item.delay }}</div>
                                <img
                                    src="@/assets/images/account_select@2x.png"
                                    class="!w-[20px]"
                                    v-show="selectedRpc === item.endpoint"
                                />
                            </div>
                        </div>

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
                            <div @click="handleSelectNode(item)" class="setting-title">
                                {{ item.endpoint }}
                            </div>
                            <div class="setting-right flex items-center">
                                <div class="right-text">{{ item.delay }}</div>
                                <img
                                    src="@/assets/images/account_select@2x.png"
                                    class="!w-[20px]"
                                    v-show="selectedRpc == item.endpoint"
                                />
                                <icon-delete  v-if="selectedRpc !== item.endpoint"
                                    theme="outline"
                                    size="20"
                                    fill="#e53e30"
                                    :strokeWidth="3"
                                    class="cursor-pointer"
                                    @click="handleDeleteClick(item)"
                                />
                            </div>
                        </div>
                    </div>
                </n-scrollbar>
                <div @click="showAddNode = true" class="bottom-btn cursor-pointer">
                    {{ $t('setting.addNode') }}
                </div>
            </div>

            <!-- add node -->
            <modal
                :is-show="showAddNode"
                :title="$t('setting.addNode')"
                @close="showAddNode = false"
                @submit="addCustomEndpoint"
            >
                <n-input :placeholder="$t('setting.inputNodeAddress')" v-model:value="userEnterUrl"></n-input>
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
        flex: 1;
    }

    .setting-right {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
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
