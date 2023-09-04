<script setup lang="ts">
import chain from '@/common/lib/chain';
import { ResourceData } from '@/types/resouse';

interface Props {
    resources: { [key: string]: ResourceData };
    type: 'cpu' | 'net';
}
const props = withDefaults(defineProps<Props>(), {});
const emit = defineEmits(['loadData']);

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


const { t } = useI18n();
const walletStore = useWalletStore();

const { currentSymbol } = useChainStore();
const showStakedDetail = ref(false);
const showStakedOtherDetail = ref(false);

const showOptionDialog = ref(false);
const optionAction = ref('');

const refundNow = async () => {
    try {
        await chain.getApi().refund(walletStore.currentWallet.name, chain.getAuth());

        window.msg.success(t('resource.stakeSuccess'));
        emit('loadData');
    } catch (e) {
        window.msg.success(chain.getErrorMsg(e));
    }
};

const showDialog = async (value: string) => {
    optionAction.value = value;
    // open dialog
    showOptionDialog.value = true;
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
                <n-button @click="showDialog('stake')" class="mr-2">
                    {{ $t('resource.stake') }}
                </n-button>
                <n-button @click="showDialog('refund')" class="mr-2">
                    {{ $t('resource.unstake') }}
                </n-button>
                <n-button @click="showDialog('rent')" class="mr-2">
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
            :is-show="showOptionDialog"
            :resources="props.resources"
            :action="optionAction"
            @close="showOptionDialog = false"
            @loadData="emit('loadData')"
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
