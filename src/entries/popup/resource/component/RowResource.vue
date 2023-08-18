<script setup lang="ts">
import chain from '@/common/lib/chain';
import { powerup } from '@/common/lib/powerup';
import { ResourceData } from '@/store/wallet/type';

interface Props {
    resources: { [key: string]: ResourceData };
    type: 'cpu' | 'net';
}
const props = withDefaults(defineProps<Props>(), {});

// 使用数据
const resoureUsed = computed(() => {
    return props.resources[props.type] ? (props.resources[props.type].use_limit.used / 1000).toFixed(2) : '0';
});
const resoureTotal = computed(() => {
    return props.resources[props.type] ? (props.resources[props.type].use_limit.max / 1000).toFixed(2) : '0';
});
const resourePercentage = computed(() => {
    return props.resources[props.type] ? props.resources[props.type].use_percentage : 0;
});

// 查看质押详情
const showStakedDetail = ref(false);
const showStakedOtherDetail = ref(false);
const { t } = useI18n();

// 赎回

const wallet = store.wallet();
const emit = defineEmits(['loadData']);
const refundNow = async () => {
    try {
        await chain.getApi().refund(wallet.currentWallet.name, chain.getAuth());

        window.msg.success(t('resource.stakeSuccess'));
        emit('loadData');
    } catch (e) {
        window.msg.success(chain.getErrorMsg(e));
    }
};

// 选择操作
const action = ref('');
const receiverVisible = ref(false);
const transferVisible = ref(false);
const centerDialogVisible = ref(false);
const cpuPlaceholder = ref('');
const netPlaceholder = ref('');
const modalTitle = ref('');
const estimatedCost = ref('~');
const cpuValue = ref(0);
const netValue = ref(0);
const { currentSymbol } = store.chain();
const beforeSubmit = async (value: string) => {
    action.value = value;

    receiverVisible.value = false;
    transferVisible.value = false;
    // 质押
    if (action.value == 'stake') {
        receiverVisible.value = true;
        cpuPlaceholder.value = props.resources.cpu.stake_max + ' ' + currentSymbol;
        netPlaceholder.value = props.resources.net.stake_max + ' ' + currentSymbol;
        modalTitle.value = t('resource.stake') + t('resource.resources');
    }
    // 赎回
    else if (action.value == 'refund') {
        cpuPlaceholder.value = props.resources.cpu.self_delegated_bandwidth_weight;
        netPlaceholder.value = props.resources.net.self_delegated_bandwidth_weight;
        modalTitle.value = t('resource.unstake') + t('resource.resources');
    }
    // 租用
    else if (action.value == 'rent') {
        receiverVisible.value = true;
        cpuPlaceholder.value = formatValue(0);
        netPlaceholder.value = formatValue(0);
        cpuValue.value = 5000;
        netValue.value = 500;
        modalTitle.value = t('resource.rent') + t('resource.resources');

        await getEstimatedCost();
    }

    centerDialogVisible.value = true;
};

// 计算预计花费
const getEstimatedCost = async () => {
    if (action.value == 'rent') {
        let cpu = formatValue(cpuValue.value);
        let net = formatValue(netValue.value);
        let parms = powerup('', '', cpu, net, await getPowupState());
        estimatedCost.value = parms.max_payment;
    }
};

// 格式化值
const formatValue = (value: number) => {
    const precision = store.chain().currentNetwork?.token?.precision;
    return value.toFixed(precision) + ' ' + currentSymbol;
};

// 获取弹出状态
const getPowupState = async () => {
    let powupState = (await localCache.get('powupState', null)) as any;
    if (powupState == null || (powupState && Date.now() - powupState.timestamp > 86400000)) {
        const result = await chain.getApi().getPowupState();
        if (result) {
            powupState = {
                state: result,
                timestamp: Date.now(),
            };
            await localCache.set('powupState', powupState);
        }
    }
    return powupState?.state;
};

// 提交
const receiver = ref(wallet.currentWallet.name);
const transfer = ref(false);
const handleSubmit = async () => {
    let cpuQuantity = formatValue(cpuValue.value);
    let netQuantity = formatValue(netValue.value);

    if (cpuQuantity == formatValue(0) && netQuantity == formatValue(0))
        return window.msg.warning(t('resource.valueError'));
    try {
        if (action.value == 'stake') {
            await chain
                .getApi()
                .delegatebw(
                    wallet.currentWallet.name,
                    receiver.value,
                    netQuantity,
                    cpuQuantity,
                    transfer.value,
                    chain.getAuth()
                );
        } else if (action.value == 'refund') {
            await chain
                .getApi()
                .undelegatebw(wallet.currentWallet.name, receiver.value, netQuantity, cpuQuantity, chain.getAuth());
        } else if (action.value == 'rent') {
            let parms = powerup(
                wallet.currentWallet.name,
                receiver.value,
                cpuQuantity,
                netQuantity,
                await getPowupState()
            );
            console.log(parms);

            await chain.getApi().powerup(parms, chain.getAuth());
        }
        window.msg.success(t('resource.stakeSuccess'));

        //刷新数据
        emit('loadData');
    } catch (e) {
        console.log(e);
        window.msg.error(chain.getErrorMsg(e));
    } finally {
        cpuValue.value = 0;
        netValue.value = 0;
        centerDialogVisible.value = false;
    }
};
</script>

<template>
    <div class="grid-content">
        <!-- title -->
        <div class="title">{{ props.type === 'cpu' ? 'CPU' : $t('resource.net') }}</div>

        <div class="content">
            <!-- used -->
            <div class="progress-content">
                <div class="progress-text">
                    <span>{{ $t('resource.used') }}</span>
                    <span>{{ resoureUsed }} ms / {{ resoureTotal }} ms</span>
                </div>
                <n-progress
                    :percentage="resourePercentage"
                    :show-text="false"
                    :stroke-width="9"
                    :show-indicator="false"
                    class="progress"
                ></n-progress>
            </div>

            <!-- staked detail -->
            <div class="content-line line1">
                <div
                    class="item clickable"
                    @click="
                        showStakedDetail = true;
                        showStakedOtherDetail = false;
                    "
                >
                    <span>{{ $t('resource.staked') }}</span>
                    <span class="small">
                        {{
                            props.resources[props.type].total_resources_weight
                        }}
                    </span>
                </div>
                <div
                    class="item clickable"
                    @click="
                        showStakedDetail = false;
                        showStakedOtherDetail = true;
                    "
                >
                    <span>{{ $t('resource.stakeForOthers') }}</span>
                    <span class="small">
                        {{
                            props.resources[props.type].staked_for_others.toFixed(4) + ' ' + currentSymbol
                        }}
                    </span>
                </div>
            </div>

            <!-- refund -->
            <div
                class="content-line line1"
                v-show="resources[props.type].refund_request.amount"
            >
                <div class="item">
                    <span>{{ $t('resource.refunding') }}</span>
                    <span class="small">
                        {{ resources[props.type].refund_request.amount }}
                    </span>
                </div>
                <div class="item">
                    <span>{{ $t('resource.refunding') }}</span>
                    <span
                        class="small"
                        v-if="resources[props.type].refund_request.amount != 0"
                        :class="{ refund: resources[props.type].refund_request.left_time == '-' }"
                        @click="refundNow()"
                    >
                        {{ resources[props.type].refund_request.left_time == '-' ? $t('resource.refundNow') : resources[props.type].refund_request.left_time }}
                    </span>
                </div>
            </div>

            <!-- button -->
            <div class="content-line line2">
                <n-button @click="beforeSubmit('stake')" class="mr-2">
                    {{ $t('resource.stake') }}
                </n-button>
                <n-button @click="beforeSubmit('refund')" class="mr-2">
                    {{ $t('resource.unstake') }}
                </n-button>
                <n-button @click="beforeSubmit('rent')" class="mr-2">
                    {{ $t('resource.rent') }}
                </n-button>
            </div>
        </div>

        <!-- popup -->
        <staked-detail
            :is-show="showStakedDetail"
            @close="showStakedDetail = false"
            :resources="resources"
            :type="props.type"
        ></staked-detail>

        <staked-other-detail
            :is-show="showStakedOtherDetail"
            @close="showStakedOtherDetail = false"
            @loadData="$emit('loadData')"
            :type="props.type"
        ></staked-other-detail>

        <resource-option
            :is-show="centerDialogVisible"
            :modalTitle="modalTitle"
            v-model:receiver="receiver"
            v-model:cpu-value="cpuValue"
            v-model:net-value="netValue"
            v-model:transfer="transfer"
            :receiver-visible="receiverVisible"
            :cpu-placeholder="cpuPlaceholder"
            :net-placeholder="netPlaceholder"
            :action="action"
            :estimated-cost="estimatedCost"
            :transfer-visible="transferVisible"
            @getEstimatedCost="getEstimatedCost"
            @close="centerDialogVisible = false"
            @submit="handleSubmit"
        ></resource-option>
    </div>
</template>

<style lang="scss" scoped>
.grid-content {
    .title {
        font-size: 16px;
        color: #222;
        letter-spacing: 0;
        padding-left: 15px;
        // margin: 0px 0px 0px 15px;
        line-height: 58px;
        font-weight: bold;
    }

    .content {
        background: #ffffff;
        font-size: 14px;
        color: #333333;
        letter-spacing: 0;
        padding: 0 15px;
        overflow: hidden;
        border-top: 1px solid $color-separate;

        .content-line {
            padding: 0px;
            &.line1 {
                padding: 5px 0;
                display: flex;
                flex-direction: row;
                border-bottom: 1px solid $color-separate;
                .item {
                    width: 50%;
                    height: 28px;
                    line-height: 28px;
                    font-size: 12px;
                    color: #222;
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;
                    &:first-child {
                        padding-right: 15px;
                    }
                    &:nth-child(2) {
                        padding-left: 15px;
                    }
                    &.clickable {
                        cursor: pointer;
                    }
                    span {
                        display: block;
                        &.small {
                            font-weight: 400;
                            font-size: 12px;
                            color: #222;
                        }
                        &.refund {
                            color: $color-primary;
                            cursor: pointer;
                        }
                    }
                }
            }
            &.line2 {
                padding: 8px 0;
                display: flex;
                flex-direction: row;
                justify-content: flex-end;
            }
        }

        .progress-content {
            margin-top: 15px;
            margin-bottom: 5px;
            position: relative;
            .progress-text {
                font-size: 12px;
                font-weight: 400;
                vertical-align: middle;
                color: #222;
                display: flex;
                margin-bottom: 8px;
                display: flex;
                justify-content: space-between;
            }
        }
    }

    .stakedDetail {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 100;
        background-color: rgba(0, 0, 0, 0.75);
        display: flex;
        flex-direction: column-reverse;
    }
}
</style>
