<script lang="ts" setup>
import chain from '@/common/lib/chain';
import { ResourceBase } from '@/types/resouse';
const { t } = useI18n();

interface Props {
    memory: ResourceBase;
    ramprice: number;
}
const props = withDefaults(defineProps<Props>(), {});

// 提交准备
const action = ref('');
const placeholder = ref('');
const modalTitle = ref('');
const modalVisible = ref(false);
const beforeSubmit = async (value: string) => {
    action.value = value;

    if (value == 'buyRam') {
        placeholder.value = props.memory.core_liquid_balance;
        modalTitle.value = t('resource.buy') + ' ' + t('resource.ram');
    } else if (value == 'sellRam') {
        placeholder.value = ((props.memory.use_limit.max - props.memory.use_limit.used) / 1024).toFixed(4) + ' KB';
        modalTitle.value = t('resource.sell') + ' ' + t('resource.ram');
    }
    modalVisible.value = true;
};

const walletStore = useWalletStore();
const receiver = ref(walletStore.currentWallet.name);

// 提交表单
const inputValue = ref(0);
const submitLoading = ref(false);
const { currentSymbol } = useChainStore();
const emit = defineEmits(['loadData']);
const onSubmit = async () => {
    if (!receiver.value) return window.msg.warning(t('wallet.emptyReceiver'));
    else if (receiver.value.length != 42 && receiver.value.length > 12)
        return window.msg.warning(t('wallet.errorReceiver'));
    if (!inputValue.value || inputValue.value == 0) return window.msg.warning(t('resource.valueError'));

    try {
        // 发起操作
        submitLoading.value = true;
        let result = {};
        // 购买
        if (action.value == 'buyRam') {
            const precision = useChainStore().currentNetwork.token.precision;
            let value = inputValue.value.toFixed(precision) + ' ' + currentSymbol;
            result = await chain.getApi().buyRam(walletStore.currentWallet.name, receiver.value, value, chain.getAuth());
        }
        // 出售
        else if (action.value == 'sellRam') {
            let value = parseInt(inputValue.value * 1024 + '');
            if (value <= 15) {
                modalVisible.value = false;
                submitLoading.value = false;
                return window.msg.warning(t('resource.valueSizeError'));
            }
            result = await chain.getApi().sellRam(walletStore.currentWallet.name, value, chain.getAuth());
        }
        window.msg.success(t('resource.stakeSuccess'));

        // 清空输入框
        inputValue.value = 0;
        //刷新数据
        emit('loadData');
    } catch (e) {
        console.log(e);
        window.msg.error(chain.getErrorMsg(e));
    } finally {
        modalVisible.value = false;
        submitLoading.value = false;
    }
};
</script>

<template>
    <div class="grid-content">
        <!-- title -->
        <div class="title">
            {{ $t('resource.ram') }}
        </div>
        <div class="content">
            <!-- used -->
            <div class="progress-content">
                <div class="progress-text">
                    <span>{{ $t('resource.used') }}</span>
                    <span>
                        {{ (memory.use_limit.used / 1024).toFixed(2) }} KB /
                        {{ (memory.use_limit.max / 1024).toFixed(2) }}
                        KB
                    </span>
                </div>
                <n-progress
                    :percentage="memory.use_percentage"
                    :show-text="false"
                    :stroke-width="9"
                    :show-indicator="false"
                    class="progress"
                ></n-progress>
            </div>

            <!-- price -->
            <div class="content-line line1">
                <div class="item">
                    <span>{{ $t('resource.price') }}</span>
                    <span class="small">{{ props.ramprice.toFixed(4) }} {{ currentSymbol }}/KB</span>
                </div>
            </div>

            <!-- buy or sell -->
            <div class="content-line line2">
                <n-button class="mr-2" @click="beforeSubmit('buyRam')">
                    {{ $t('resource.buy') }}
                </n-button>
                <n-button @click="beforeSubmit('sellRam')">{{ $t('resource.sell') }}</n-button>
            </div>
        </div>

        <!-- submit form -->
        <modal :is-show="modalVisible" :title="modalTitle" @close="modalVisible = false" @submit="onSubmit()">
            <div class="dialog-item p-4">
                <span class="label">{{ $t('resource.stakeReceiver') }}</span>
                <n-input v-model:value="receiver"></n-input>
            </div>
            <div class="dialog-item px-4">
                <span class="label">{{ $t('resource.amount') }}</span>
                <n-input-number
                    :placeholder="placeholder"
                    v-model:value="inputValue"
                    :min="0"
                    :precision="4"
                    :step="0.1"
                    clearable
                >
                    <template #suffix>
                        <span class="text-gray-400 text-sm">EOS</span>
                    </template>
                </n-input-number>
            </div>
        </modal>
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
                    }
                }
            }
            &.line2 {
                padding: 8px 0;
                display: flex;
                flex-direction: row;
                justify-content: flex-end;
                .n-button {
                    background: rgba(252, 252, 252, 0.4);
                    box-shadow: 0px 1px 3px 0px rgba(255, 66, 216, 0.11);
                    border-radius: 10px;
                    border: 1px solid #dbdbdb;
                    width: 73px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    color: #222;
                    font-weight: 500;
                }
                .n-button:focus,
                .n-button:hover {
                    background: rgba(252, 252, 252, 1);
                }
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
    .dialog-item {
        margin-bottom: 10px;
        span.label {
            display: block;
            line-height: 20px;
            padding-bottom: 3px;
        }
    }
    .dialog-foot {
        padding: 15px 0;
        display: flex;
        flex-direction: row;
        justify-content: center;
        .n-button {
            flex-flow: 1;
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
