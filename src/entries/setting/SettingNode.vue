<script lang="ts" setup>
import chain from '@/common/libs/chain';
import { getEndpoints } from '@/common/libs/remote';
import _ from 'lodash';

const dialogVisible = ref(false);

const loadingHttpApis = ref(true);
const selectedHttpApi = ref('');

const chainId = useRoute().query.chainId as string;
const customEndpoints = ref<any>([]);
const network = store.chain().findNetwork(chainId);
onMounted(() => {
    const customRpcs = store.user().customRpcs[chainId];
    customEndpoints.value = Array.isArray(customRpcs) ? (customRpcs as any) : [];
    selectedHttpApi.value = store.chain().selectedRpc(chainId);
    loadRecommendEndpoints();
    pingEndpoints(customEndpoints); // customEndpoints
});

const recommendEndpoints = ref<any>([]);
const loadRecommendEndpoints = async () => {
    loadingHttpApis.value = true;
    // const endpoints = await getEndpoints(chainId);
    const endpoints = [] as any;
    if (endpoints && endpoints.length) {
        for (const endpoint of endpoints) endpoint.delay = '';
        recommendEndpoints.value = endpoints;
        pingEndpoints(recommendEndpoints); // recommendEndpoints
    }
    loadingHttpApis.value = false;
};

const pingEndpoints = async (endpoints: any) => {
    for (let item of endpoints.value) {
        let startTimestamp = new Date().getTime();
        try {
            // await chain.get().testHttpEndpoint(item.endpoint);
            let endTimestamp = new Date().getTime();
            let timeInterval = endTimestamp - startTimestamp;
            item.delay = timeInterval + 'ms';
        } catch (e) {
            item.delay = 'timeout';
        }
    }
};

const handleNodeSelect = (item: any) => {
    let selectedRpc = store.user().selectedRpc;
    selectedRpc[chainId] = item.endpoint;
    selectedHttpApi.value = selectedRpc = item.endpoint;
    // chain.get(chainId).updateHttpEndpoint(item.endpoint);
};

const { t } = useI18n();
const emit = defineEmits(['removeNetwork']);
const handleDeleteClick = (item: any) => {
    window.dialog
        .warning({
            title: t('setting.confirmDelete'),
            content: t('public.tip'),
            positiveText: t('password.submit'),
            negativeText: t('password.cancel'),
            onPositiveClick: () => {
                emit('removeNetwork', item);
            },
            onNegativeClick: () => {},
        })
        .then(() => {
            removeCustomEndpoint(item);
        })
        .catch(() => {});
};

const removeCustomEndpoint = async (item: any) => {
    for (let index in customEndpoints.value) {
        let obj = customEndpoints.value[index];
        if (item.endpoint === obj.endpoint) {
            customEndpoints.value.splice(index, 1);
            break;
        }
    }
    let endpoints = _.cloneDeep(customEndpoints.value);
    for (const api of endpoints) delete api.delay;

    let allCustomRpcs = store.user().customRpcs;
    if (!allCustomRpcs) allCustomRpcs = {};

    allCustomRpcs[chainId] = endpoints;
    store.user().customRpcs = allCustomRpcs;
};

const userEnterUrl = ref('');
const addCustomEndpoint = async () => {
    let completeUrl = userEnterUrl.value;
    for (let index in customEndpoints.value) {
        let obj = customEndpoints.value[index];
        if (completeUrl === obj.endpoint) {
            window.msg.error('Endpoint Exists');
            return;
        }
    }
    let isHttp = completeUrl.startsWith('http://');
    let isHttps = completeUrl.startsWith('https://');
    if (!isHttp && !isHttps) {
        window.msg.error('Endpoint must start with http:// or https://');
        return;
    }

    const startTimestamp = new Date().getTime();
    try {
        // await chain.get().testHttpEndpoint(completeUrl);
    } catch (e) {
        // window.msg.error(chain.getErrorMsg(e));
        return;
    }
    let endTimestamp = new Date().getTime();

    userEnterUrl.value = '';
    dialogVisible.value = false;
    customEndpoints.value.push({
        endpoint: completeUrl,
        delay: endTimestamp - startTimestamp + 'ms',
    });

    let endpoints = _.cloneDeep(customEndpoints.value);
    for (const api of endpoints) {
        delete api.delay;
    }

    let allCustomRpcs = store.user().customRpcs;
    if (!allCustomRpcs) allCustomRpcs = {};
    allCustomRpcs[chainId] = endpoints;
    store.user().customRpcs = allCustomRpcs;
};
</script>

<template>
    <div class="full-router">
        <div class="full-inner">
            <!-- <top-handle :back-text="$t('auth.back')" :title="network.name"></top-handle> -->
            <top-handle :back-text="$t('auth.back')" title="network-name"></top-handle>
            <div class="cover-content _effect">
                <n-scrollbar>
                    <!-- 默认节点选择 -->
                    <div class="title">{{ $t('setting.defaultNodes') }}</div>
                    <div class="setting-group default-rpcs" v-loading="loadingHttpApis">
                        <div
                            :key="item.name"
                            @click="handleNodeSelect(item)"
                            class="setting-item"
                            v-for="item in recommendEndpoints"
                        >
                            <div class="setting-title">{{ item.endpoint }}</div>
                            <div class="setting-right">
                                <div class="right-text">{{ item.delay || '' }}</div>
                                <div class="right-icon">
                                    <i
                                        class="el-icon-check"
                                        v-show="selectedHttpApi === item.endpoint"
                                    ></i>
                                </div>
                            </div>
                        </div>
                        <div class="center-text" v-show="recommendEndpoints.length == 0">
                            {{ $t('public.noData') }}
                        </div>
                    </div>

                    <!-- 自定义节点选择 -->
                    <div class="title custom" v-if="customEndpoints.length">
                        {{ $t('setting.customNodes') }}
                    </div>
                    <div class="setting-group custom-rpcs" v-if="customEndpoints.length">
                        <div
                            :key="item.endpoint"
                            class="setting-item"
                            v-for="item in customEndpoints"
                        >
                            <div @click="handleNodeSelect(item)" class="setting-title">
                                {{ item.endpoint }}
                            </div>
                            <div class="setting-delete">
                                <n-button
                                    size="tiny"
                                    icon="el-icon-delete"
                                    circle
                                    @click="handleDeleteClick(item)"
                                ></n-button>
                            </div>
                            <div class="setting-right">
                                <div class="right-text">{{ item.delay }}</div>
                                <div class="right-icon">
                                    <i
                                        class="el-icon-check"
                                        v-show="selectedHttpApi === item.endpoint"
                                    ></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div @click="dialogVisible = true" class="bottom-btn">
                        {{ $t('setting.addNode') }}
                    </div>
                </n-scrollbar>
            </div>
        </div>

        <n-modal v-model:show="dialogVisible">
            <n-card style="width: 90%" :title="$t('setting.addNode')">
                <n-input
                    :placeholder="$t('setting.inputNodeAddress')"
                    v-model="userEnterUrl"
                ></n-input>
                <span class="dialog-footer flex justify-between mt-4" slot="footer">
                    <n-button @click="dialogVisible = false">{{ $t('public.cancel') }}</n-button>
                    <n-button @click="addCustomEndpoint" type="primary">
                        {{ $t('public.ok') }}
                    </n-button>
                </span>
            </n-card>
        </n-modal>
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/css/color.scss';
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
    // border: 1px solid $separate-color;
    // border-width: 1px 0 1px 0;
    background-color: #fff;
    cursor: pointer;
    border-top: 1px solid $separate-color;
}

.setting-item {
    height: 60px;
    border-bottom: 1px solid $separate-color;
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
        color: $primary-color;
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
    background-color: $primary-color;
}
</style>
